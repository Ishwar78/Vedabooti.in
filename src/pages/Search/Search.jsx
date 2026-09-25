import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FiSearch, FiShoppingBag, FiRefreshCw, FiArrowRight } from "react-icons/fi";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import ProductCard from "../../components/ProductCard";
import api from "../../lib/api";
import "./Search.css";

export default function Search() {
  const [params] = useSearchParams();
  const q = (params.get("q") || "").trim();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/products?status=Active");
        if (isMounted) {
          if (res?.products && Array.isArray(res.products)) {
            setProducts(res.products);
          } else if (Array.isArray(res)) {
            setProducts(res);
          } else {
            setProducts([]);
          }
        }
      } catch (err) {
        console.error("Search fetch products error:", err);
        if (isMounted) setProducts([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const results = useMemo(() => {
    if (!q) return products;
    const term = q.toLowerCase();
    return products.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const subtitle = (p.subtitle || "").toLowerCase();
      const category = (p.category || "").toLowerCase();
      const desc = (p.desc || p.shortDescription || "").toLowerCase();
      const tag = (p.tag || "").toLowerCase();
      return (
        name.includes(term) ||
        subtitle.includes(term) ||
        category.includes(term) ||
        desc.includes(term) ||
        tag.includes(term)
      );
    });
  }, [products, q]);

  return (
    <div className="search-page-wrapper">
      <SiteHeader />
      <main className="search-page container">
        <div className="search-header-block">
          <span className="eyebrow">Search Results</span>
          <h1>Results for “{q || "All Products"}”</h1>
          <p>
            {loading
              ? "Searching our authentic Ayurvedic collection..."
              : `Found ${results.length} authentic product${results.length === 1 ? "" : "s"} matching your search.`}
          </p>
        </div>

        {loading ? (
          <div className="search-loading-state" style={{ padding: "60px 20px", textAlign: "center", color: "#8da497" }}>
            <FiRefreshCw className="spin" size={30} style={{ color: "#d8b56a" }} />
            <p style={{ marginTop: "12px", fontSize: "14px" }}>Finding remedies for you...</p>
          </div>
        ) : results.length === 0 ? (
          <div
            className="search-empty-state"
            style={{
              padding: "60px 24px",
              textAlign: "center",
              background: "#081d14",
              border: "1px dashed rgba(216, 181, 106, 0.25)",
              borderRadius: "14px",
              margin: "30px 0 40px",
            }}
          >
            <FiSearch size={44} style={{ color: "#d8b56a", opacity: 0.6, marginBottom: "10px" }} />
            <h3 style={{ color: "#ffffff", fontSize: "20px", margin: "6px 0" }}>No Products Found</h3>
            <p style={{ maxWidth: "440px", margin: "0 auto 20px", color: "#8da497", fontSize: "13.5px" }}>
              We couldn't find any remedies matching "{q}". Try checking your spelling or explore our entire wellness range.
            </p>
            <Link className="btn" to="/shop" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <FiShoppingBag /> Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid-4" style={{ marginTop: "24px", marginBottom: "40px" }}>
            {results.map((p) => (
              <ProductCard product={p} key={p._id || p.id} />
            ))}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link className="btn dark" to="/shop" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <span>Browse All Ayurvedic Products</span>
            <FiArrowRight />
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
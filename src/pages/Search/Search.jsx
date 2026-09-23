import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import ProductCard from "../../components/ProductCard";
import { allProducts } from "../../data/products";
import "./Search.css";

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const items = q.trim()
    ? allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(q.toLowerCase()) ||
          p.short.toLowerCase().includes(q.toLowerCase())
      )
    : allProducts.slice(0, 4);

  return (
    <div>
      <SiteHeader />
      <main className="search-page container">
        <span className="eyebrow">Search Results</span>
        <h1>Results for “{q || "All Products"}”</h1>
        <p>Explore authentic Ayurvedic products matching your search.</p>
        <div className="grid-4">
          {items.map((x) => (
            <ProductCard product={x} key={x.id} />
          ))}
        </div>
        <Link className="btn dark" to="/shop">
          Browse All Products
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
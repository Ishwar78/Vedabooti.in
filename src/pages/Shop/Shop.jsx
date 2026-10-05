import React, { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
    FiSliders,
    FiSearch,
    FiChevronRight
} from "react-icons/fi";

import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import ProductCard from "../../components/ProductCard";
import api from "../../lib/api";

import "./Shop.css";

export default function Shop() {
    const [searchParams] = useSearchParams();
    const initialCategory = searchParams.get("category") || "All Products";

    const [dbCategories, setDbCategories] = useState([]);
    const [dbProducts, setDbProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cat, setCat] = useState(initialCategory);
    const [sort, setSort] = useState("Featured");
    const [term, setTerm] = useState("");

    useEffect(() => {
        const categoryFromUrl = searchParams.get("category");
        if (categoryFromUrl) {
            setCat(categoryFromUrl);
        }
    }, [searchParams]);

    useEffect(() => {
        let isMounted = true;
        const loadShopData = async () => {
            try {
                const [catRes, prodRes] = await Promise.all([
                    api.get("/api/categories?status=Active"),
                    api.get("/api/products?status=Active")
                ]);

                if (isMounted) {
                    if (catRes && catRes.categories) {
                        setDbCategories(catRes.categories);
                    } else if (Array.isArray(catRes)) {
                        setDbCategories(catRes);
                    }

                    if (prodRes && prodRes.products && Array.isArray(prodRes.products)) {
                        setDbProducts(prodRes.products);
                    } else if (Array.isArray(prodRes)) {
                        setDbProducts(prodRes);
                    } else {
                        setDbProducts([]);
                    }
                }
            } catch (err) {
                console.error("Failed to load shop data:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        loadShopData();
        return () => {
            isMounted = false;
        };
    }, []);

    const categoryTabs = useMemo(() => {
        return ["All Products", ...dbCategories.map((c) => c.name)];
    }, [dbCategories]);

    const activeProductList = dbProducts;

    const categoryCounts = useMemo(() => {
        const counts = {};
        dbCategories.forEach((category) => {
            const cleanName = category.name.toLowerCase().split(" ")[0];
            const count = activeProductList.filter(
                (p) =>
                    (p.category && p.category.toLowerCase().includes(cleanName)) ||
                    (p.subtitle && p.subtitle.toLowerCase().includes(cleanName)) ||
                    p.name.toLowerCase().includes(cleanName)
            ).length;
            counts[category.name] = count;
        });
        return counts;
    }, [dbCategories, activeProductList]);

    const filtered = useMemo(() => {
        let products = activeProductList.filter(product => {
            const selectedCatClean = cat.toLowerCase();
            const categoryMatch =
                cat === "All Products" ||
                (product.category && product.category.toLowerCase().includes(selectedCatClean)) ||
                (product.subtitle && product.subtitle.toLowerCase().includes(selectedCatClean)) ||
                product.name.toLowerCase().includes(selectedCatClean) ||
                selectedCatClean.includes((product.subtitle || "").toLowerCase().split(" ")[0]);

            const searchMatch =
                product.name
                    .toLowerCase()
                    .includes(term.toLowerCase()) ||
                (product.subtitle && product.subtitle.toLowerCase().includes(term.toLowerCase()));

            return categoryMatch && searchMatch;
        });

        if (sort === "Price: Low") {
            products = [...products].sort(
                (a, b) => Number(a.price) - Number(b.price)
            );
        }

        if (sort === "Price: High") {
            products = [...products].sort(
                (a, b) => Number(b.price) - Number(a.price)
            );
        }

        return products;
    }, [activeProductList, cat, sort, term]);

    const PRODUCTS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);

    // Reset to page 1 whenever category, search, or sort changes
    useEffect(() => {
        setCurrentPage(1);
    }, [cat, term, sort]);

    const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE) || 1;

    // Keep currentPage within valid bounds if filtered list shrinks
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
        return filtered.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
    }, [filtered, currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
        setCurrentPage(newPage);
        const scrollTarget = document.querySelector(".shop-toolbar") || document.querySelector(".shop-main");
        if (scrollTarget) {
            scrollTarget.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const getPageNumbers = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        if (currentPage <= 3) {
            return [1, 2, 3, 4, "...", totalPages];
        }
        if (currentPage >= totalPages - 2) {
            return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        }
        return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
    };


    return (

        <div className="shop-page">

            <SiteHeader />

            <main>

                {/* =========================================
                    SHOP HERO
                ========================================= */}

                <section className="shop-hero">

                    <div className="container">

                        <span className="eyebrow">
                            Veda Booti Collection
                        </span>

                        <h1>
                            Our Products
                        </h1>

                        <p>
                            Discover authentic Ayurvedic products
                            for your everyday wellness.
                        </p>

                    </div>

                </section>


                {/* =========================================
                    SHOP CONTENT
                ========================================= */}

                <section className="container shop-main">


                    {/* CATEGORY TABS */}

                    <div className="shop-cats">

                        {categoryTabs.map((category) => (

                            <button
                                type="button"
                                className={
                                    cat === category
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setCat(category)
                                }
                                key={category}
                            >

                                <span>
                                    {category}
                                </span>

                                <FiChevronRight />

                            </button>

                        ))}

                    </div>


                    {/* TOOLBAR */}

                    <div className="shop-toolbar">


                        <button
                            type="button"
                            className="filter-mobile"
                        >

                            <FiSliders />

                            Filters

                        </button>


                        <div className="shop-search">

                            <FiSearch />

                            <input
                                type="text"
                                placeholder="Search in products..."
                                value={term}
                                onChange={e =>
                                    setTerm(e.target.value)
                                }
                            />

                        </div>


                        <span className="product-count">
                            Showing{" "}
                            <strong>
                                {filtered.length === 0
                                    ? 0
                                    : `${(currentPage - 1) * PRODUCTS_PER_PAGE + 1}–${Math.min(
                                          currentPage * PRODUCTS_PER_PAGE,
                                          filtered.length
                                      )}`}
                            </strong>{" "}
                            of <strong>{filtered.length}</strong> products
                        </span>


                        <select
                            className="select sort"
                            value={sort}
                            onChange={e =>
                                setSort(e.target.value)
                            }
                        >

                            <option>
                                Featured
                            </option>

                            <option>
                                Price: Low
                            </option>

                            <option>
                                Price: High
                            </option>

                        </select>

                    </div>


                    {/* SHOP LAYOUT */}

                    <div className="shop-layout">


                        {/* FILTER */}

                        <aside className="filter-panel">

                            <div className="filter-heading">

                                <h3>
                                    Filters
                                </h3>

                                <span>
                                    Refine
                                </span>

                            </div>


                            <div className="filter-group">

                                <b>
                                    Category
                                </b>


                                {dbCategories.map((c) => {
                                    const count = categoryCounts[c.name] ?? 0;
                                    const isSelected = cat === c.name;

                                    return (
                                        <label key={c._id || c.name}>
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() =>
                                                    setCat(
                                                        isSelected
                                                            ? "All Products"
                                                            : c.name
                                                    )
                                                }
                                            />
                                            <span>{c.name}</span>
                                            {/* <small>({count})</small> */}
                                        </label>
                                    );
                                })}

                                {dbCategories.length === 0 && (
                                    <span style={{ fontSize: "12px", color: "#879990", padding: "4px 0" }}>
                                        No categories yet
                                    </span>
                                )}

                            </div>


                            {/* <div className="filter-group">

                                <b>
                                    Price Range
                                </b>

                                <input
                                    type="range"
                                    min="0"
                                    max="1000"
                                    defaultValue="500"
                                />

                                <div className="range-label">

                                    <span>
                                        ₹0
                                    </span>

                                    <span>
                                        ₹1000
                                    </span>

                                </div>

                            </div>


                            <div className="filter-group">

                                <b>
                                    Availability
                                </b>

                                <label>

                                    <input
                                        type="checkbox"
                                    />

                                    <span>
                                        In Stock
                                    </span>

                                </label>

                            </div>


                            <div className="filter-group">

                                <b>
                                    Rating
                                </b>


                                {[5, 4, 3].map(rating => (

                                    <label
                                        key={rating}
                                    >

                                        <input
                                            type="checkbox"
                                        />

                                        <span className="stars">
                                            {"★".repeat(rating)}
                                        </span>

                                        <small>
                                            & Up
                                        </small>

                                    </label>

                                ))}

                            </div> */}

                        </aside>


                        {/* PRODUCTS */}

                        <div className="product-results">
                            {loading ? (
                                <div className="empty-products" style={{ padding: "60px 20px" }}>
                                    <p>Loading authentic remedies...</p>
                                </div>
                            ) : paginatedProducts.length > 0 ? (
                                <div className="product-grid">
                                    {paginatedProducts.map(product => (
                                        <ProductCard
                                            key={product._id || product.id}
                                            product={product}
                                        />
                                    ))}
                                </div>
                            ) : (

                                <div className="empty-products">

                                    <FiSearch />

                                    <h3>
                                        No products found
                                    </h3>

                                    <p>
                                        Try another search
                                        or category.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setTerm("");
                                            setCat("All Products");
                                        }}
                                    >
                                        View All Products
                                    </button>

                                </div>

                            )}


                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        type="button"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        aria-label="Previous Page"
                                    >
                                        ‹
                                    </button>

                                    {getPageNumbers().map((page, idx) => {
                                        if (page === "...") {
                                            return (
                                                <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
                                                    …
                                                </span>
                                            );
                                        }
                                        return (
                                            <button
                                                key={`page-${page}`}
                                                type="button"
                                                className={currentPage === page ? "active" : ""}
                                                onClick={() => handlePageChange(page)}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}

                                    <button
                                        type="button"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        aria-label="Next Page"
                                    >
                                        ›
                                    </button>
                                </div>
                            )}

                        </div>

                    </div>

                </section>

            </main>


            <SiteFooter />

        </div>

    );
}
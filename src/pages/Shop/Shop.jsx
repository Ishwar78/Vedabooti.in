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
import { allProducts } from "../../data/products";
import api from "../../lib/api";

import "./Shop.css";

export default function Shop() {
    const [searchParams] = useSearchParams();
    const initialCategory = searchParams.get("category") || "All Products";

    const [dbCategories, setDbCategories] = useState([]);
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
        const loadCategories = async () => {
            try {
                const res = await api.get("/api/categories?status=Active");
                if (isMounted) {
                    if (res && res.categories) {
                        setDbCategories(res.categories);
                    } else if (Array.isArray(res)) {
                        setDbCategories(res);
                    }
                }
            } catch (err) {
                console.error("Failed to load categories in Shop:", err);
            }
        };
        loadCategories();
        return () => {
            isMounted = false;
        };
    }, []);

    const categoryTabs = useMemo(() => {
        return ["All Products", ...dbCategories.map((c) => c.name)];
    }, [dbCategories]);

    const categoryCounts = useMemo(() => {
        const counts = {};
        dbCategories.forEach((category) => {
            const cleanName = category.name.toLowerCase().split(" ")[0];
            const count = allProducts.filter(
                (p) =>
                    p.subtitle.toLowerCase().includes(cleanName) ||
                    p.name.toLowerCase().includes(cleanName)
            ).length;
            counts[category.name] = count;
        });
        return counts;
    }, [dbCategories]);

    const filtered = useMemo(() => {
        let products = allProducts.filter(product => {
            const selectedCatClean = cat.toLowerCase();
            const categoryMatch =
                cat === "All Products" ||
                product.subtitle.toLowerCase().includes(selectedCatClean) ||
                product.name.toLowerCase().includes(selectedCatClean) ||
                selectedCatClean.includes(product.subtitle.toLowerCase().split(" ")[0]);

            const searchMatch =
                product.name
                    .toLowerCase()
                    .includes(term.toLowerCase());

            return categoryMatch && searchMatch;
        });


        if (sort === "Price: Low") {
            products.sort(
                (a, b) => a.price - b.price
            );
        }


        if (sort === "Price: High") {
            products.sort(
                (a, b) => b.price - a.price
            );
        }


        return products;

    }, [cat, sort, term]);


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
                                {filtered.length}
                            </strong>{" "}
                            products

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
                                            <small>({count})</small>
                                        </label>
                                    );
                                })}

                                {dbCategories.length === 0 && (
                                    <span style={{ fontSize: "12px", color: "#879990", padding: "4px 0" }}>
                                        No categories yet
                                    </span>
                                )}

                            </div>


                            <div className="filter-group">

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

                            </div>

                        </aside>


                        {/* PRODUCTS */}

                        <div className="product-results">


                            {filtered.length > 0 ? (

                                <div className="product-grid">

                                    {filtered.map(product => (

                                        <ProductCard
                                            key={product.id}
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


                            <div className="pagination">

                                <button>
                                    ‹
                                </button>

                                <button className="active">
                                    1
                                </button>

                                <button>
                                    2
                                </button>

                                <button>
                                    3
                                </button>

                                <button>
                                    4
                                </button>

                                <button>
                                    …
                                </button>

                                <button>
                                    ›
                                </button>

                            </div>

                        </div>

                    </div>

                </section>

            </main>


            <SiteFooter />

        </div>

    );
}
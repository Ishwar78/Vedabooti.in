import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    FiSliders,
    FiSearch,
    FiChevronRight
} from "react-icons/fi";

import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import ProductCard from "../../components/ProductCard";
import { allProducts } from "../../data/products";

import "./Shop.css";


const categoryCounts = {
    "Immunity Boosters": 5,
    "Hair Care": 3,
    "Skin Care": 4,
    "Digestive Health": 3,
    "Herbal Teas": 2,
    "Wellness Packs": 4
};


const categories = [
    "All Products",
    "Immunity",
    "Hair Care",
    "Skin Care",
    "Digestive",
    "Herbal Tea",
    "Wellness"
];


export default function Shop() {

    const [cat, setCat] = useState("All Products");
    const [sort, setSort] = useState("Featured");
    const [term, setTerm] = useState("");

    const filtered = useMemo(() => {

        let products = allProducts.filter(product => {

            const categoryMatch =
                cat === "All Products" ||
                product.subtitle
                    .toLowerCase()
                    .includes(
                        cat
                            .toLowerCase()
                            .split(" ")[0]
                    );

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

                        {categories.map(category => (

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


                                {Object.entries(
                                    categoryCounts
                                ).map(
                                    ([name, count]) => (

                                        <label key={name}>

                                            <input
                                                type="checkbox"
                                            />

                                            <span>
                                                {name}
                                            </span>

                                            <small>
                                                ({count})
                                            </small>

                                        </label>

                                    )
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
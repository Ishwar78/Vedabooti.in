import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    FiActivity,
    FiFeather,
    FiArrowUpRight,
    FiLoader,
} from "react-icons/fi";

import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import api, { getCategoryImageUrl } from "../../lib/api";

import "./Categories.css";

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const loadCategories = async () => {
            try {
                const res = await api.get("/api/categories?status=Active");
                if (isMounted) {
                    if (res && res.categories) {
                        setCategories(res.categories);
                    } else if (Array.isArray(res)) {
                        setCategories(res);
                    }
                }
            } catch (err) {
                console.error("Failed to load categories:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadCategories();
        return () => {
            isMounted = false;
        };
    }, []);

    const countDisplay = String(categories.length).padStart(2, "0");

    return (
        <div className="categories-page">
            <SiteHeader />

            <main>
                {/* ================= HERO ================= */}
                <section className="categories-hero">
                    <div className="categories-container">
                        <div className="categories-hero-content">
                            <span className="eyebrow">EXPLORE OUR WORLD</span>
                            <h1>
                                Wellness,
                                <br />
                                <span>Made Natural.</span>
                            </h1>
                            <p>
                                Explore our Ayurvedic collection by your everyday wellness goal and discover thoughtful natural care.
                            </p>
                        </div>

                        <div className="categories-hero-orbit">
                            <div className="orbit-ring ring-one"></div>
                            <div className="orbit-ring ring-two"></div>
                            <div className="orbit-center">
                                <FiFeather />
                                <span>
                                    VEDA
                                    <br />
                                    BOOTI
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ================= CATEGORY SECTION ================= */}
                <section className="categories-container categories-main">
                    <div className="categories-heading">
                        <div>
                            <span className="eyebrow">FIND YOUR WELLNESS</span>
                            <h2>Shop By Category</h2>
                            <p>
                                Choose a wellness goal and explore products curated for your everyday routine.
                            </p>
                        </div>

                        <div className="category-count">
                            <strong>{countDisplay}</strong>
                            <span>
                                Wellness
                                <br />
                                Categories
                            </span>
                        </div>
                    </div>

                    {loading ? (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "60px 0",
                                gap: "10px",
                                color: "#879990",
                            }}
                        >
                            <FiLoader className="spin" style={{ fontSize: "24px" }} />
                            <span>Loading categories...</span>
                        </div>
                    ) : categories.length === 0 ? (
                        <div
                            style={{
                                textAlign: "center",
                                padding: "60px 20px",
                                background: "rgba(255,255,255,0.02)",
                                borderRadius: "14px",
                                border: "1px dashed rgba(255,255,255,0.1)",
                                margin: "30px 0",
                            }}
                        >
                            <FiActivity style={{ fontSize: "36px", color: "var(--gold2, #d5b46a)", marginBottom: "12px" }} />
                            <h3 style={{ color: "#fff", marginBottom: "8px" }}>No Categories Added Yet</h3>
                            <p style={{ color: "#879990", maxWidth: "420px", margin: "0 auto 20px" }}>
                                Categories added from the Admin panel will appear here.
                            </p>
                            <Link to="/shop" className="category-cta-button" style={{ display: "inline-flex" }}>
                                Explore All Products <FiArrowUpRight />
                            </Link>
                        </div>
                    ) : (
                        <div className="category-page-grid">
                            {categories.map((category, idx) => {
                                const itemNumber = String(idx + 1).padStart(2, "0");

                                return (
                                    <Link
                                        to={`/shop?category=${encodeURIComponent(category.name)}`}
                                        className="category-large"
                                        key={category._id || category.name}
                                    >
                                        <div className="category-top">
                                            <span className="category-number">
                                                {category.number || itemNumber}
                                            </span>

                                            <div className="category-icon">
                                                {category.image ? (
                                                    <img
                                                        src={getCategoryImageUrl(category.image)}
                                                        alt={category.name}
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "contain",
                                                            borderRadius: "8px",
                                                        }}
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = "none";
                                                        }}
                                                    />
                                                ) : (
                                                    <FiActivity />
                                                )}
                                            </div>
                                        </div>

                                        <div className="category-content">
                                            <span className="category-subtitle">
                                                {category.subtitle || "Everyday Wellness"}
                                            </span>

                                            <h3>{category.name}</h3>

                                            <p>
                                                {category.description ||
                                                    "Thoughtfully selected herbal care for your everyday routine."}
                                            </p>
                                        </div>

                                        <div className="category-bottom">
                                            <span>Explore Collection</span>
                                            <div className="category-arrow">
                                                <FiArrowUpRight />
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* ================= BOTTOM CTA ================= */}
                <section className="categories-cta">
                    <div className="categories-container">
                        <div className="categories-cta-inner">
                            <div>
                                <span className="eyebrow">YOUR WELLNESS JOURNEY</span>
                                <h2>
                                    Find what your
                                    <br />
                                    <span>body needs.</span>
                                </h2>
                                <p>
                                    From herbal care to daily nutrition, discover natural choices designed for everyday wellness.
                                </p>
                            </div>

                            <Link to="/shop" className="category-cta-button">
                                Explore All Products
                                <FiArrowUpRight />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import {
    FiMinus,
    FiPlus,
    FiHeart,
    FiShoppingBag,
    FiTruck,
    FiShield,
    FiRotateCcw,
    FiChevronDown
} from "react-icons/fi";

import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import ProductCard from "../../components/ProductCard";
import { allProducts, getProductBySlug } from "../../data/products";
import {
    addToCart as addToCartHelper,
    toggleWishlist,
    isInWishlist,
    setDirectCheckoutItem,
    subscribeToStorage
} from "../../lib/cartWishlist";

import "./ProductDetail.css";


export default function ProductDetail() {

    const { slug = "ashwagandha-powder" } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const fallbackProduct = getProductBySlug(slug);
    const passedProduct = location.state?.product;

    // Use passed product if available and matches slug/id, else fallback to database
    const rawProduct = (passedProduct && (passedProduct.slug === slug || String(passedProduct.id) === String(slug)))
        ? { ...fallbackProduct, ...passedProduct }
        : fallbackProduct;

    // Guarantee default properties so no map/destructure crashes
    const product = {
        ...rawProduct,
        points: rawProduct.points && rawProduct.points.length ? rawProduct.points : [
            "Pure herbal formulation",
            "100% natural ingredients",
            "Clinically tested quality",
            "Made in India"
        ],
        reviews: rawProduct.reviews || "850+",
        desc: rawProduct.desc || "Authentic Ayurvedic preparation crafted with natural ingredients for wellness and vitality."
    };

    const relatedProducts = allProducts.filter(p => p.slug !== slug).slice(0, 4);

    const [qty, setQty] = useState(1);
    const [tab, setTab] = useState("Description");
    const [wished, setWished] = useState(false);

    useEffect(() => {
        setWished(isInWishlist(product.id || product.slug));
        return subscribeToStorage(() => {
            setWished(isInWishlist(product.id || product.slug));
        });
    }, [product.id, product.slug]);

    const handleAddToCart = () => {
        addToCartHelper(product, qty);
        navigate("/cart");
    };

    const handleBuyNow = () => {
        const item = { ...product, qty };
        setDirectCheckoutItem(item);
        navigate("/checkout", { state: { directItem: item } });
    };

    const handleWishlistToggle = () => {
        const res = toggleWishlist(product);
        setWished(res.added);
    };

    const discount =
        Math.round(
            (1 - product.price / product.old) * 100
        );


    return (

        <div className="detail-page">

            <SiteHeader />


            <main className="container detail-main">


                {/* ================= BREADCRUMB ================= */}

                <div className="breadcrumbs">

                    <Link to="/">
                        Home
                    </Link>

                    <span>/</span>

                    <Link to="/shop">
                        Shop
                    </Link>

                    <span>/</span>

                    <span>
                        Herbal Supplements
                    </span>

                    <span>/</span>

                    <b>
                        {product.name}
                    </b>

                </div>


                {/* ================= PRODUCT TOP ================= */}

                <section className="detail-top">


                    {/* GALLERY */}

                    <div className="gallery">

                        <div className="thumbs">

                            <button className="active">
                                <span>01</span>
                            </button>

                            <button>
                                <span>02</span>
                            </button>

                            <button>
                                <span>03</span>
                            </button>

                            <button>
                                <span>04</span>
                            </button>

                        </div>


                        <div className="detail-visual">

                            <span className="badge">
                                {product.tag}
                            </span>


                            <button
                                type="button"
                                className={`gallery-heart ${wished ? "active" : ""}`}
                                onClick={handleWishlistToggle}
                                aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                                title={wished ? "Remove from wishlist" : "Add to wishlist"}
                            >
                                <FiHeart style={{ fill: wished ? "#e11d48" : "none", color: wished ? "#e11d48" : "inherit" }} />
                            </button>


                            <div className="product-glow"></div>

                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="detail-real-img"
                                />
                            ) : (
                                <div className="big-jar">

                                    <div className="cap"></div>

                                    <div className="label">

                                        <b>
                                            Veda Booti
                                        </b>

                                        <strong>
                                            {product.name}
                                        </strong>

                                        <small>
                                            Premium Quality
                                            <br />
                                            Natural & Pure
                                        </small>

                                    </div>

                                </div>
                            )}

                            <div className="gallery-caption">
                                <span>
                                    100% Natural
                                </span>

                                <span>
                                    Ayurvedic Care
                                </span>

                                <span>
                                    Made in India
                                </span>
                            </div>

                        </div>

                    </div>


                    {/* PRODUCT INFORMATION */}

                    <div className="detail-info">

                        <span className="eyebrow">
                            Veda Booti Health Care
                        </span>


                        <h1>
                            {product.name}
                        </h1>


                        <h3>
                            {product.subtitle}
                        </h3>


                        <div className="detail-rating">

                            <span className="stars">
                                ★★★★★
                            </span>

                            <b>
                                {product.rating}
                            </b>

                            <span>
                                ({product.reviews} reviews)
                            </span>

                        </div>


                        <div className="detail-price">

                            <strong>
                                ₹{product.price}
                            </strong>

                            <del>
                                ₹{product.old}
                            </del>

                            <b>
                                {discount}% OFF
                            </b>

                        </div>


                        <p className="detail-description">
                            {product.desc}
                        </p>


                        <div className="benefit-mini">

                            {product.points.map(point => (

                                <span key={point}>

                                    <FiShield />

                                    {point}

                                </span>

                            ))}

                        </div>


                        {/* QUANTITY + CART */}

                        <div className="buy-row">

                            <div className="qty">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setQty(
                                            Math.max(
                                                1,
                                                qty - 1
                                            )
                                        )
                                    }
                                >
                                    <FiMinus />
                                </button>


                                <b>
                                    {qty}
                                </b>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setQty(qty + 1)
                                    }
                                >
                                    <FiPlus />
                                </button>

                            </div>


                            <button
                                type="button"
                                className="btn cart-btn"
                                onClick={handleAddToCart}
                            >

                                <FiShoppingBag />

                                Add to Cart

                            </button>


                            <button
                                type="button"
                                className={`icon-btn ${wished ? "active" : ""}`}
                                onClick={handleWishlistToggle}
                                aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                                title={wished ? "Remove from wishlist" : "Add to wishlist"}
                            >
                                <FiHeart style={{ fill: wished ? "#e11d48" : "none", color: wished ? "#e11d48" : "inherit" }} />
                            </button>

                        </div>


                        <button
                            type="button"
                            className="buy-now"
                            onClick={handleBuyNow}
                        >

                            Buy Now

                        </button>


                        <div className="product-meta">

                            <span>
                                SKU: VB-{product.name
                                    .replace(/\s+/g, "-")
                                    .toUpperCase()}
                            </span>

                            <span>
                                Category: Herbal Wellness
                            </span>

                        </div>

                    </div>

                </section>


                {/* ================= SERVICE STRIP ================= */}

                <section className="service-strip">

                    <div>

                        <span className="service-icon">
                            <FiTruck />
                        </span>

                        <div>
                            <b>
                                Free Shipping
                            </b>

                            <small>
                                Orders above ₹499
                            </small>
                        </div>

                    </div>


                    <div>

                        <span className="service-icon">
                            <FiShield />
                        </span>

                        <div>
                            <b>
                                Secure Payments
                            </b>

                            <small>
                                100% safe checkout
                            </small>
                        </div>

                    </div>


                    <div>

                        <span className="service-icon">
                            <FiRotateCcw />
                        </span>

                        <div>
                            <b>
                                Easy Returns
                            </b>

                            <small>
                                Hassle-free returns
                            </small>
                        </div>

                    </div>

                </section>


                {/* ================= PRODUCT TABS ================= */}

                <section className="detail-tabs">


                    <div className="tab-nav">

                        {[
                            "Description",
                            "Benefits",
                            "Ingredients",
                            "How to Use",
                            "FAQs"
                        ].map(tabName => (

                            <button
                                type="button"
                                className={
                                    tab === tabName
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setTab(tabName)
                                }
                                key={tabName}
                            >

                                {tabName}

                                <FiChevronDown />

                            </button>

                        ))}

                    </div>


                    <div className="tab-content">

                        <div className="tab-copy">

                            <span className="content-label">
                                VEDA BOOTI WELLNESS
                            </span>


                            <h2>
                                {tab}
                            </h2>


                            <p>

                                {tab === "Description"
                                    ? product.desc
                                    : tab === "Benefits"
                                        ? "Traditionally used as part of balanced wellness routines. Follow the product label and your healthcare professional's advice where appropriate."
                                        : tab === "Ingredients"
                                            ? "Single-herb formulation with carefully processed botanical ingredients."
                                            : tab === "How to Use"
                                                ? "Refer to the product label for recommended usage, storage and preparation instructions."
                                                : "For product-related questions, please contact our support team for assistance."
                                }

                            </p>


                            <ul>

                                {product.points.map(point => (

                                    <li key={point}>
                                        {point}
                                    </li>

                                ))}

                            </ul>

                        </div>


                        <div className="side-promo">

                            <span>
                                PURE HERBS
                            </span>

                            <strong>
                                Stronger
                                <br />
                                Every Day
                            </strong>

                            <small>
                                Natural wellness,
                                thoughtfully packed.
                            </small>


                            <Link
                                to="/shop"
                                className="promo-link"
                            >
                                Explore Products
                                <FiChevronDown />
                            </Link>

                        </div>

                    </div>

                </section>


                {/* ================= RELATED ================= */}

                <section className="related">

                    <div className="section-head">

                        <div>

                            <span className="eyebrow">
                                Complete Your Ritual
                            </span>

                            <h2>
                                You May Also Like
                            </h2>

                        </div>


                        <Link
                            className="btn dark"
                            to="/shop"
                        >
                            View All Products
                        </Link>

                    </div>


                    <div className="grid-4">

                        {relatedProducts.map(item => (

                            <ProductCard
                                product={item}
                                key={item.id}
                            />

                        ))}

                    </div>

                </section>

            </main>


            <SiteFooter />

        </div>

    );
}
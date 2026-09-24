import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import {
    FiMinus,
    FiPlus,
    FiHeart,
    FiShoppingBag,
    FiTruck,
    FiShield,
    FiRotateCcw,
    FiChevronDown,
    FiStar,
    FiUser,
    FiSend,
    FiCheck
} from "react-icons/fi";

import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import ProductCard from "../../components/ProductCard";
import { allProducts, getProductBySlug } from "../../data/products";
import api, { getProductImageUrl } from "../../lib/api";
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

    const [dbProduct, setDbProduct] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Fetch product details from MongoDB
    useEffect(() => {
        let isMounted = true;
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/api/products/${slug}`);
                if (isMounted && res && res.product) {
                    setDbProduct(res.product);
                }
            } catch (err) {
                console.warn("Product fetch from API fallback:", err);
            }
        };
        fetchProduct();
        return () => {
            isMounted = false;
        };
    }, [slug]);

    // Use dbProduct if fetched, else passedProduct, else fallback
    const rawProduct = dbProduct || passedProduct || fallbackProduct;

    // Extract ALL images uploaded for this product
    const allImages = useMemo(() => {
        if (rawProduct.images && Array.isArray(rawProduct.images) && rawProduct.images.length > 0) {
            return rawProduct.images;
        }
        if (rawProduct.image) {
            return [rawProduct.image];
        }
        return ["/assets/product1.jpeg"];
    }, [rawProduct]);

    // Reset active image on product change
    useEffect(() => {
        setActiveImageIndex(0);
    }, [slug, dbProduct]);

    // Guarantee default properties so no map/destructure crashes
    const product = {
        ...rawProduct,
        id: rawProduct._id || rawProduct.id,
        points: rawProduct.points && Array.isArray(rawProduct.points) ? rawProduct.points.filter(p => p && p.trim()) : [],
        ingredients: rawProduct.ingredients && Array.isArray(rawProduct.ingredients) ? rawProduct.ingredients.filter(i => i && i.trim()) : [],
        faq: rawProduct.faq && Array.isArray(rawProduct.faq) ? rawProduct.faq.filter(f => f && (f.question?.trim() || f.answer?.trim())) : [],
        howToUse: rawProduct.howToUse || "",
        reviews: rawProduct.reviews || "850+",
        desc: rawProduct.desc || rawProduct.shortDescription || ""
    };

    const relatedProducts = allProducts.filter(p => p.slug !== slug).slice(0, 4);

    const [qty, setQty] = useState(1);
    const [tab, setTab] = useState("Description");
    const [wished, setWished] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [userReviews, setUserReviews] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewForm, setReviewForm] = useState({
        name: "",
        rating: 5,
        comment: ""
    });

    const reviewStorageKey = `vedaBootiReviews_${product.id || product.slug}`;

    useEffect(() => {
        const savedReviews = localStorage.getItem(reviewStorageKey);

        if (savedReviews) {
            try {
                setUserReviews(JSON.parse(savedReviews));
            } catch {
                setUserReviews([]);
            }
        } else {
            setUserReviews([
                {
                    id: "demo-1",
                    name: "Priya Sharma",
                    rating: 5,
                    comment: "Really good quality product. Packaging was neat and the product feels genuine.",
                    date: "18 Sep 2026"
                },
                {
                    id: "demo-2",
                    name: "Rahul Verma",
                    rating: 4,
                    comment: "Good experience overall. Product quality is nice and delivery was smooth.",
                    date: "12 Sep 2026"
                },
                {
                    id: "demo-3",
                    name: "Neha Singh",
                    rating: 5,
                    comment: "I liked the product and would definitely consider ordering again.",
                    date: "06 Sep 2026"
                }
            ]);
        }
    }, [reviewStorageKey]);

    const handleReviewInput = (e) => {
        const { name, value } = e.target;
        setReviewForm(prev => ({ ...prev, [name]: value }));
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();

        if (!reviewForm.name.trim() || !reviewForm.comment.trim()) {
            alert("Please enter your name and review.");
            return;
        }

        const newReview = {
            id: Date.now(),
            name: reviewForm.name.trim(),
            rating: Number(reviewForm.rating),
            comment: reviewForm.comment.trim(),
            date: new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            })
        };

        const updatedReviews = [newReview, ...userReviews];

        setUserReviews(updatedReviews);
        localStorage.setItem(reviewStorageKey, JSON.stringify(updatedReviews));
        setReviewForm({ name: "", rating: 5, comment: "" });
        setShowReviewForm(false);
        setTab("Reviews");
    };

    const averageUserRating = userReviews.length
        ? (userReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / userReviews.length).toFixed(1)
        : Number(product.rating || 0).toFixed(1);

    useEffect(() => {
        const prodId = product._id || product.id || product.slug;
        setWished(isInWishlist(prodId));
        return subscribeToStorage(() => {
            setWished(isInWishlist(prodId));
        });
    }, [product._id, product.id, product.slug]);

    const handleAddToCart = () => {
        addToCartHelper(product, qty);
        setAddedToCart(true);
        setTimeout(() => {
            setAddedToCart(false);
        }, 2000);
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
                        {product.category || "Herbal Care"}
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
                            {allImages.map((imgSrc, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    className={`thumb-btn ${idx === activeImageIndex ? "active" : ""}`}
                                    onClick={() => setActiveImageIndex(idx)}
                                    title={`View image ${idx + 1}`}
                                >
                                    <img
                                        src={getProductImageUrl(imgSrc)}
                                        alt={`${product.name} thumb ${idx + 1}`}
                                        className="thumb-img"
                                    />
                                </button>
                            ))}
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

                            {(allImages[activeImageIndex] || product.image) ? (
                                <img
                                    src={getProductImageUrl(allImages[activeImageIndex] || product.image)}
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

                            {(product.oldPrice || product.old) && Number(product.oldPrice || product.old) > Number(product.price) && (
                                <del>
                                    ₹{product.oldPrice || product.old}
                                </del>
                            )}

                            {product.discount ? (
                                <b>
                                    {String(product.discount).includes("OFF") ? product.discount : `${product.discount}% OFF`}
                                </b>
                            ) : discount > 0 ? (
                                <b>
                                    {discount}% OFF
                                </b>
                            ) : null}

                        </div>


                        {/<[a-z][\s\S]*>/i.test(product.shortDescription || product.desc) ? (
                            <div
                                className="detail-description rich-text-content"
                                dangerouslySetInnerHTML={{ __html: product.shortDescription || product.desc }}
                            />
                        ) : (
                            <p className="detail-description">
                                {product.shortDescription || product.desc}
                            </p>
                        )}


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
                                className={`btn cart-btn ${addedToCart ? "added" : ""}`}
                                onClick={handleAddToCart}
                                style={
                                    addedToCart
                                        ? {
                                            background: "#166534",
                                            borderColor: "#22c55e",
                                            color: "#86efac",
                                        }
                                        : {}
                                }
                            >

                                {addedToCart ? <FiCheck size={18} /> : <FiShoppingBag />}

                                {addedToCart ? "Added to Cart!" : "Add to Cart"}

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
                            "FAQs",
                            "Reviews"
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


                            {tab === "Reviews" ? (
                                <div className="product-reviews-panel">

                                    <div className="reviews-summary">
                                        <div className="reviews-score">
                                            <strong>{averageUserRating}</strong>
                                            <div className="review-stars large">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <FiStar
                                                        key={star}
                                                        className={star <= Math.round(Number(averageUserRating)) ? "filled" : ""}
                                                    />
                                                ))}
                                            </div>
                                            <small>{userReviews.length} customer reviews</small>
                                        </div>

                                        <button
                                            type="button"
                                            className="review-write-btn"
                                            onClick={() => setShowReviewForm(prev => !prev)}
                                        >
                                            <FiStar />
                                            {showReviewForm ? "Close Review Form" : "Write a Review"}
                                        </button>
                                    </div>

                                    {showReviewForm && (
                                        <form className="review-form" onSubmit={handleReviewSubmit}>
                                            <div className="review-form-head">
                                                <div>
                                                    <span>SHARE YOUR EXPERIENCE</span>
                                                    <h3>Write a Product Review</h3>
                                                </div>
                                                <FiSend />
                                            </div>

                                            <div className="review-form-grid">
                                                <label>
                                                    <span>Your Name</span>
                                                    <div className="review-input-wrap">
                                                        <FiUser />
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            value={reviewForm.name}
                                                            onChange={handleReviewInput}
                                                            placeholder="Enter your name"
                                                            required
                                                        />
                                                    </div>
                                                </label>

                                                <label>
                                                    <span>Your Rating</span>
                                                    <div className="rating-selector">
                                                        {[1, 2, 3, 4, 5].map(star => (
                                                            <button
                                                                type="button"
                                                                key={star}
                                                                className={Number(reviewForm.rating) >= star ? "selected" : ""}
                                                                onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                                                                aria-label={`${star} star rating`}
                                                            >
                                                                <FiStar />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </label>
                                            </div>

                                            <label className="review-comment-field">
                                                <span>Your Review</span>
                                                <textarea
                                                    name="comment"
                                                    value={reviewForm.comment}
                                                    onChange={handleReviewInput}
                                                    placeholder="Tell other customers about your experience..."
                                                    rows="4"
                                                    required
                                                />
                                            </label>

                                            <button type="submit" className="review-submit-btn">
                                                <FiSend />
                                                Submit Review
                                            </button>
                                        </form>
                                    )}

                                    <div className="reviews-list">
                                        {userReviews.length > 0 ? (
                                            userReviews.map(review => (
                                                <article className="review-item" key={review.id}>
                                                    <div className="review-avatar">
                                                        <FiUser />
                                                    </div>

                                                    <div className="review-body">
                                                        <div className="review-topline">
                                                            <div>
                                                                <strong>{review.name}</strong>
                                                                <div className="review-stars">
                                                                    {[1, 2, 3, 4, 5].map(star => (
                                                                        <FiStar
                                                                            key={star}
                                                                            className={star <= Number(review.rating) ? "filled" : ""}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <small>{review.date}</small>
                                                        </div>

                                                        <p>{review.comment}</p>
                                                    </div>
                                                </article>
                                            ))
                                        ) : (
                                            <div className="empty-reviews">
                                                <FiStar />
                                                <h3>No reviews yet</h3>
                                                <p>Be the first customer to share your experience.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {tab === "Description" && (
                                        product.desc ? (
                                            /<[a-z][\s\S]*>/i.test(product.desc) ? (
                                                <div
                                                    className="rich-description-body"
                                                    dangerouslySetInnerHTML={{ __html: product.desc }}
                                                    style={{ lineHeight: 1.7, color: "#9ca9a1" }}
                                                />
                                            ) : (
                                                <p style={{ lineHeight: 1.7, color: "#c1cfc8" }}>{product.desc}</p>
                                            )
                                        ) : (
                                            <p style={{ color: "#799285" }}>No description provided for this product.</p>
                                        )
                                    )}

                                    {tab === "Benefits" && (
                                        product.points && product.points.length > 0 ? (
                                            <ul className="product-tab-list" style={{ paddingLeft: "20px", lineHeight: 1.9, color: "#c1cfc8" }}>
                                                {product.points.map((point, i) => (
                                                    <li key={i}>{point}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p style={{ color: "#799285" }}>No specific benefits added for this product.</p>
                                        )
                                    )}

                                    {tab === "Ingredients" && (
                                        product.ingredients && product.ingredients.length > 0 ? (
                                            <ul className="product-tab-list" style={{ paddingLeft: "20px", lineHeight: 1.9, color: "#c1cfc8" }}>
                                                {product.ingredients.map((ing, i) => (
                                                    <li key={i}>{ing}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p style={{ color: "#799285" }}>No ingredients listed for this product.</p>
                                        )
                                    )}

                                    {tab === "How to Use" && (
                                        product.howToUse && product.howToUse.trim() ? (
                                            <p style={{ lineHeight: 1.8, color: "#c1cfc8" }}>{product.howToUse}</p>
                                        ) : (
                                            <p style={{ color: "#799285" }}>No usage instructions specified for this product.</p>
                                        )
                                    )}

                                    {tab === "FAQs" && (
                                        product.faq && product.faq.length > 0 ? (
                                            <div className="product-faq-list">
                                                {product.faq.map((item, idx) => (
                                                    <div
                                                        key={idx}
                                                        style={{
                                                            marginBottom: "14px",
                                                            padding: "14px 16px",
                                                            background: "rgba(255, 255, 255, 0.03)",
                                                            borderRadius: "8px",
                                                            border: "1px solid rgba(216, 181, 106, 0.15)",
                                                        }}
                                                    >
                                                        <h4 style={{ color: "#d8b56a", fontSize: "15px", marginBottom: "6px" }}>
                                                            Q: {item.question}
                                                        </h4>
                                                        <p style={{ color: "#c1cfc8", fontSize: "14px", margin: 0, lineHeight: 1.6 }}>
                                                            {item.answer}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p style={{ color: "#799285" }}>No FAQs added for this product yet.</p>
                                        )
                                    )}
                                </>
                            )}

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
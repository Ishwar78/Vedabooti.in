import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FiArrowRight,
    FiPlay,
    FiShield,
    FiFeather,
    FiHeart,
    FiHome,
    FiVolume2,
    FiVolumeX,
    FiChevronLeft,
    FiChevronRight,
    FiExternalLink,
    FiShoppingCart,
    FiZap,
    FiCheck
} from "react-icons/fi";

import ProductCard from "../../components/ProductCard";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import api, { getCategoryImageUrl, getVideoUrl, getBannerImageUrl, getProductImageUrl } from "../../lib/api";
import { addToCart, setDirectCheckoutItem } from "../../lib/cartWishlist";

import "./Home.css";

const heroSlides = [
    {
        id: 1,
        image: "/assets/banner.jpeg",
        alt: "Veda Booti - BLACK 3X Shaadi Wala - Banner Slide 1",
        link: "/shop"
    },
    {
        id: 2,
        image: "/assets/banner.jpeg",
        alt: "Veda Booti - BLACK 3X Shaadi Wala - Banner Slide 2",
        link: "/shop"
    },
    {
        id: 3,
        image: "/assets/banner.jpeg",
        alt: "Veda Booti - BLACK 3X Shaadi Wala - Banner Slide 3",
        link: "/shop"
    }
];

const defaultVideoReels = [
    {
        id: "reel-1",
        title: "Honey",
        tag: "100% NATURAL",
        videoSrc: "/assets/Video.mp4",
        link: "/shop"
    },
    {
        id: "reel-2",
        title: "Mushroom Biscuit",
        tag: "MUSHROOM BISCUIT",
        videoSrc: "/assets/Video.mp4",
        link: "/shop"
    },
    {
        id: "reel-3",
        title: "Mushroom Biscuit",
        tag: "MUSHROOM BISCUIT",
        videoSrc: "/assets/Video.mp4",
        link: "/shop"
    },
    {
        id: "reel-4",
        title: "Black 3X Power Kit",
        tag: "100% NATURAL",
        videoSrc: "/assets/Video.mp4",
        link: "/shop"
    },
    {
        id: "reel-5",
        title: "Dulha Kit Ritual",
        tag: "AYURVEDIC CARE",
        videoSrc: "/assets/Video.mp4",
        link: "/shop"
    }
];

export default function Home() {
    const navigate = useNavigate();
    const [featuredAdded, setFeaturedAdded] = useState(false);

    // Dynamic Categories from MongoDB
    const [categories, setCategories] = useState([]);

    // Dynamic Best Selling Products from MongoDB
    const [products, setProducts] = useState([]);

    // Dynamic Customer Video Reels from MongoDB
    const [videoReels, setVideoReels] = useState(defaultVideoReels);

    // Dynamic Hero Banners from MongoDB
    const [heroBanners, setHeroBanners] = useState([
        {
            _id: "default-banner-1",
            title: "Veda Booti - BLACK 3X Shaadi Wala",
            desktopImage: "/assets/banner.jpeg",
            mobileImage: "/assets/banner.jpeg",
            link: "/shop"
        }
    ]);

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
                console.error("Failed to load categories on Home:", err);
            }
        };

        const loadProducts = async () => {
            try {
                const res = await api.get("/api/products?status=Active");
                if (isMounted) {
                    if (res && Array.isArray(res.products)) {
                        setProducts(res.products.slice(0, 5));
                    } else if (Array.isArray(res)) {
                        setProducts(res.slice(0, 5));
                    } else {
                        setProducts([]);
                    }
                }
            } catch (err) {
                console.error("Failed to load products on Home:", err);
            }
        };

        const loadVideos = async () => {
            try {
                const res = await api.get("/api/videos?status=Active");
                if (isMounted && res && res.videos && res.videos.length > 0) {
                    setVideoReels(res.videos);
                }
            } catch (err) {
                console.error("Failed to load customer video reels:", err);
            }
        };

        const loadBanners = async () => {
            try {
                const res = await api.get("/api/banners");
                if (isMounted && res?.banners?.length > 0) {
                    setHeroBanners(res.banners);
                }
            } catch (err) {
                console.error("Failed to load hero banners on Home:", err);
            }
        };

        loadCategories();
        loadProducts();
        loadVideos();
        loadBanners();

        return () => {
            isMounted = false;
        };
    }, []);

    // Hero Banner Slider State
    const [heroSlide, setHeroSlide] = useState(0);
    const [isHeroHovered, setIsHeroHovered] = useState(false);
    const [heroTouchStartX, setHeroTouchStartX] = useState(null);

    // Auto-advance hero slides every 4.5 seconds
    useEffect(() => {
        if (isHeroHovered || heroBanners.length <= 1) return;
        const timer = setInterval(() => {
            setHeroSlide((prev) => (prev < heroBanners.length - 1 ? prev + 1 : 0));
        }, 4500);
        return () => clearInterval(timer);
    }, [heroSlide, isHeroHovered, heroBanners.length]);

    const prevHeroSlide = () => {
        setHeroSlide((prev) => (prev > 0 ? prev - 1 : heroBanners.length - 1));
    };

    const nextHeroSlide = () => {
        setHeroSlide((prev) => (prev < heroBanners.length - 1 ? prev + 1 : 0));
    };

    const handleHeroTouchStart = (e) => {
        setHeroTouchStartX(e.touches[0].clientX);
    };

    const handleHeroTouchEnd = (e) => {
        if (heroTouchStartX === null) return;
        const diff = heroTouchStartX - e.changedTouches[0].clientX;
        if (diff > 50) {
            nextHeroSlide();
        } else if (diff < -50) {
            prevHeroSlide();
        }
        setHeroTouchStartX(null);
    };

    // Video Reels Carousel State
    const [activeVideo, setActiveVideo] = useState(1);
    const [isMuted, setIsMuted] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const videoRefs = useRef({});
    const [touchStartX, setTouchStartX] = useState(null);

    const toggleMute = (e) => {
        e.stopPropagation();
        setIsMuted((prev) => !prev);
    };

    useEffect(() => {
        // ONLY the center active video plays; pause and reset all other videos
        videoReels.forEach((_, idx) => {
            const v = videoRefs.current[idx];
            if (v) {
                if (idx === activeVideo) {
                    v.muted = isMuted;
                    v.play().catch(() => {});
                } else {
                    v.pause();
                    v.currentTime = 0;
                }
            }
        });
    }, [activeVideo, isMuted]);

    // Auto-scroll the reels slider every 3.5 seconds
    useEffect(() => {
        if (isHovered) return;
        const timer = setInterval(() => {
            setActiveVideo((prev) => (prev < videoReels.length - 1 ? prev + 1 : 0));
        }, 3500);
        return () => clearInterval(timer);
    }, [activeVideo, isHovered]);

    const prevSlide = () => {
        setActiveVideo((prev) => (prev > 0 ? prev - 1 : videoReels.length - 1));
    };

    const nextSlide = () => {
        setActiveVideo((prev) => (prev < videoReels.length - 1 ? prev + 1 : 0));
    };

    const handleTouchStart = (e) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e) => {
        if (touchStartX === null) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (diff > 50) {
            nextSlide();
        } else if (diff < -50) {
            prevSlide();
        }
        setTouchStartX(null);
    };

    const featuredProduct = products[0] || null;

    const getFeaturedImage = (product) => {
        if (!product) return "/assets/product1.jpeg";
        const raw =
            product.image ||
            (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null) ||
            product.imageUrl ||
            product.thumbnail;
        return raw ? getProductImageUrl(raw) : "/assets/product1.jpeg";
    };

    const getFeaturedPrice = (product) => {
        if (!product) return 499;
        return product.price !== undefined && product.price !== null
            ? Number(product.price)
            : Number(product.sellingPrice || 499);
    };

    const getFeaturedOldPrice = (product) => {
        if (!product) return null;
        const old = product.oldPrice ?? product.old ?? product.mrp ?? null;
        const current = getFeaturedPrice(product);
        return old && Number(old) > Number(current) ? Number(old) : null;
    };

    const getFeaturedDiscount = (product) => {
        if (!product) return "";
        if (product.discount) {
            return String(product.discount).includes("OFF") ? product.discount : `${product.discount}% OFF`;
        }
        const old = getFeaturedOldPrice(product);
        const curr = getFeaturedPrice(product);
        if (old && old > curr) {
            const pct = Math.round(((old - curr) / old) * 100);
            return pct > 0 ? `${pct}% OFF` : "";
        }
        return "";
    };

    const getFeaturedDescription = (product) =>
        product?.shortDescription ||
        product?.subtitle ||
        product?.shortDesc ||
        product?.desc ||
        product?.description ||
        "A carefully crafted Ayurvedic wellness essential made with thoughtfully selected natural ingredients for your everyday self-care ritual.";

    const renderCleanDescription = (content) => {
        if (!content) return null;
        const isHtml = /<[a-z][\s\S]*>/i.test(content);
        if (isHtml) {
            return (
                <div
                    className="featured-product-description"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            );
        }
        return <p className="featured-product-description">{content}</p>;
    };

    const handleFeaturedAddToCart = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (e && e.stopPropagation) e.stopPropagation();
        if (!featuredProduct) return;

        addToCart(featuredProduct, 1);
        setFeaturedAdded(true);
        setTimeout(() => {
            setFeaturedAdded(false);
        }, 1800);
    };

    const handleFeaturedBuyNow = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (e && e.stopPropagation) e.stopPropagation();
        if (!featuredProduct) return;

        const item = { ...featuredProduct, qty: 1 };
        setDirectCheckoutItem(item);
        navigate("/checkout", { state: { directItem: item } });
    };

    return (
        <div className="home-page">

            <SiteHeader />

            <main>

                {/* ================= HERO BANNER SLIDER ================= */}
                <section
                    className="home-hero-slider"
                    onMouseEnter={() => setIsHeroHovered(true)}
                    onMouseLeave={() => setIsHeroHovered(false)}
                    onTouchStart={handleHeroTouchStart}
                    onTouchEnd={handleHeroTouchEnd}
                >
                    {/* Navigation Prev Button */}
                    {heroBanners.length > 1 && (
                        <button
                            type="button"
                            className="hero-slider-btn prev"
                            onClick={prevHeroSlide}
                            aria-label="Previous banner"
                        >
                            <FiChevronLeft />
                        </button>
                    )}

                    {/* Viewport & Slide Track */}
                    <div className="hero-slider-viewport">
                        <div
                            className="hero-slider-track"
                            style={{ transform: `translateX(-${heroSlide * 100}%)` }}
                        >
                            {heroBanners.map((slide, idx) => {
                                const desktopImg = getBannerImageUrl(slide.desktopImage || slide.image);
                                const mobileImg = slide.mobileImage
                                    ? getBannerImageUrl(slide.mobileImage)
                                    : desktopImg;

                                return (
                                    <div key={slide._id || slide.id || idx} className="hero-slide-item">
                                        <Link
                                            to={slide.link || "/shop"}
                                            className="hero-banner-link"
                                            title={slide.title || "Shop Veda Booti"}
                                            aria-label={`Banner slide ${idx + 1}`}
                                        >
                                            <picture className="hero-banner-picture">
                                                {mobileImg && mobileImg !== desktopImg && (
                                                    <source media="(max-width: 768px)" srcSet={mobileImg} />
                                                )}
                                                <img
                                                    src={desktopImg}
                                                    alt={slide.title || `Banner slide ${idx + 1}`}
                                                    className="hero-banner-img"
                                                    loading={idx === 0 ? "eager" : "lazy"}
                                                />
                                            </picture>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Navigation Next Button */}
                    {heroBanners.length > 1 && (
                        <button
                            type="button"
                            className="hero-slider-btn next"
                            onClick={nextHeroSlide}
                            aria-label="Next banner"
                        >
                            <FiChevronRight />
                        </button>
                    )}

                    {/* Dot Indicators */}
                    {heroBanners.length > 1 && (
                        <div className="hero-slider-dots">
                            {heroBanners.map((_, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    className={`hero-dot ${idx === heroSlide ? "active" : ""}`}
                                    onClick={() => setHeroSlide(idx)}
                                    aria-label={`Go to banner slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* ================= CATEGORIES ================= */}
              {/* ================= CATEGORIES ================= */}
<section className="home-categories">

    <div className="category-inner">

        {/* ================= HEADER ================= */}

        <div className="category-section-head">

            <div className="category-heading">

                <span className="eyebrow">
                    EXPLORE OUR WORLD
                </span>

                <h2>
                    Shop By <span>Wellness Goal</span>
                </h2>

                <p>
                    Find the right herbal solution for your everyday health needs.
                </p>

            </div>

            <Link
                to="/categories"
                className="category-view-btn"
            >
                <span>View All Categories</span>
                <FiArrowRight />
            </Link>

        </div>


        {/* ================= CATEGORY ROW ================= */}

        <div className="category-slider-wrap">

            {/* PREVIOUS (Only shown if more than 6 categories to scroll) */}
            {categories.length > 6 && (
                <button
                    type="button"
                    className="category-slider-arrow category-prev"
                    aria-label="Previous categories"
                    onClick={() => {
                        const el = document.querySelector(".goal-grid");
                        if (el) {
                            const card = el.querySelector(".goal-card");
                            const shift = card ? card.offsetWidth + 18 : 240;
                            el.scrollBy({
                                left: -shift,
                                behavior: "smooth"
                            });
                        }
                    }}
                >
                    <FiChevronLeft />
                </button>
            )}


            {/* CATEGORY LIST (Centered if <= 6, horizontally scrollable if > 6) */}
            <div className={`goal-grid ${categories.length <= 6 ? "is-centered" : "is-scrollable"}`}>

                {categories.map((cat, index) => (

                    <Link
                        to={`/shop?category=${encodeURIComponent(cat.name)}`}
                        className="goal-card"
                        key={cat._id || cat.name}
                    >

                        {/* IMAGE */}

                        <div className="goal-image-wrap">

                            <div className="goal-image-ring">

                                <img
                                    src={getCategoryImageUrl(cat.image)}
                                    alt={cat.name}
                                    className="goal-img-thumb"
                                    onError={(e) => {
                                        e.currentTarget.src = "/assets/category-placeholder.jpg";
                                    }}
                                />

                            </div>


                            {/* SMALL FLOATING ICON */}

                            <span className="goal-floating-icon">

                                {index % 6 === 0 && <FiFeather />}
                                {index % 6 === 1 && <span className="hair-icon">〰</span>}
                                {index % 6 === 2 && <FiHeart />}
                                {index % 6 === 3 && <FiShield />}
                                {index % 6 === 4 && <span className="tea-icon">☕</span>}
                                {index % 6 === 5 && <span>🎁</span>}

                            </span>

                        </div>


                        {/* TEXT */}

                        <div className="goal-content">

                            <h3>
                                {cat.name}
                            </h3>

                            <p>
                                {cat.subtitle || "Ayurvedic Care"}
                            </p>

                            <span className="goal-line"></span>

                        </div>

                    </Link>

                ))}

                {categories.length === 0 && (
                    <div style={{ padding: "30px 20px", color: "#879990", textAlign: "center", width: "100%" }}>
                        <p style={{ margin: 0 }}>Categories added from the Admin panel will appear here.</p>
                    </div>
                )}

            </div>


            {/* NEXT (Only shown if more than 6 categories to scroll) */}
            {categories.length > 6 && (
                <button
                    type="button"
                    className="category-slider-arrow category-next"
                    aria-label="Next categories"
                    onClick={() => {
                        const el = document.querySelector(".goal-grid");
                        if (el) {
                            const card = el.querySelector(".goal-card");
                            const shift = card ? card.offsetWidth + 18 : 240;
                            el.scrollBy({
                                left: shift,
                                behavior: "smooth"
                            });
                        }
                    }}
                >
                    <FiChevronRight />
                </button>
            )}

        </div>

    </div>

</section>


                {/* ================= PRODUCTS ================= */}
                <section className="home-products container">

                    <div className="section-head">

                        <div>

                            <span className="eyebrow">
                                Customer Favourites
                            </span>

                            <h2>
                                Our Best Selling Products
                            </h2>

                            <p>
                                Trusted by thousands for a healthier life.
                            </p>

                        </div>


                        <Link
                            className="btn dark"
                            to="/shop"
                        >
                            View All Products
                            <FiArrowRight />
                        </Link>

                    </div>


                    <div className="grid-5">
                        {products.map(product => (
                            <ProductCard
                                key={product._id || product.id}
                                product={product}
                            />
                        ))}
                    </div>

                    {products.length === 0 && (
                        <div style={{ padding: "40px 20px", textAlign: "center", color: "#8da497" }}>
                            <p>Authentic products added by the Admin will appear here.</p>
                        </div>
                    )}
                </section>

                {/* ================= FEATURED PRODUCT ================= */}
                {featuredProduct && (
                <section className="featured-product-section">
                    <div className="featured-product-inner container">

                        <div className="featured-product-media">
                            <Link
                                to={`/product/${featuredProduct.slug || featuredProduct._id || featuredProduct.id}`}
                                state={{ product: featuredProduct }}
                                className="featured-product-image-card"
                                style={{ textDecoration: "none" }}
                                title={featuredProduct?.name}
                            >
                                <span className="featured-product-badge">
                                    VEDA BOOTI · FEATURED
                                </span>

                                <img
                                    src={getFeaturedImage(featuredProduct)}
                                    alt={featuredProduct?.name || "Featured Veda Booti product"}
                                    className="featured-product-image"
                                    onError={(e) => {
                                        if (e.currentTarget.src.endsWith("/assets/product1.jpeg")) return;
                                        e.currentTarget.src = "/assets/product1.jpeg";
                                    }}
                                />
                            </Link>

                            <div className="featured-product-actions">
                                <button
                                    type="button"
                                    className={`featured-cart-btn ${featuredAdded ? "added" : ""}`}
                                    onClick={handleFeaturedAddToCart}
                                    disabled={!featuredProduct}
                                    style={
                                        featuredAdded
                                            ? { background: "#166534", borderColor: "#22c55e", color: "#86efac" }
                                            : {}
                                    }
                                >
                                    {featuredAdded ? <FiCheck /> : <FiShoppingCart />}
                                    <span>{featuredAdded ? "Added to Cart!" : "Add to Cart"}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleFeaturedBuyNow}
                                    disabled={!featuredProduct}
                                    className="featured-buy-btn"
                                    style={{ border: "none", cursor: "pointer" }}
                                >
                                    <FiZap />
                                    <span>Buy Now</span>
                                </button>
                            </div>
                        </div>

                        <div className="featured-product-content">
                            <span className="eyebrow">A Little Wellness, Every Day</span>

                            <h2>
                                <Link
                                    to={`/product/${featuredProduct.slug || featuredProduct._id || featuredProduct.id}`}
                                    state={{ product: featuredProduct }}
                                    style={{ color: "inherit", textDecoration: "none" }}
                                >
                                    {featuredProduct?.name || "Natural Ayurvedic Wellness Essential"}
                                </Link>
                            </h2>

                            {renderCleanDescription(getFeaturedDescription(featuredProduct))}

                            <div className="featured-product-price-row">
                                <strong>₹{Number(getFeaturedPrice(featuredProduct)).toLocaleString("en-IN")}</strong>
                                {getFeaturedOldPrice(featuredProduct) && (
                                    <del>
                                        ₹{Number(getFeaturedOldPrice(featuredProduct)).toLocaleString("en-IN")}
                                    </del>
                                )}
                                {getFeaturedDiscount(featuredProduct) && (
                                    <span className="featured-discount-badge">
                                        {getFeaturedDiscount(featuredProduct)}
                                    </span>
                                )}
                            </div>

                            {featuredProduct.points && Array.isArray(featuredProduct.points) && featuredProduct.points.filter((pt) => pt && pt.trim()).length > 0 ? (
                                <div className="featured-product-benefits-grid">
                                    {featuredProduct.points.filter((pt) => pt && pt.trim()).map((point, index) => (
                                        <span key={index}>
                                            <FiShield />
                                            {point}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <div className="featured-product-points">
                                    <span><FiFeather /> Natural Ingredients</span>
                                    <span><FiShield /> Quality Focused</span>
                                    <span><FiHeart /> Everyday Wellness</span>
                                </div>
                            )}

                            <div className="featured-product-note">
                                <span className="featured-note-line" />
                                <p>
                                    Rooted in traditional Ayurvedic wisdom and created for
                                    modern wellness routines.
                                </p>
                            </div>
                        </div>

                    </div>
                </section>
                )}

                {/* ================= PROMISE ================= */}
                <section className="promise">

                    <div className="container promise-inner">

                        <div>

                            <span className="eyebrow">
                                Why Choose Veda Booti
                            </span>

                            <h2>
                                Nature's Care,
                                <br />
                                <span>Our Promise</span>
                            </h2>

                            <p>
                                Authentic herbal products inspired by
                                traditional wisdom, made for modern wellness.
                            </p>

                            <Link
                                className="btn"
                                to="/about"
                            >
                                Learn More
                                <FiArrowRight />
                            </Link>

                        </div>


                        <div className="promise-items">

                            <div>
                                <FiFeather />
                                <b>100% Natural</b>
                                <small>
                                    Carefully sourced ingredients
                                </small>
                            </div>

                            <div>
                                <FiShield />
                                <b>Clinically Trusted</b>
                                <small>
                                    Quality-focused process
                                </small>
                            </div>

                            <div>
                                <span>♢</span>
                                <b>Sustainable Packaging</b>
                                <small>
                                    Mindful choices
                                </small>
                            </div>

                            <div>
                                <span>✦</span>
                                <b>Better Tomorrow</b>
                                <small>
                                    Wellness with purpose
                                </small>
                            </div>

                        </div>

                    </div>

                </section>


                {/* ================= VIDEO TESTIMONIALS ================= */}
                <section className="video-testimonials container">

                    <div className="section-head">

                        <div>

                            <span className="eyebrow">
                                Real Stories · Real Results
                            </span>

                            <h2>
                                What Our Customers Say
                            </h2>

                            <p>
                                Watch short stories from our wellness community.
                            </p>

                        </div>


                        <Link
                            className="btn dark"
                            to="/testimonials"
                        >
                            View All Stories
                            <FiArrowRight />
                        </Link>

                    </div>


                    {/* Reels Slider Section with Outer Nav Buttons */}
                    <div className="reels-slider-section">
                        {/* Navigation Button Prev */}
                        <button
                            type="button"
                            className="reel-nav-btn prev"
                            onClick={prevSlide}
                            aria-label="Previous story"
                        >
                            <FiChevronLeft />
                        </button>

                        {/* Reels Carousel Viewport */}
                        <div
                            className="reels-carousel-wrapper"
                            style={{ "--active-index": activeVideo }}
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            {/* Sliding Track */}
                            <div className="reels-track">
                                {videoReels.map((reel, index) => {
                                    const isActive = index === activeVideo;
                                    return (
                                        <div
                                            key={reel._id || reel.id || index}
                                            className={`reel-card ${isActive ? "active-phone" : "side-card"}`}
                                            onClick={() => setActiveVideo(index)}
                                        >
                                            {/* Dynamic Island / Phone notch */}
                                            <div className="phone-notch" />

                                            {/* Audio Mute/Unmute Toggle */}
                                            <button
                                                type="button"
                                                className="reel-volume-btn"
                                                onClick={toggleMute}
                                                aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                                                title={isMuted ? "Unmute audio" : "Mute audio"}
                                            >
                                                {isMuted ? <FiVolumeX /> : <FiVolume2 />}
                                            </button>

                                            {/* Category / Tag Pill */}
                                            <div className="reel-tag-badge">
                                                {reel.tag || "100% NATURAL"}
                                            </div>

                                            {/* Video Element */}
                                            <div className="reel-video-container">
                                                <video
                                                    ref={(el) => (videoRefs.current[index] = el)}
                                                    src={getVideoUrl(reel.videoSrc)}
                                                    loop
                                                    muted={isMuted}
                                                    playsInline
                                                    preload="auto"
                                                    className="reel-video"
                                                    onLoadedData={(e) => {
                                                        if (index === activeVideo) {
                                                            e.currentTarget.play().catch(() => {});
                                                        } else {
                                                            e.currentTarget.pause();
                                                            e.currentTarget.currentTime = 0;
                                                        }
                                                    }}
                                                />
                                            </div>

                                            {/* Bottom Overlay Info */}
                                            <div className="reel-bottom-overlay">
                                                <h3 className="reel-title">
                                                    {reel.title}
                                                </h3>
                                                <Link
                                                    to={reel.link || "/shop"}
                                                    className="reel-view-btn"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <span>VIEW PRODUCT</span>
                                                    <FiExternalLink />
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Navigation Button Next */}
                        <button
                            type="button"
                            className="reel-nav-btn next"
                            onClick={nextSlide}
                            aria-label="Next story"
                        >
                            <FiChevronRight />
                        </button>
                    </div>

                    {/* Dot Indicators */}
                    <div className="reel-dots">
                        {videoReels.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                className={`reel-dot ${idx === activeVideo ? "active" : ""}`}
                                onClick={() => setActiveVideo(idx)}
                                aria-label={`Go to story ${idx + 1}`}
                            />
                        ))}
                    </div>

                </section>


                {/* ================= BLOG ================= */}
                <section className="home-blog container">

                    <div className="section-head">

                        <div>

                            <span className="eyebrow">
                                From Our Journal
                            </span>

                            <h2>
                                Ayurveda Insights
                            </h2>

                            <p>
                                Simple, useful wellness reading for everyday life.
                            </p>

                        </div>


                        <Link
                            className="btn dark"
                            to="/blog"
                        >
                            View All Articles
                            <FiArrowRight />
                        </Link>

                    </div>


                    <div className="grid-3">

                        <Link
                            className="blog-card"
                            to="/blog"
                        >
                            <span>
                                HERBAL CARE
                            </span>

                            <h3>
                                5 Ayurvedic Herbs for Better Immunity
                            </h3>

                            <p>
                                Simple ways to bring traditional herbs
                                into your routine.
                            </p>

                            <b>
                                Read More →
                            </b>
                        </Link>


                        <Link
                            className="blog-card"
                            to="/blog"
                        >
                            <span>
                                SKINCARE
                            </span>

                            <h3>
                                Natural Skincare Tips Using Ayurveda
                            </h3>

                            <p>
                                Build a gentle, plant-first daily ritual.
                            </p>

                            <b>
                                Read More →
                            </b>
                        </Link>


                        <Link
                            className="blog-card"
                            to="/blog"
                        >
                            <span>
                                HERBAL TEA
                            </span>

                            <h3>
                                The Benefits of Herbal Teas
                            </h3>

                            <p>
                                Warm, simple wellness rituals for busy days.
                            </p>

                            <b>
                                Read More →
                            </b>

                        </Link>

                    </div>

                </section>

            </main>


            <SiteFooter />

        </div>
    );
}
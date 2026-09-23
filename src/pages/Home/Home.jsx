import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
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
    FiExternalLink
} from "react-icons/fi";

import ProductCard from "../../components/ProductCard";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import { homeProducts as products } from "../../data/products";

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

const cats = [
    {
        name: "Skin Care",
        subtitle: "Glow naturally",
        image: "/assets/skincare.png"
    },
    {
        name: "Hair Care",
        subtitle: "Stronger, healthier hair",
        image: "/assets/haircare.png"
    },
    {
        name: "Health & Wellness",
        subtitle: "Balance your body",
        image: "/assets/healt.png"
    },
    {
        name: "Immunity Boost",
        subtitle: "Stay strong naturally",
        image: "/assets/imunity.png"
    },
    {
        name: "Herbal Teas",
        subtitle: "Wellness in every sip",
        image: "/assets/herbal.png"
    },
    {
        name: "Combo Packs",
        subtitle: "More care, more value",
        image: "/assets/combo.png"
    }
];

const videoReels = [
    {
        id: "reel-1",
        title: "Honey",
        tag: "100 NATURAL",
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
    // Hero Banner Slider State
    const [heroSlide, setHeroSlide] = useState(0);
    const [isHeroHovered, setIsHeroHovered] = useState(false);
    const [heroTouchStartX, setHeroTouchStartX] = useState(null);

    // Auto-advance hero slides every 4 seconds
    useEffect(() => {
        if (isHeroHovered) return;
        const timer = setInterval(() => {
            setHeroSlide((prev) => (prev < heroSlides.length - 1 ? prev + 1 : 0));
        }, 4000);
        return () => clearInterval(timer);
    }, [heroSlide, isHeroHovered]);

    const prevHeroSlide = () => {
        setHeroSlide((prev) => (prev > 0 ? prev - 1 : heroSlides.length - 1));
    };

    const nextHeroSlide = () => {
        setHeroSlide((prev) => (prev < heroSlides.length - 1 ? prev + 1 : 0));
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
                    <button
                        type="button"
                        className="hero-slider-btn prev"
                        onClick={prevHeroSlide}
                        aria-label="Previous banner"
                    >
                        <FiChevronLeft />
                    </button>

                    {/* Viewport & Slide Track */}
                    <div className="hero-slider-viewport">
                        <div
                            className="hero-slider-track"
                            style={{ transform: `translateX(-${heroSlide * 100}%)` }}
                        >
                            {heroSlides.map((slide, idx) => (
                                <div key={slide.id} className="hero-slide-item">
                                    <Link
                                        to={slide.link}
                                        className="hero-banner-link"
                                        title="Shop Veda Booti BLACK 3X Shaadi Wala Combo"
                                        aria-label={`Banner slide ${idx + 1}`}
                                    >
                                        <img
                                            src={slide.image}
                                            alt={slide.alt}
                                            className="hero-banner-img"
                                        />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Next Button */}
                    <button
                        type="button"
                        className="hero-slider-btn next"
                        onClick={nextHeroSlide}
                        aria-label="Next banner"
                    >
                        <FiChevronRight />
                    </button>

                    {/* Dot Indicators */}
                    <div className="hero-slider-dots">
                        {heroSlides.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                className={`hero-dot ${idx === heroSlide ? "active" : ""}`}
                                onClick={() => setHeroSlide(idx)}
                                aria-label={`Go to banner slide ${idx + 1}`}
                            />
                        ))}
                    </div>
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

            {/* PREVIOUS */}

            <button
                type="button"
                className="category-slider-arrow category-prev"
                aria-label="Previous categories"
                onClick={() => {
                    document
                        .querySelector(".goal-grid")
                        ?.scrollBy({
                            left: -260,
                            behavior: "smooth"
                        });
                }}
            >
                <FiChevronLeft />
            </button>


            {/* CATEGORY LIST */}

            <div className="goal-grid">

                {cats.map((cat, index) => (

                    <Link
                        to="/categories"
                        className="goal-card"
                        key={cat.name}
                    >

                        {/* IMAGE */}

                        <div className="goal-image-wrap">

                            <div className="goal-image-ring">

                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="goal-img-thumb"
                                />

                            </div>


                            {/* SMALL FLOATING ICON */}

                            <span className="goal-floating-icon">

                                {index === 0 && <FiFeather />}
                                {index === 1 && <span className="hair-icon">〰</span>}
                                {index === 2 && <FiHeart />}
                                {index === 3 && <FiShield />}
                                {index === 4 && <span className="tea-icon">☕</span>}
                                {index === 5 && <span>🎁</span>}

                            </span>

                        </div>


                        {/* TEXT */}

                        <div className="goal-content">

                            <h3>
                                {cat.name}
                            </h3>

                            <p>
                                {cat.subtitle}
                            </p>

                            <span className="goal-line"></span>

                        </div>

                    </Link>

                ))}

            </div>


            {/* NEXT */}

            <button
                type="button"
                className="category-slider-arrow category-next"
                aria-label="Next categories"
                onClick={() => {
                    document
                        .querySelector(".goal-grid")
                        ?.scrollBy({
                            left: 260,
                            behavior: "smooth"
                        });
                }}
            >
                <FiChevronRight />
            </button>

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
                                key={product.id}
                                product={product}
                            />

                        ))}

                    </div>

                </section>


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
                                            key={reel.id}
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
                                                {reel.tag}
                                            </div>

                                            {/* Video Element */}
                                            <div className="reel-video-container">
                                                <video
                                                    ref={(el) => (videoRefs.current[index] = el)}
                                                    src={reel.videoSrc}
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
                                                    to={reel.link}
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
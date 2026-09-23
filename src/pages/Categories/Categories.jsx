import React from "react";
import { Link } from "react-router-dom";
import {
    FiActivity,
    FiDroplet,
    FiFeather,
    FiHeart,
    FiCoffee,
    FiMoon,
    FiUser,
    FiSun,
    FiGift,
    FiArrowUpRight
} from "react-icons/fi";

import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";

import "./Categories.css";


const categories = [
    {
        title: "Immunity Boosters",
        subtitle: "Strengthen your everyday wellness",
        description:
            "Natural herbal solutions designed for your daily immunity routine.",
        icon: FiActivity,
        number: "01"
    },
    {
        title: "Skin Care",
        subtitle: "Glow naturally",
        description:
            "Plant-inspired care for a healthy, fresh and naturally radiant look.",
        icon: FiDroplet,
        number: "02"
    },
    {
        title: "Hair Care",
        subtitle: "Stronger, healthier hair",
        description:
            "Thoughtfully selected herbal care for your everyday hair routine.",
        icon: FiFeather,
        number: "03"
    },
    {
        title: "Digestive Health",
        subtitle: "Feel balanced",
        description:
            "Traditional herbal wellness products for a comfortable daily routine.",
        icon: FiHeart,
        number: "04"
    },
    {
        title: "Herbal Teas",
        subtitle: "Wellness in every sip",
        description:
            "Relaxing herbal blends made for simple and mindful moments.",
        icon: FiCoffee,
        number: "05"
    },
    {
        title: "Stress & Sleep",
        subtitle: "Calm your mind",
        description:
            "Natural wellness choices designed around calm and restful routines.",
        icon: FiMoon,
        number: "06"
    },
    {
        title: "Women's Wellness",
        subtitle: "Care made for her",
        description:
            "Thoughtfully selected herbal products for women's everyday wellness.",
        icon: FiUser,
        number: "07"
    },
    {
        title: "Daily Nutrition",
        subtitle: "Nourish your body",
        description:
            "Natural nutrition essentials to complement your everyday lifestyle.",
        icon: FiSun,
        number: "08"
    },
    {
        title: "Combo Packs",
        subtitle: "More care, more value",
        description:
            "Curated wellness combinations designed for complete everyday care.",
        icon: FiGift,
        number: "09"
    }
];


export default function Categories() {

    return (

        <div className="categories-page">

            <SiteHeader />

            <main>

                {/* ================= HERO ================= */}

                <section className="categories-hero">

                    <div className="categories-container">

                        <div className="categories-hero-content">

                            <span className="eyebrow">
                                EXPLORE OUR WORLD
                            </span>

                            <h1>
                                Wellness,
                                <br />
                                <span>Made Natural.</span>
                            </h1>

                            <p>
                                Explore our Ayurvedic collection by your
                                everyday wellness goal and discover
                                thoughtful natural care.
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

                            <span className="eyebrow">
                                FIND YOUR WELLNESS
                            </span>

                            <h2>
                                Shop By Category
                            </h2>

                            <p>
                                Choose a wellness goal and explore products
                                curated for your everyday routine.
                            </p>

                        </div>

                        <div className="category-count">
                            <strong>09</strong>
                            <span>
                                Wellness
                                <br />
                                Categories
                            </span>
                        </div>

                    </div>


                    <div className="category-page-grid">

                        {categories.map((category) => {

                            const Icon = category.icon;

                            return (

                                <Link
                                    to="/shop"
                                    className="category-large"
                                    key={category.title}
                                >

                                    <div className="category-top">

                                        <span className="category-number">
                                            {category.number}
                                        </span>

                                        <div className="category-icon">
                                            <Icon />
                                        </div>

                                    </div>


                                    <div className="category-content">

                                        <span className="category-subtitle">
                                            {category.subtitle}
                                        </span>

                                        <h3>
                                            {category.title}
                                        </h3>

                                        <p>
                                            {category.description}
                                        </p>

                                    </div>


                                    <div className="category-bottom">

                                        <span>
                                            Explore Collection
                                        </span>

                                        <div className="category-arrow">
                                            <FiArrowUpRight />
                                        </div>

                                    </div>

                                </Link>

                            );

                        })}

                    </div>

                </section>


                {/* ================= BOTTOM CTA ================= */}

                <section className="categories-cta">

                    <div className="categories-container">

                        <div className="categories-cta-inner">

                            <div>

                                <span className="eyebrow">
                                    YOUR WELLNESS JOURNEY
                                </span>

                                <h2>
                                    Find what your
                                    <br />
                                    <span>body needs.</span>
                                </h2>

                                <p>
                                    From herbal care to daily nutrition,
                                    discover natural choices designed
                                    for everyday wellness.
                                </p>

                            </div>


                            <Link
                                to="/shop"
                                className="category-cta-button"
                            >
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
import React from "react";
import { Link } from "react-router-dom";
import {
    FiMail,
    FiPhone,
    FiMapPin,
    FiClock,
    FiArrowRight,
    FiMessageCircle,
    FiPackage,
    FiInstagram,
    FiFacebook,
    FiYoutube
} from "react-icons/fi";

import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";

import "./Support.css";


export default function Support() {

    return (
        <div className="support-page">

            <SiteHeader />

            <main>

                {/* ================= PAGE HERO ================= */}

                <section className="support-hero">

                    <div className="support-container">

                        <span className="eyebrow">
                            WE'RE HERE TO HELP
                        </span>

                        <h1>
                            Let's Talk.
                            <br />
                            <span>We're Here For You.</span>
                        </h1>

                        <p>
                            Have a question about your order, products,
                            delivery or anything else? Our team is ready
                            to help you.
                        </p>

                    </div>

                </section>


                {/* ================= CONTACT AREA ================= */}

                <section className="support-container support-main">

                    <div className="support-grid">


                        {/* ================= LEFT INFO ================= */}

                        <aside className="contact-info">

                            <div className="contact-heading">

                                <span className="eyebrow">
                                    CONTACT US
                                </span>

                                <h2>
                                    We'd love to
                                    <br />
                                    <span>hear from you.</span>
                                </h2>

                                <p>
                                    Reach out to us for product information,
                                    order assistance, shipping queries or
                                    general support.
                                </p>

                            </div>


                            <div className="contact-details">

                                <a
                                    href="mailto:support@vedabooti.com"
                                    className="contact-item"
                                >

                                    <div className="contact-icon">
                                        <FiMail />
                                    </div>

                                    <div>
                                        <small>
                                            EMAIL US
                                        </small>

                                        <strong>
                                            support@vedabooti.com
                                        </strong>

                                        <span>
                                            We usually reply within 24 hours
                                        </span>
                                    </div>

                                </a>


                                <a
                                    href="tel:+919999999999"
                                    className="contact-item"
                                >

                                    <div className="contact-icon">
                                        <FiPhone />
                                    </div>

                                    <div>
                                        <small>
                                            CALL US
                                        </small>

                                        <strong>
                                            +91 99999 99999
                                        </strong>

                                        <span>
                                            Mon – Sat · 10:00 AM – 6:00 PM
                                        </span>
                                    </div>

                                </a>


                                <div className="contact-item">

                                    <div className="contact-icon">
                                        <FiMapPin />
                                    </div>

                                    <div>
                                        <small>
                                            VISIT US
                                        </small>

                                        <strong>
                                            Veda Booti Health Care
                                        </strong>

                                        <span>
                                            India
                                        </span>
                                    </div>

                                </div>


                                <div className="contact-item">

                                    <div className="contact-icon">
                                        <FiClock />
                                    </div>

                                    <div>
                                        <small>
                                            SUPPORT HOURS
                                        </small>

                                        <strong>
                                            Monday – Saturday
                                        </strong>

                                        <span>
                                            10:00 AM – 6:00 PM
                                        </span>
                                    </div>

                                </div>

                            </div>


                            {/* SOCIAL */}

                            <div className="support-social">

                                <span>
                                    FOLLOW VEDA BOOTI
                                </span>

                                <div>

                                    <a href="#" aria-label="Instagram">
                                        <FiInstagram />
                                    </a>

                                    <a href="#" aria-label="Facebook">
                                        <FiFacebook />
                                    </a>

                                    <a href="#" aria-label="YouTube">
                                        <FiYoutube />
                                    </a>

                                </div>

                            </div>

                        </aside>


                        {/* ================= FORM ================= */}

                        <div className="contact-form-card">

                            <div className="form-top">

                                <div>

                                    <span className="eyebrow">
                                        SEND A MESSAGE
                                    </span>

                                    <h2>
                                        How can we help?
                                    </h2>

                                    <p>
                                        Fill in the details below and our
                                        support team will get back to you.
                                    </p>

                                </div>

                                <div className="form-message-icon">
                                    <FiMessageCircle />
                                </div>

                            </div>


                            <form
                                className="support-form"
                                onSubmit={(e) => e.preventDefault()}
                            >

                                {/* NAME + PHONE */}

                                <div className="form-row">

                                    <div className="form-group">

                                        <label>
                                            Full Name
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Enter your full name"
                                            required
                                        />

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Phone Number
                                        </label>

                                        <input
                                            type="tel"
                                            placeholder="Enter phone number"
                                            required
                                        />

                                    </div>

                                </div>


                                {/* EMAIL + ORDER */}

                                <div className="form-row">

                                    <div className="form-group">

                                        <label>
                                            Email Address
                                        </label>

                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            required
                                        />

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Order ID
                                            <small>
                                                Optional
                                            </small>
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="e.g. VB10245"
                                        />

                                    </div>

                                </div>


                                {/* SUBJECT */}

                                <div className="form-group">

                                    <label>
                                        What can we help you with?
                                    </label>

                                    <select defaultValue="">
                                        <option value="" disabled>
                                            Select a topic
                                        </option>

                                        <option>
                                            Order & Delivery
                                        </option>

                                        <option>
                                            Product Information
                                        </option>

                                        <option>
                                            Return & Refund
                                        </option>

                                        <option>
                                            Payment Issue
                                        </option>

                                        <option>
                                            Damaged / Missing Product
                                        </option>

                                        <option>
                                            Other
                                        </option>
                                    </select>

                                </div>


                                {/* MESSAGE */}

                                <div className="form-group">

                                    <label>
                                        Your Message
                                    </label>

                                    <textarea
                                        rows="5"
                                        placeholder="Tell us how we can help you..."
                                        required
                                    ></textarea>

                                </div>


                                {/* CHECKBOX */}

                                <label className="form-check">

                                    <input
                                        type="checkbox"
                                    />

                                    <span>
                                        I agree to be contacted regarding
                                        my support request.
                                    </span>

                                </label>


                                <button
                                    type="submit"
                                    className="btn submit-btn"
                                >
                                    Send Message
                                    <FiArrowRight />
                                </button>

                            </form>

                        </div>

                    </div>


                    {/* ================= QUICK SUPPORT ================= */}

                    <div className="quick-support">

                        <div className="quick-card">

                            <div className="quick-icon">
                                <FiPackage />
                            </div>

                            <div>

                                <h3>
                                    Track Your Order
                                </h3>

                                <p>
                                    Check your latest order and delivery
                                    status.
                                </p>

                            </div>

                            <Link to="/orders">
                                Track Order
                                <FiArrowRight />
                            </Link>

                        </div>


                        <div className="quick-card">

                            <div className="quick-icon">
                                <FiMessageCircle />
                            </div>

                            <div>

                                <h3>
                                    Need Product Help?
                                </h3>

                                <p>
                                    Find product information and answers
                                    to common questions.
                                </p>

                            </div>

                            <Link to="/shop">
                                Explore Products
                                <FiArrowRight />
                            </Link>

                        </div>

                    </div>

                </section>

            </main>

            <SiteFooter />

        </div>
    );
}
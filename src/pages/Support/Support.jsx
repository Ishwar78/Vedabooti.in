import React, { useState, useEffect } from "react";
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
    FiYoutube,
    FiCheckCircle,
} from "react-icons/fi";

import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import api from "../../lib/api";

import "./Support.css";

export default function Support() {
    const [contactDetails, setContactDetails] = useState({
        titleLine1: "We'd love to",
        titleLine2: "hear from you.",
        description:
            "Reach out to us for product information, order assistance, shipping queries or general support.",
        email: "support@vedabooti.com",
        phone: "+91 99999 99999",
        businessName: "Veda Booti Health Care",
        address: "India",
        supportDays: "Monday – Saturday",
        supportTime: "10:00 AM – 6:00 PM",
        emailResponse: "We usually reply within 24 hours",
        instagram: "https://instagram.com/vedabooti",
        facebook: "https://facebook.com/vedabooti",
        youtube: "https://youtube.com/@vedabooti"
    });

    const [formState, setFormState] = useState({
        name: "",
        phone: "",
        email: "",
        orderId: "",
        subject: "",
        message: ""
    });

    const [submitting, setSubmitting] = useState(false);
    const [sentSuccess, setSentSuccess] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchDetails = async () => {
            try {
                const res = await api.get("/api/contact/details");
                if (isMounted && res?.details) {
                    setContactDetails(res.details);
                }
            } catch (err) {
                console.error("Failed to fetch contact details:", err);
            }
        };
        fetchDetails();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post("/api/contact/messages", formState);
            setSentSuccess(true);
            setFormState({
                name: "",
                phone: "",
                email: "",
                orderId: "",
                subject: "",
                message: ""
            });
            setTimeout(() => setSentSuccess(false), 6000);
        } catch (err) {
            alert(err.message || "Failed to send message. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

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
                                    {contactDetails.titleLine1 || "We'd love to"}
                                    <br />
                                    <span>{contactDetails.titleLine2 || "hear from you."}</span>
                                </h2>

                                <p>
                                    {contactDetails.description ||
                                        "Reach out to us for product information, order assistance, shipping queries or general support."}
                                </p>

                            </div>


                            <div className="contact-details">

                                <a
                                    href={`mailto:${contactDetails.email || "support@vedabooti.com"}`}
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
                                            {contactDetails.email || "support@vedabooti.com"}
                                        </strong>

                                        <span>
                                            {contactDetails.emailResponse || "We usually reply within 24 hours"}
                                        </span>
                                    </div>

                                </a>


                                <a
                                    href={`tel:${contactDetails.phone ? contactDetails.phone.replace(/\s+/g, '') : "+919999999999"}`}
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
                                            {contactDetails.phone || "+91 99999 99999"}
                                        </strong>

                                        <span>
                                            {contactDetails.supportDays || "Mon – Sat"} · {contactDetails.supportTime || "10:00 AM – 6:00 PM"}
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
                                            {contactDetails.businessName || "Veda Booti Health Care"}
                                        </strong>

                                        <span>
                                            {contactDetails.address || "India"}
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
                                            {contactDetails.supportDays || "Monday – Saturday"}
                                        </strong>

                                        <span>
                                            {contactDetails.supportTime || "10:00 AM – 6:00 PM"}
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

                                    <a
                                        href={contactDetails.instagram || "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Instagram"
                                    >
                                        <FiInstagram />
                                    </a>

                                    <a
                                        href={contactDetails.facebook || "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Facebook"
                                    >
                                        <FiFacebook />
                                    </a>

                                    <a
                                        href={contactDetails.youtube || "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="YouTube"
                                    >
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


                            {sentSuccess && (
                                <div style={{
                                    backgroundColor: "#ecfdf5",
                                    color: "#065f46",
                                    padding: "14px 18px",
                                    borderRadius: "8px",
                                    marginBottom: "18px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    fontWeight: "500",
                                    border: "1px solid #a7f3d0"
                                }}>
                                    <FiCheckCircle size={20} color="#059669" />
                                    <span>Thank you! Your message has been sent successfully. We will get back to you soon.</span>
                                </div>
                            )}

                            <form
                                className="support-form"
                                onSubmit={handleContactSubmit}
                            >

                                {/* NAME + PHONE */}

                                <div className="form-row">

                                    <div className="form-group">

                                        <label>
                                            Full Name
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            value={formState.name}
                                            onChange={handleFormChange}
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
                                            name="phone"
                                            value={formState.phone}
                                            onChange={handleFormChange}
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
                                            name="email"
                                            value={formState.email}
                                            onChange={handleFormChange}
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
                                            name="orderId"
                                            value={formState.orderId}
                                            onChange={handleFormChange}
                                            placeholder="e.g. VB10245"
                                        />

                                    </div>

                                </div>


                                {/* SUBJECT */}

                                <div className="form-group">

                                    <label>
                                        What can we help you with?
                                    </label>

                                    <select
                                        name="subject"
                                        value={formState.subject}
                                        onChange={handleFormChange}
                                        required
                                    >
                                        <option value="" disabled>
                                            Select a topic
                                        </option>

                                        <option value="Order & Delivery">
                                            Order & Delivery
                                        </option>

                                        <option value="Product Information">
                                            Product Information
                                        </option>

                                        <option value="Return & Refund">
                                            Return & Refund
                                        </option>

                                        <option value="Payment Issue">
                                            Payment Issue
                                        </option>

                                        <option value="Damaged / Missing Product">
                                            Damaged / Missing Product
                                        </option>

                                        <option value="Other">
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
                                        name="message"
                                        value={formState.message}
                                        onChange={handleFormChange}
                                        placeholder="Tell us how we can help you..."
                                        required
                                    ></textarea>

                                </div>


                                {/* CHECKBOX */}

                                <label className="form-check">

                                    <input
                                        type="checkbox"
                                        required
                                    />

                                    <span>
                                        I agree to be contacted regarding
                                        my support request.
                                    </span>

                                </label>


                                <button
                                    type="submit"
                                    className="btn submit-btn"
                                    disabled={submitting}
                                >
                                    {submitting ? "Sending..." : "Send Message"}
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
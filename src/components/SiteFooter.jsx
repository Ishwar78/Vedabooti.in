import React from "react";
import { Link } from "react-router-dom";
import {
  FiInstagram,
  FiFacebook,
  FiYoutube,
  FiMail
} from "react-icons/fi";
import "./SiteFooter.css";

export default function SiteFooter() {
  return (
    <footer className="site-footer">

      {/* ================= PREMIUM TOP LINE ================= */}
      <div className="footer-top-glow"></div>

      {/* ================= MAIN FOOTER ================= */}
      <div className="footer-main container">

        {/* BRAND */}
        <div className="footer-brand">

          <div className="footer-logo-wrap">
            <img
              src="/assets/veda-booti-logo.png"
              alt="Veda Booti"
            />
          </div>

          <p className="footer-brand-text">
            Natural care for a better tomorrow.
          </p>

          <p className="footer-brand-description">
            Discover thoughtfully crafted herbal wellness
            products inspired by the goodness of nature.
          </p>

          <div className="footer-brand-line"></div>

        </div>

        {/* QUICK LINKS */}
        <div className="footer-column">

          <h4>Quick Links</h4>

          <Link to="/">
            Home
          </Link>

          <Link to="/shop">
            Shop
          </Link>

          <Link to="/categories">
            Categories
          </Link>

          <Link to="/about">
            About Us
          </Link>

          <Link to="/blog">
            Blog
          </Link>

        </div>

        {/* CUSTOMER CARE */}
        <div className="footer-column">

          <h4>Customer Care</h4>

          <Link to="/support">
            Returns & Refunds
          </Link>

          <Link to="/support">
            FAQs
          </Link>

          <Link to="/shipping-policy">
            Shipping Policy
          </Link>
           
            <Link to="Privacy-Policy">
            Privacy Policy
          </Link>


           <Link to="/terms-&-condition">
            Terms & Conditions
          </Link>


        </div>

        {/* SOCIAL / NEWSLETTER */}
        <div className="newsletter">

          <h4>
            Stay Connected
          </h4>

          <p>
            Get exclusive offers, wellness tips and
            updates from Veda Booti.
          </p>

          <div className="newsletter-highlight">
            <FiMail />

            <span>
              Follow our wellness journey
            </span>
          </div>

          {/* SOCIAL ICONS */}
          <div className="socials">

            <a
              href="#"
              aria-label="Facebook"
              className="social-icon"
            >
              <FiFacebook />
            </a>

            <a
              href="#"
              aria-label="Instagram"
              className="social-icon"
            >
              <FiInstagram />
            </a>

            <a
              href="#"
              aria-label="YouTube"
              className="social-icon"
            >
              <FiYoutube />
            </a>

            <a
              href="mailto:support@vedabooti.com"
              aria-label="Email"
              className="social-icon"
            >
              <FiMail />
            </a>

          </div>

        </div>

        {/* QUOTE */}
        <div className="footer-quote">

          <span className="quote-small">
            ROOTED IN
          </span>

          <strong>
            Goodness
          </strong>

          <strong>
            from Nature
          </strong>

          <em>
            Always.
          </em>

          <span className="quote-leaf">
            ✦
          </span>

        </div>

      </div>

      {/* ================= FOOTER BOTTOM ================= */}
      <div className="footer-bottom">

        <div className="footer-bottom-inner">

          <span>
            © 2026 Veda Booti Health Care.
            All rights reserved.
          </span>

          <span>
            Made with <b>♥</b> for a healthier tomorrow.
          </span>

        </div>

      </div>

    </footer>
  );
}
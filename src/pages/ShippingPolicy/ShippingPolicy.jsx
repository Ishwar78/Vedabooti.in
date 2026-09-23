import React from "react";
import {
  FiTruck,
  FiClock,
  FiMapPin,
  FiPackage,
  FiShield,
  FiAlertCircle,
  FiCheckCircle,
  FiPhone
} from "react-icons/fi";

import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import "./ShippingPolicy.css";

export default function ShippingPolicy() {
  return (
    <div className="shipping-page">

      <SiteHeader />

      {/* ================= HERO ================= */}

      <section className="shipping-hero">
        <div className="shipping-hero-inner">

          <span className="shipping-eyebrow">
            VEDA BOOTI HEALTH CARE
          </span>

          <h1>
            Shipping <span>Policy</span>
          </h1>

          <p>
            Simple, transparent and reliable delivery for your
            wellness essentials.
          </p>

          <div className="shipping-hero-line"></div>

        </div>
      </section>

      {/* ================= MAIN ================= */}

      <main className="shipping-main container">

        {/* ================= QUICK INFO ================= */}

        <section className="shipping-quick-grid">

          <div className="shipping-quick-card">
            <div className="shipping-icon">
              <FiTruck />
            </div>

            <div>
              <span>SHIPPING</span>
              <strong>Free Above ₹499</strong>
              <small>
                Enjoy free shipping on qualifying orders.
              </small>
            </div>
          </div>

          <div className="shipping-quick-card">
            <div className="shipping-icon">
              <FiClock />
            </div>

            <div>
              <span>PROCESSING</span>
              <strong>1–2 Business Days</strong>
              <small>
                Orders are prepared after confirmation.
              </small>
            </div>
          </div>

          <div className="shipping-quick-card">
            <div className="shipping-icon">
              <FiMapPin />
            </div>

            <div>
              <span>DELIVERY</span>
              <strong>3–7 Business Days</strong>
              <small>
                Delivery time may vary by location.
              </small>
            </div>
          </div>

        </section>

        {/* ================= CONTENT ================= */}

        <div className="shipping-layout">

          <article className="shipping-content">

            {/* INTRO */}

            <section className="shipping-section intro-section">

              <span className="content-kicker">
                DELIVERY INFORMATION
              </span>

              <h2>
                We deliver goodness to your doorstep.
              </h2>

              <p>
                At Veda Booti Health Care, we carefully pack every
                order so your products reach you safely and in good
                condition. Once your order is confirmed, our team
                processes and dispatches it through our shipping
                partners.
              </p>

              <p>
                Delivery timelines depend on your location,
                availability of the product and the shipping
                service selected for your order.
              </p>

            </section>

            {/* SHIPPING CHARGES */}

            <section className="shipping-section">

              <div className="section-title-row">
                <div className="section-number">
                  01
                </div>

                <div>
                  <span className="content-kicker">
                    SHIPPING CHARGES
                  </span>

                  <h2>
                    Shipping Charges
                  </h2>
                </div>
              </div>

              <div className="policy-highlight">

                <FiTruck />

                <div>
                  <strong>
                    Free Shipping on Orders Above ₹499
                  </strong>

                  <p>
                    Orders below the free-shipping threshold may
                    be charged a standard delivery fee, which will
                    be displayed during checkout.
                  </p>
                </div>

              </div>

            </section>

            {/* PROCESSING */}

            <section className="shipping-section">

              <div className="section-title-row">
                <div className="section-number">
                  02
                </div>

                <div>
                  <span className="content-kicker">
                    ORDER PROCESSING
                  </span>

                  <h2>
                    Processing & Dispatch
                  </h2>
                </div>
              </div>

              <p>
                Once an order is successfully placed, it generally
                takes 1–2 business days to process and prepare the
                order for dispatch.
              </p>

              <ul className="policy-list">

                <li>
                  <FiCheckCircle />
                  <span>
                    Orders are processed after successful order
                    confirmation.
                  </span>
                </li>

                <li>
                  <FiCheckCircle />
                  <span>
                    Orders placed on weekends or public holidays
                    may be processed on the next business day.
                  </span>
                </li>

                <li>
                  <FiCheckCircle />
                  <span>
                    You will receive shipping information once the
                    order has been dispatched.
                  </span>
                </li>

              </ul>

            </section>

            {/* DELIVERY TIME */}

            <section className="shipping-section">

              <div className="section-title-row">
                <div className="section-number">
                  03
                </div>

                <div>
                  <span className="content-kicker">
                    DELIVERY TIME
                  </span>

                  <h2>
                    Estimated Delivery
                  </h2>
                </div>
              </div>

              <div className="delivery-table">

                <div className="delivery-row delivery-head">
                  <span>Location</span>
                  <span>Estimated Time</span>
                </div>

                <div className="delivery-row">
                  <span>Metro / Major Cities</span>
                  <strong>3–5 Business Days</strong>
                </div>

                <div className="delivery-row">
                  <span>Other Locations</span>
                  <strong>4–7 Business Days</strong>
                </div>

                <div className="delivery-row">
                  <span>Remote Areas</span>
                  <strong>5–10 Business Days</strong>
                </div>

              </div>

              <p className="policy-note">
                <FiAlertCircle />
                Delivery estimates are indicative and may vary
                depending on the destination, courier service,
                weather and other unforeseen circumstances.
              </p>

            </section>

            {/* TRACKING */}

            <section className="shipping-section">

              <div className="section-title-row">
                <div className="section-number">
                  04
                </div>

                <div>
                  <span className="content-kicker">
                    ORDER TRACKING
                  </span>

                  <h2>
                    Track Your Order
                  </h2>
                </div>
              </div>

              <p>
                After your order has been dispatched, tracking
                information may be shared with you through the
                contact details provided during checkout.
              </p>

              <div className="tracking-card">

                <FiPackage />

                <div>
                  <strong>
                    Your order is on its way.
                  </strong>

                  <span>
                    Use the tracking information provided after
                    dispatch to check the latest delivery status.
                  </span>
                </div>

              </div>

            </section>

            {/* DELIVERY ISSUES */}

            <section className="shipping-section">

              <div className="section-title-row">
                <div className="section-number">
                  05
                </div>

                <div>
                  <span className="content-kicker">
                    DELIVERY ISSUES
                  </span>

                  <h2>
                    Delayed or Failed Delivery
                  </h2>
                </div>
              </div>

              <p>
                Sometimes deliveries can take longer than the
                estimated timeline due to circumstances outside
                our control.
              </p>

              <ul className="policy-list">

                <li>
                  <FiAlertCircle />
                  <span>
                    Incorrect or incomplete delivery address.
                  </span>
                </li>

                <li>
                  <FiAlertCircle />
                  <span>
                    Courier delays or operational issues.
                  </span>
                </li>

                <li>
                  <FiAlertCircle />
                  <span>
                    Weather conditions or natural events.
                  </span>
                </li>

                <li>
                  <FiAlertCircle />
                  <span>
                    Local restrictions, holidays or unexpected
                    delivery disruptions.
                  </span>
                </li>

              </ul>

            </section>

            {/* WRONG ADDRESS */}

            <section className="shipping-section">

              <div className="section-title-row">
                <div className="section-number">
                  06
                </div>

                <div>
                  <span className="content-kicker">
                    ADDRESS
                  </span>

                  <h2>
                    Incorrect Shipping Address
                  </h2>
                </div>
              </div>

              <p>
                Please carefully check your shipping address before
                placing an order. If you notice an incorrect address
                after placing an order, contact our support team as
                soon as possible.
              </p>

              <div className="warning-card">

                <FiAlertCircle />

                <span>
                  Once an order has been dispatched, changing the
                  delivery address may not be possible.
                </span>

              </div>

            </section>

            {/* DAMAGED PACKAGE */}

            <section className="shipping-section">

              <div className="section-title-row">
                <div className="section-number">
                  07
                </div>

                <div>
                  <span className="content-kicker">
                    PACKAGE SAFETY
                  </span>

                  <h2>
                    Damaged Package
                  </h2>
                </div>
              </div>

              <p>
                If your package appears damaged or tampered with at
                the time of delivery, please document the condition
                of the package and contact our support team as soon
                as possible.
              </p>

              <div className="policy-highlight green">

                <FiShield />

                <div>
                  <strong>
                    Please keep the packaging.
                  </strong>

                  <p>
                    Photos or other details may be requested to
                    help us review the issue.
                  </p>
                </div>

              </div>

            </section>

            {/* CONTACT */}

            <section className="shipping-contact">

              <div className="shipping-contact-icon">
                <FiPhone />
              </div>

              <div>
                <span>
                  NEED HELP WITH YOUR DELIVERY?
                </span>

                <h3>
                  We're here to help.
                </h3>

                <p>
                  For shipping-related questions, contact our
                  support team with your order details.
                </p>
              </div>

              <a href="mailto:support@vedabooti.com">
                Contact Support
              </a>

            </section>

          </article>

          {/* ================= SIDE CARD ================= */}

          <aside className="shipping-sidebar">

            <div className="shipping-side-card">

              <span>
                VEDA BOOTI
              </span>

              <h3>
                Delivered with care.
              </h3>

              <p>
                From our hands to your home, every order is
                prepared with care.
              </p>

              <div className="side-divider"></div>

              <div className="side-point">
                <FiPackage />
                <span>Carefully packed orders</span>
              </div>

              <div className="side-point">
                <FiTruck />
                <span>Reliable delivery partners</span>
              </div>

              <div className="side-point">
                <FiShield />
                <span>Secure checkout</span>
              </div>

            </div>

            <div className="shipping-help-card">

              <span>
                SUPPORT
              </span>

              <strong>
                Have a question?
              </strong>

              <p>
                Our support team is available to assist you.
              </p>

              <a href="mailto:support@vedabooti.com">
                support@vedabooti.com
              </a>

            </div>

          </aside>

        </div>

      </main>

      <SiteFooter />

    </div>
  );
}
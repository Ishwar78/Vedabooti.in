import React from "react";
import {
  FiFileText,
  FiUser,
  FiShoppingBag,
  FiCreditCard,
  FiTruck,
  FiRefreshCw,
  FiShield,
  FiAlertCircle,
  FiCheckCircle,
  FiMail
} from "react-icons/fi";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import "./TermsConditions.css";

export default function TermsConditions() {
  return (
    <div className="terms-page">

      <SiteHeader />

      {/* ================= HERO ================= */}

      <section className="terms-hero">
        <div className="terms-hero-inner">

          <span className="terms-eyebrow">
            VEDA BOOTI HEALTH CARE
          </span>

          <h1>
            Terms & <span>Conditions</span>
          </h1>

          <p>
            Please read these terms carefully before using our
            website and purchasing our products.
          </p>

          <div className="terms-hero-line"></div>

          <small>
            Last Updated: September 2026
          </small>

        </div>
      </section>

      {/* ================= MAIN ================= */}

      <main className="terms-main container">

        {/* ================= QUICK CARDS ================= */}

        <section className="terms-quick-grid">

          <div className="terms-quick-card">
            <div className="terms-icon">
              <FiFileText />
            </div>

            <div>
              <span>WEBSITE</span>
              <strong>Terms of Use</strong>
              <small>
                Rules for using the Veda Booti website.
              </small>
            </div>
          </div>

          <div className="terms-quick-card">
            <div className="terms-icon">
              <FiShoppingBag />
            </div>

            <div>
              <span>ORDERS</span>
              <strong>Purchase Terms</strong>
              <small>
                Important information about your orders.
              </small>
            </div>
          </div>

          <div className="terms-quick-card">
            <div className="terms-icon">
              <FiShield />
            </div>

            <div>
              <span>RESPONSIBILITY</span>
              <strong>Fair Use</strong>
              <small>
                Guidelines for responsible website usage.
              </small>
            </div>
          </div>

        </section>

        {/* ================= LAYOUT ================= */}

        <div className="terms-layout">

          <article className="terms-content">

            {/* INTRO */}

            <section className="terms-section terms-intro">

              <span className="terms-kicker">
                PLEASE READ CAREFULLY
              </span>

              <h2>
                Welcome to Veda Booti.
              </h2>

              <p>
                These Terms & Conditions govern your use of the
                Veda Booti Health Care website and the purchase of
                products through our online store.
              </p>

              <p>
                By accessing our website, creating an account or
                placing an order, you agree to be bound by these
                Terms & Conditions.
              </p>

            </section>

            {/* 01 ACCEPTANCE */}

            <section className="terms-section">

              <div className="terms-title-row">

                <div className="terms-number">
                  01
                </div>

                <div>
                  <span className="terms-kicker">
                    ACCEPTANCE
                  </span>

                  <h2>
                    Acceptance of Terms
                  </h2>
                </div>

              </div>

              <p>
                By using this website, you confirm that you have
                read, understood and agreed to these Terms &
                Conditions and any policies referenced on this
                website.
              </p>

              <div className="terms-highlight">

                <FiCheckCircle />

                <div>
                  <strong>
                    Your continued use of the website
                  </strong>

                  <p>
                    Continued access or use of our website after
                    changes to these terms may constitute acceptance
                    of the updated terms.
                  </p>
                </div>

              </div>

            </section>

            {/* 02 ELIGIBILITY */}

            <section className="terms-section">

              <div className="terms-title-row">

                <div className="terms-number">
                  02
                </div>

                <div>
                  <span className="terms-kicker">
                    ELIGIBILITY
                  </span>

                  <h2>
                    Use of Our Website
                  </h2>
                </div>

              </div>

              <p>
                You agree to use this website only for lawful
                purposes and in a manner that does not harm,
                disrupt or interfere with the website or other
                users.
              </p>

              <ul className="terms-list">

                <li>
                  <FiCheckCircle />
                  <span>
                    Provide accurate information when creating an
                    account or placing an order.
                  </span>
                </li>

                <li>
                  <FiCheckCircle />
                  <span>
                    Keep your account credentials secure.
                  </span>
                </li>

                <li>
                  <FiCheckCircle />
                  <span>
                    Do not attempt to gain unauthorised access to
                    the website or its systems.
                  </span>
                </li>

                <li>
                  <FiCheckCircle />
                  <span>
                    Do not use the website for fraudulent or
                    unlawful activities.
                  </span>
                </li>

              </ul>

            </section>

            {/* 03 PRODUCTS */}

            <section className="terms-section">

              <div className="terms-title-row">

                <div className="terms-number">
                  03
                </div>

                <div>
                  <span className="terms-kicker">
                    PRODUCTS
                  </span>

                  <h2>
                    Product Information
                  </h2>
                </div>

              </div>

              <p>
                We make reasonable efforts to ensure that product
                descriptions, images, prices and other information
                displayed on the website are accurate and
                up-to-date.
              </p>

              <p>
                However, product packaging, appearance, availability
                and other details may occasionally differ from
                website images or descriptions.
              </p>

              <div className="terms-note">
                <FiAlertCircle />
                <span>
                  Product availability and information may change
                  without prior notice.
                </span>
              </div>

            </section>

            {/* 04 ORDERS */}

            <section className="terms-section">

              <div className="terms-title-row">

                <div className="terms-number">
                  04
                </div>

                <div>
                  <span className="terms-kicker">
                    ORDERS
                  </span>

                  <h2>
                    Orders & Acceptance
                  </h2>
                </div>

              </div>

              <p>
                Placing an order on our website constitutes a
                request to purchase the selected products. An order
                is subject to availability and confirmation.
              </p>

              <ul className="terms-list">

                <li>
                  <FiCheckCircle />
                  <span>
                    Orders may be cancelled or declined in certain
                    circumstances.
                  </span>
                </li>

                <li>
                  <FiCheckCircle />
                  <span>
                    We may contact you to verify order details when
                    necessary.
                  </span>
                </li>

                <li>
                  <FiCheckCircle />
                  <span>
                    If an ordered product becomes unavailable, we
                    may inform you and provide an appropriate
                    resolution.
                  </span>
                </li>

              </ul>

            </section>

            {/* 05 PRICING */}

            <section className="terms-section">

              <div className="terms-title-row">

                <div className="terms-number">
                  05
                </div>

                <div>
                  <span className="terms-kicker">
                    PRICING & PAYMENT
                  </span>

                  <h2>
                    Prices and Payments
                  </h2>
                </div>

              </div>

              <div className="terms-payment-card">

                <div className="terms-payment-icon">
                  <FiCreditCard />
                </div>

                <div>
                  <strong>
                    Secure Payment Processing
                  </strong>

                  <p>
                    Payments may be processed through third-party
                    payment providers. Payment methods available at
                    checkout may vary.
                  </p>
                </div>

              </div>

              <p>
                Prices displayed on the website may be changed from
                time to time. Applicable taxes, shipping charges,
                discounts or other charges will be shown where
                applicable during checkout.
              </p>

            </section>

            {/* 06 SHIPPING */}

            <section className="terms-section">

              <div className="terms-title-row">

                <div className="terms-number">
                  06
                </div>

                <div>
                  <span className="terms-kicker">
                    SHIPPING
                  </span>

                  <h2>
                    Shipping & Delivery
                  </h2>
                </div>

              </div>

              <p>
                Orders are processed and delivered according to our
                applicable shipping arrangements. Delivery estimates
                are indicative and may vary depending on destination,
                courier operations and circumstances outside our
                control.
              </p>

              <div className="terms-side-info">

                <FiTruck />

                <div>
                  <strong>
                    Delivery Information
                  </strong>

                  <span>
                    Please refer to our Shipping Policy for detailed
                    information about processing, delivery timelines
                    and shipping charges.
                  </span>
                </div>

              </div>

            </section>

            {/* 07 RETURNS */}

            <section className="terms-section">

              <div className="terms-title-row">

                <div className="terms-number">
                  07
                </div>

                <div>
                  <span className="terms-kicker">
                    RETURNS & REFUNDS
                  </span>

                  <h2>
                    Returns, Replacements & Refunds
                  </h2>
                </div>

              </div>

              <p>
                Returns, replacements and refunds are subject to our
                applicable return and refund policy.
              </p>

              <p>
                Products may be eligible for return or replacement
                only when the conditions specified in the applicable
                policy are satisfied.
              </p>

              <div className="terms-side-info green">

                <FiRefreshCw />

                <div>
                  <strong>
                    Need to return an order?
                  </strong>

                  <span>
                    Contact customer support and provide your order
                    details so that the request can be reviewed.
                  </span>
                </div>

              </div>

            </section>

            {/* 08 ACCOUNT */}

            <section className="terms-section">

              <div className="terms-title-row">

                <div className="terms-number">
                  08
                </div>

                <div>
                  <span className="terms-kicker">
                    ACCOUNT
                  </span>

                  <h2>
                    User Accounts
                  </h2>
                </div>

              </div>

              <p>
                If you create an account, you are responsible for
                keeping your login information confidential and for
                activities carried out through your account.
              </p>

              <p>
                Please notify us if you believe your account has
                been accessed without your permission.
              </p>

            </section>

            {/* 09 REVIEWS */}

            <section className="terms-section">

              <div className="terms-title-row">

                <div className="terms-number">
                  09
                </div>

                <div>
                  <span className="terms-kicker">
                    CUSTOMER REVIEWS
                  </span>

                  <h2>
                    Reviews & User Content
                  </h2>
                </div>

              </div>

              <p>
                When submitting a review, comment or other content,
                you agree that the information provided is truthful,
                relevant and does not violate the rights of another
                person.
              </p>

              <ul className="terms-list">

                <li>
                  <FiCheckCircle />
                  <span>
                    Do not submit abusive, misleading or unlawful
                    content.
                  </span>
                </li>

                <li>
                  <FiCheckCircle />
                  <span>
                    Do not impersonate another person.
                  </span>
                </li>

                <li>
                  <FiCheckCircle />
                  <span>
                    Do not submit content containing malicious
                    links or harmful material.
                  </span>
                </li>

              </ul>

            </section>

            {/* 10 INTELLECTUAL PROPERTY */}

            <section className="terms-section">

              <div className="terms-title-row">

                <div className="terms-number">
                  10
                </div>

                <div>
                  <span className="terms-kicker">
                    INTELLECTUAL PROPERTY
                  </span>

                  <h2>
                    Website Content
                  </h2>
                </div>

              </div>

              <p>
                Unless otherwise stated, website content including
                logos, text, graphics, images, product descriptions,
                design elements and other materials belongs to or is
                used by Veda Booti Health Care with appropriate
                rights.
              </p>

              <p>
                You may not reproduce, copy, distribute, modify or
                commercially exploit website content without
                appropriate permission.
              </p>

            </section>

            {/* 11 PROHIBITED */}

            <section className="terms-section">

              <div className="terms-title-row">

                <div className="terms-number">
                  11
                </div>

                <div>
                  <span className="terms-kicker">
                    PROHIBITED USE
                  </span>

                  <h2>
                    Activities Not Allowed
                  </h2>
                </div>

              </div>

              <ul className="terms-list">

                <li>
                  <FiAlertCircle />
                  <span>
                    Attempting to interfere with website security
                    or functionality.
                  </span>
                </li>

                <li>
                  <FiAlertCircle />
                  <span>
                    Using automated systems to misuse or overload
                    the website.
                  </span>
                </li>

                <li>
                  <FiAlertCircle />
                  <span>
                    Using website information for unlawful purposes.
                  </span>
                </li>

                <li>
                  <FiAlertCircle />
                  <span>
                    Attempting to access another user's account or
                    private information.
                  </span>
                </li>

              </ul>

            </section>

            {/* 12 LIABILITY */}

            <section className="terms-section">

              <div className="terms-title-row">

                <div className="terms-number">
                  12
                </div>

                <div>
                  <span className="terms-kicker">
                    LIMITATION
                  </span>

                  <h2>
                    Website Availability
                  </h2>
                </div>

              </div>

              <p>
                We aim to keep our website available and
                information accurate, but temporary interruptions,
                technical issues or inaccuracies may occasionally
                occur.
              </p>

              <p>
                We may modify, suspend or discontinue parts of the
                website or services when reasonably necessary.
              </p>

            </section>

            {/* 13 CHANGES */}

            <section className="terms-section">

              <div className="terms-title-row">

                <div className="terms-number">
                  13
                </div>

                <div>
                  <span className="terms-kicker">
                    UPDATES
                  </span>

                  <h2>
                    Changes to These Terms
                  </h2>
                </div>

              </div>

              <p>
                We may update these Terms & Conditions from time to
                time. Updated terms will be published on this page
                along with the revised update date.
              </p>

              <p>
                You should review this page periodically to stay
                informed about any changes.
              </p>

            </section>

            {/* CONTACT */}

            <section className="terms-contact">

              <div className="terms-contact-icon">
                <FiMail />
              </div>

              <div>
                <span>
                  QUESTIONS ABOUT THESE TERMS?
                </span>

                <h3>
                  We're here to help.
                </h3>

                <p>
                  If you have questions about these Terms &
                  Conditions, contact our support team.
                </p>
              </div>

              <a href="/support">
                Contact Us
              </a>

            </section>

          </article>

          {/* ================= SIDEBAR ================= */}

          <aside className="terms-sidebar">

            <div className="terms-side-card">

              <div className="terms-side-icon">
                <FiFileText />
              </div>

              <span>
                VEDA BOOTI
              </span>

              <h3>
                Clear & simple.
              </h3>

              <p>
                We want your shopping experience to be simple,
                transparent and comfortable.
              </p>

              <div className="terms-side-divider"></div>

              <div className="terms-side-point">
                <FiShoppingBag />
                <span>
                  Simple online shopping
                </span>
              </div>

              <div className="terms-side-point">
                <FiTruck />
                <span>
                  Clear delivery information
                </span>
              </div>

              <div className="terms-side-point">
                <FiShield />
                <span>
                  Responsible website use
                </span>
              </div>

            </div>

            <div className="terms-help-card">

              <span>
                CUSTOMER SUPPORT
              </span>

              <strong>
                Need assistance?
              </strong>

              <p>
                Our support team can help with your order or
                questions about these terms.
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
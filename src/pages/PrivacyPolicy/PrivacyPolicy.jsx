import React from "react";
import {
  FiShield,
  FiUser,
  FiShoppingBag,
  FiCreditCard,
  FiGlobe,
  FiLock,
  FiDatabase,
  FiMail,
  FiCheckCircle,
  FiAlertCircle
} from "react-icons/fi";

import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import "./PrivacyPolicy.css";

export default function PrivacyPolicy() {
  return (
    <div className="privacy-page">

      <SiteHeader />

      {/* ================= HERO ================= */}

      <section className="privacy-hero">
        <div className="privacy-hero-inner">

          <span className="privacy-eyebrow">
            VEDA BOOTI HEALTH CARE
          </span>

          <h1>
            Privacy <span>Policy</span>
          </h1>

          <p>
            Your privacy matters to us. Learn how we collect,
            use and protect your information.
          </p>

          <div className="privacy-hero-line"></div>

          <small>
            Last Updated: September 2026
          </small>

        </div>
      </section>

      {/* ================= MAIN ================= */}

      <main className="privacy-main container">

        {/* ================= QUICK CARDS ================= */}

        <section className="privacy-quick-grid">

          <div className="privacy-quick-card">
            <div className="privacy-icon">
              <FiShield />
            </div>

            <div>
              <span>YOUR PRIVACY</span>
              <strong>Protected</strong>
              <small>
                We take reasonable steps to protect your information.
              </small>
            </div>
          </div>

          <div className="privacy-quick-card">
            <div className="privacy-icon">
              <FiLock />
            </div>

            <div>
              <span>YOUR DATA</span>
              <strong>Handled Securely</strong>
              <small>
                Information is handled only for legitimate purposes.
              </small>
            </div>
          </div>

          <div className="privacy-quick-card">
            <div className="privacy-icon">
              <FiUser />
            </div>

            <div>
              <span>YOUR CONTROL</span>
              <strong>Your Information</strong>
              <small>
                You can contact us regarding your personal information.
              </small>
            </div>
          </div>

        </section>

        {/* ================= CONTENT ================= */}

        <div className="privacy-layout">

          <article className="privacy-content">

            {/* INTRO */}

            <section className="privacy-section privacy-intro">

              <span className="privacy-kicker">
                PRIVACY & DATA PROTECTION
              </span>

              <h2>
                We respect your personal information.
              </h2>

              <p>
                This Privacy Policy explains how Veda Booti Health
                Care collects, uses, stores and protects information
                when you visit our website, create an account,
                purchase our products or contact us.
              </p>

              <p>
                By using our website and services, you acknowledge
                the practices described in this Privacy Policy.
              </p>

            </section>

            {/* 01 INFORMATION */}

            <section className="privacy-section">

              <div className="privacy-title-row">

                <div className="privacy-number">
                  01
                </div>

                <div>
                  <span className="privacy-kicker">
                    INFORMATION WE COLLECT
                  </span>

                  <h2>
                    Information You Provide
                  </h2>
                </div>

              </div>

              <p>
                We may collect information that you voluntarily
                provide when you use our website or interact with
                our services.
              </p>

              <ul className="privacy-list">

                <li>
                  <FiCheckCircle />
                  <span>
                    Name and contact information.
                  </span>
                </li>

                <li>
                  <FiCheckCircle />
                  <span>
                    Email address and phone number.
                  </span>
                </li>

                <li>
                  <FiCheckCircle />
                  <span>
                    Shipping and billing address.
                  </span>
                </li>

                <li>
                  <FiCheckCircle />
                  <span>
                    Account information such as login details.
                  </span>
                </li>

                <li>
                  <FiCheckCircle />
                  <span>
                    Information submitted through contact,
                    support or review forms.
                  </span>
                </li>

              </ul>

            </section>

            {/* 02 AUTOMATIC */}

            <section className="privacy-section">

              <div className="privacy-title-row">

                <div className="privacy-number">
                  02
                </div>

                <div>
                  <span className="privacy-kicker">
                    AUTOMATIC INFORMATION
                  </span>

                  <h2>
                    Information Collected Automatically
                  </h2>
                </div>

              </div>

              <p>
                When you visit our website, certain technical
                information may be collected automatically by the
                website, hosting provider, analytics services or
                similar technologies.
              </p>

              <div className="privacy-data-grid">

                <div>
                  <FiGlobe />
                  <strong>
                    Device Information
                  </strong>
                  <span>
                    Browser, device type and operating information.
                  </span>
                </div>

                <div>
                  <FiDatabase />
                  <strong>
                    Usage Information
                  </strong>
                  <span>
                    Pages visited, interactions and general website
                    activity.
                  </span>
                </div>

                <div>
                  <FiShield />
                  <strong>
                    Technical Data
                  </strong>
                  <span>
                    Basic information required for security and
                    website operation.
                  </span>
                </div>

              </div>

            </section>

            {/* 03 USE */}

            <section className="privacy-section">

              <div className="privacy-title-row">

                <div className="privacy-number">
                  03
                </div>

                <div>
                  <span className="privacy-kicker">
                    HOW WE USE INFORMATION
                  </span>

                  <h2>
                    Why We Use Your Information
                  </h2>
                </div>

              </div>

              <p>
                Information may be used for purposes including:
              </p>

              <ul className="privacy-list">

                <li>
                  <FiCheckCircle />
                  <span>
                    Processing and delivering your orders.
                  </span>
                </li>

                <li>
                  <FiCheckCircle />
                  <span>
                    Managing your account and customer profile.
                  </span>
                </li>

                <li>
                  <FiCheckCircle />
                  <span>
                    Providing customer support and responding to
                    enquiries.
                  </span>
                </li>

                <li>
                  <FiCheckCircle />
                  <span>
                    Improving our website, products and services.
                  </span>
                </li>

                <li>
                  <FiCheckCircle />
                  <span>
                    Sending service-related communications.
                  </span>
                </li>

                <li>
                  <FiCheckCircle />
                  <span>
                    Detecting, preventing and addressing fraud,
                    misuse or security issues.
                  </span>
                </li>

              </ul>

            </section>

            {/* 04 ORDERS */}

            <section className="privacy-section">

              <div className="privacy-title-row">

                <div className="privacy-number">
                  04
                </div>

                <div>
                  <span className="privacy-kicker">
                    ORDERS & PAYMENTS
                  </span>

                  <h2>
                    Purchases and Payments
                  </h2>
                </div>

              </div>

              <div className="privacy-highlight">

                <FiShoppingBag />

                <div>
                  <strong>
                    Your order information
                  </strong>

                  <p>
                    We use the information necessary to process
                    your order, arrange delivery, provide support
                    and maintain appropriate transaction records.
                  </p>
                </div>

              </div>

              <p>
                Payment information may be processed through
                third-party payment providers. Where applicable,
                payment details are handled according to the
                security and privacy practices of the relevant
                payment service provider.
              </p>

            </section>

            {/* 05 COOKIES */}

            <section className="privacy-section">

              <div className="privacy-title-row">

                <div className="privacy-number">
                  05
                </div>

                <div>
                  <span className="privacy-kicker">
                    COOKIES
                  </span>

                  <h2>
                    Cookies & Similar Technologies
                  </h2>
                </div>

              </div>

              <p>
                Our website may use cookies or similar technologies
                to remember preferences, maintain sessions,
                understand website usage and improve your browsing
                experience.
              </p>

              <div className="privacy-cookie-card">

                <FiGlobe />

                <div>
                  <strong>
                    Why cookies may be used
                  </strong>

                  <span>
                    Website functionality, analytics, preferences
                    and performance.
                  </span>
                </div>

              </div>

            </section>

            {/* 06 THIRD PARTY */}

            <section className="privacy-section">

              <div className="privacy-title-row">

                <div className="privacy-number">
                  06
                </div>

                <div>
                  <span className="privacy-kicker">
                    THIRD-PARTY SERVICES
                  </span>

                  <h2>
                    External Service Providers
                  </h2>
                </div>

              </div>

              <p>
                We may work with trusted third-party service
                providers that help us operate the website and
                fulfil services such as payment processing,
                shipping, hosting, analytics, communication and
                technical support.
              </p>

              <p>
                Such providers may have access to information only
                to the extent necessary to perform services on our
                behalf and subject to their applicable terms and
                privacy practices.
              </p>

            </section>

            {/* 07 SECURITY */}

            <section className="privacy-section">

              <div className="privacy-title-row">

                <div className="privacy-number">
                  07
                </div>

                <div>
                  <span className="privacy-kicker">
                    DATA SECURITY
                  </span>

                  <h2>
                    How We Protect Your Information
                  </h2>
                </div>

              </div>

              <div className="privacy-security-card">

                <div className="privacy-security-icon">
                  <FiLock />
                </div>

                <div>
                  <strong>
                    Security is important to us.
                  </strong>

                  <p>
                    We use reasonable technical and organisational
                    measures designed to protect personal information
                    from unauthorised access, misuse, alteration or
                    disclosure.
                  </p>
                </div>

              </div>

              <p className="privacy-note">
                <FiAlertCircle />
                No method of transmission or storage can be
                guaranteed to be completely secure. We therefore
                cannot guarantee absolute security of information.
              </p>

            </section>

            {/* 08 RETENTION */}

            <section className="privacy-section">

              <div className="privacy-title-row">

                <div className="privacy-number">
                  08
                </div>

                <div>
                  <span className="privacy-kicker">
                    DATA RETENTION
                  </span>

                  <h2>
                    How Long We Keep Information
                  </h2>
                </div>

              </div>

              <p>
                We retain personal information for as long as
                reasonably necessary to provide our services,
                complete transactions, maintain business records,
                comply with applicable legal obligations and
                resolve disputes.
              </p>

            </section>

            {/* 09 RIGHTS */}

            <section className="privacy-section">

              <div className="privacy-title-row">

                <div className="privacy-number">
                  09
                </div>

                <div>
                  <span className="privacy-kicker">
                    YOUR CHOICES
                  </span>

                  <h2>
                    Your Privacy Choices
                  </h2>
                </div>

              </div>

              <p>
                Depending on applicable law, you may have rights
                relating to your personal information, including
                requesting access, correction or deletion of certain
                information.
              </p>

              <p>
                You may also contact us regarding marketing
                communications or other privacy-related requests.
              </p>

            </section>

            {/* 10 CHILDREN */}

            <section className="privacy-section">

              <div className="privacy-title-row">

                <div className="privacy-number">
                  10
                </div>

                <div>
                  <span className="privacy-kicker">
                    CHILDREN'S PRIVACY
                  </span>

                  <h2>
                    Children's Information
                  </h2>
                </div>

              </div>

              <p>
                Our services are not intentionally designed to
                collect personal information from children without
                appropriate consent. If you believe that a child has
                provided personal information to us, please contact
                us so that we can review the situation.
              </p>

            </section>

            {/* 11 CHANGES */}

            <section className="privacy-section">

              <div className="privacy-title-row">

                <div className="privacy-number">
                  11
                </div>

                <div>
                  <span className="privacy-kicker">
                    POLICY UPDATES
                  </span>

                  <h2>
                    Changes to This Policy
                  </h2>
                </div>

              </div>

              <p>
                We may update this Privacy Policy from time to time
                to reflect changes in our services, technology,
                legal requirements or business practices.
              </p>

              <p>
                When changes are made, the updated version will be
                published on this page with a revised update date.
              </p>

            </section>

            {/* CONTACT */}

            <section className="privacy-contact">

              <div className="privacy-contact-icon">
                <FiMail />
              </div>

              <div>
                <span>
                  PRIVACY QUESTIONS?
                </span>

                <h3>
                  We're happy to help.
                </h3>

                <p>
                  If you have questions about this Privacy Policy
                  or your personal information, contact our support
                  team.
                </p>
              </div>

              <a href="/support">
                Contact Us
              </a>

            </section>

          </article>

          {/* ================= SIDEBAR ================= */}

          <aside className="privacy-sidebar">

            <div className="privacy-side-card">

              <div className="privacy-side-shield">
                <FiShield />
              </div>

              <span>
                VEDA BOOTI
              </span>

              <h3>
                Your trust matters.
              </h3>

              <p>
                We believe good wellness starts with good
                responsibility — including the way we handle
                your information.
              </p>

              <div className="privacy-side-divider"></div>

              <div className="privacy-side-point">
                <FiLock />
                <span>
                  Secure information handling
                </span>
              </div>

              <div className="privacy-side-point">
                <FiShield />
                <span>
                  Responsible data practices
                </span>
              </div>

              <div className="privacy-side-point">
                <FiCheckCircle />
                <span>
                  Transparent communication
                </span>
              </div>

            </div>

            <div className="privacy-help-card">

              <span>
                PRIVACY SUPPORT
              </span>

              <strong>
                Have a question?
              </strong>

              <p>
                Contact us if you have any privacy or
                data-related concerns.
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
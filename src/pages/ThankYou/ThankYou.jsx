import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiCheck, FiPackage, FiPrinter, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import InvoiceModal from "../../components/InvoiceModal";
import "./ThankYou.css";

export default function ThankYou() {
  const location = useLocation();
  const [showInvoice, setShowInvoice] = useState(false);

  // Retrieve placed order from location state or latest in localStorage
  const order =
    location.state?.order ||
    (() => {
      try {
        const stored = JSON.parse(localStorage.getItem("vb_orders") || "[]");
        return Array.isArray(stored) && stored.length > 0 ? stored[0] : null;
      } catch {
        return null;
      }
    })();

  const orderId = order?.orderId || "VB-2026-10482";
  const grandTotal = order?.grandTotal ? `₹${order.grandTotal}` : "";

  return (
    <div>
      <SiteHeader />
      <main className="thank-page container">
        <div className="thank-card">
          <div className="check">
            <FiCheck />
          </div>
          <span className="eyebrow">Order Confirmed</span>
          <h1>Thank You For Your Order</h1>
          <p>
            Your order has been placed successfully. We’ll keep you updated as it moves through delivery.
          </p>

          <div className="order-box">
            <div>
              <span>
                <FiPackage /> Order Reference
              </span>
              <b>{orderId}</b>
            </div>
            {grandTotal && (
              <div style={{ textAlign: "right" }}>
                <span>Amount Paid / Payable</span>
                <b style={{ color: "#d8b56a", fontSize: "14px" }}>{grandTotal}</b>
              </div>
            )}
          </div>

          <div className="thank-actions">
            {order && (
              <button
                type="button"
                className="btn btn-thank-invoice"
                onClick={() => setShowInvoice(true)}
              >
                <FiPrinter /> View / Print Tax Invoice
              </button>
            )}
            <Link className="btn" to="/orders">
              View My Orders
            </Link>
            <Link className="btn dark" to="/shop">
              <FiShoppingBag /> Continue Shopping
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />

      {/* Invoice Modal */}
      {showInvoice && order && (
        <InvoiceModal order={order} onClose={() => setShowInvoice(false)} />
      )}
    </div>
  );
}
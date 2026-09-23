import React from "react";
import { Link } from "react-router-dom";
import UserShell from "../../components/UserShell";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import "./OrderDetails.css";

export default function OrderDetails() {
  return (
    <UserShell>
      <div className="order-details-section">
        <Link to="/orders" className="back-orders-link">
          <FiArrowLeft /> Back to All Orders
        </Link>

        <div className="order-details-head">
          <div>
            <span className="eyebrow">Order ID: VB-2026-10482</span>
            <h1>Order Summary</h1>
          </div>
          <span className="status-badge delivered">
            <FiCheckCircle /> Delivered on 22 Sep 2026
          </span>
        </div>

        <div className="order-detail-card">
          <div className="timeline">
            <span className="done">1. Order Placed</span>
            <span className="done">2. Packed & Quality Checked</span>
            <span className="done">3. Shipped (Delhivery)</span>
            <span className="done">4. Delivered</span>
          </div>

          <hr />

          <div className="order-items-breakdown">
            <h3>Items in this Order</h3>
            <div className="order-line">
              <span>Black 3X Power Oil (Strength & Vitality) × 1</span>
              <b>₹299</b>
            </div>
            <div className="order-line">
              <span>Shipping (Free on orders above ₹499)</span>
              <b>FREE</b>
            </div>
            <div className="order-line grand">
              <span>Total Paid (Cash on Delivery)</span>
              <b>₹299</b>
            </div>
          </div>
        </div>
      </div>
    </UserShell>
  );
}

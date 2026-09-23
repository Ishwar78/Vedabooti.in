import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserShell from "../../components/UserShell";
import { FiPackage, FiChevronRight } from "react-icons/fi";
import "./Orders.css";

const defaultOrders = [
  {
    orderId: "VB-2026-10482",
    summary: "Black 3X Power Oil × 1",
    total: "₹299",
    status: "Delivered",
    date: "22 Sep 2026"
  },
  {
    orderId: "VB-2026-10441",
    summary: "Black 3X Power Caps × 2",
    total: "₹498",
    status: "Shipped",
    date: "18 Sep 2026"
  },
  {
    orderId: "VB-2026-10398",
    summary: "Black 3X Power Avleha × 2",
    total: "₹398",
    status: "Delivered",
    date: "12 Sep 2026"
  }
];

export default function Orders() {
  const [orders, setOrders] = useState(defaultOrders);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("vb_orders") || "[]");
      if (stored.length > 0) {
        const mapped = stored.map((o) => ({
          orderId: o.orderId,
          summary:
            o.items?.map((it) => `${it.name} × ${it.qty || 1}`).join(", ") ||
            "Ayurvedic Wellness Pack",
          total: `₹${o.grandTotal}`,
          status: o.status || "Confirmed",
          date: o.date || "Recent"
        }));
        setOrders([...mapped, ...defaultOrders]);
      }
    } catch {
      // fallback to default
    }
  }, []);

  return (
    <UserShell>
      <div className="orders-section">
        <span className="eyebrow">Purchase History</span>
        <h1>My Orders ({orders.length})</h1>
        <p className="account-sub">Track delivery status and view order receipts.</p>

        <div className="orders-list">
          {orders.map((o) => (
            <article key={o.orderId} className="order-row">
              <div className="order-main-info">
                <div className="order-id-date">
                  <b>{o.orderId}</b>
                  <small>{o.date}</small>
                </div>
                <p className="order-summary-text">{o.summary}</p>
              </div>
              <strong className="order-total-price">{o.total}</strong>
              <span className={`order-status-badge ${o.status.toLowerCase()}`}>
                ● {o.status}
              </span>
              <Link to="/order-details" className="order-view-link">
                <span>View Details</span>
                <FiChevronRight />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </UserShell>
  );
}

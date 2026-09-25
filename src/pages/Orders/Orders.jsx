import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserShell from "../../components/UserShell";
import { FiPackage, FiChevronRight, FiRefreshCw, FiShoppingBag, FiPrinter } from "react-icons/fi";
import api from "../../lib/api";
import InvoiceModal from "../../components/InvoiceModal";
import "./Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("userToken");
        if (token) {
          const res = await api.get("/api/orders/my-orders");
          if (res?.success && Array.isArray(res.orders)) {
            const mapped = res.orders.map((o) => ({
              orderId: o.orderId,
              summary:
                o.items?.map((it) => `${it.name} × ${it.qty || 1}`).join(", ") ||
                "Ayurvedic Wellness Pack",
              total: `₹${o.grandTotal}`,
              status: o.status || "Confirmed",
              date: o.createdAt
                ? new Date(o.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "Recent",
              raw: o,
            }));
            setOrders(mapped);
            return;
          }
        }

        // Fallback: check localStorage for guest/offline orders
        const stored = JSON.parse(localStorage.getItem("vb_orders") || "[]");
        if (Array.isArray(stored)) {
          const mapped = stored.map((o) => ({
            orderId: o.orderId,
            summary:
              o.items?.map((it) => `${it.name} × ${it.qty || 1}`).join(", ") ||
              "Ayurvedic Wellness Pack",
            total: `₹${o.grandTotal}`,
            status: o.status || "Confirmed",
            date: o.date || "Recent",
            raw: o,
          }));
          setOrders(mapped);
        }
      } catch (err) {
        console.warn("Could not fetch remote orders:", err.message);
        const stored = JSON.parse(localStorage.getItem("vb_orders") || "[]");
        const mapped = stored.map((o) => ({
          orderId: o.orderId,
          summary:
            o.items?.map((it) => `${it.name} × ${it.qty || 1}`).join(", ") ||
            "Ayurvedic Wellness Pack",
          total: `₹${o.grandTotal}`,
          status: o.status || "Confirmed",
          date: o.date || "Recent",
          raw: o,
        }));
        setOrders(mapped);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <UserShell>
      <div className="orders-section">
        <span className="eyebrow">Purchase History</span>
        <h1>My Orders ({orders.length})</h1>
        <p className="account-sub">Track delivery status and view order receipts.</p>

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#8da497" }}>
            <FiRefreshCw className="spin" size={24} />
            <p style={{ marginTop: "8px" }}>Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div
            style={{
              padding: "50px 24px",
              textAlign: "center",
              background: "#091d14",
              borderRadius: "12px",
              border: "1px dashed rgba(216, 181, 106, 0.25)",
              color: "#8da497",
            }}
          >
            <FiPackage size={40} style={{ color: "#d8b56a", opacity: 0.8 }} />
            <h3 style={{ color: "#edf4ef", marginTop: "12px" }}>No Orders Yet</h3>
            <p style={{ maxWidth: "420px", margin: "6px auto 20px", fontSize: "14px" }}>
              You haven't placed any orders yet. Discover our pure Ayurvedic remedies and start your wellness journey.
            </p>
            <Link to="/shop" className="btn">
              <FiShoppingBag /> Explore Store
            </Link>
          </div>
        ) : (
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
                <div className="order-row-actions">
                  <button
                    type="button"
                    className="order-invoice-btn"
                    title="View / Print Tax Invoice"
                    onClick={() => setInvoiceOrder(o.raw)}
                  >
                    <FiPrinter /> Bill
                  </button>
                  <Link
                    to="/order-details"
                    state={{ order: o.raw }}
                    className="order-view-link"
                  >
                    <span>Details</span>
                    <FiChevronRight />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Invoice Modal */}
        {invoiceOrder && (
          <InvoiceModal
            order={invoiceOrder}
            onClose={() => setInvoiceOrder(null)}
          />
        )}
      </div>
    </UserShell>
  );
}

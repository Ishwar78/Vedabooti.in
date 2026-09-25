import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import UserShell from "../../components/UserShell";
import { FiArrowLeft, FiCheckCircle, FiPackage, FiMapPin, FiPrinter, FiRotateCcw } from "react-icons/fi";
import api from "../../lib/api";
import InvoiceModal from "../../components/InvoiceModal";
import ReturnRequestModal from "../../components/ReturnRequestModal";
import "./OrderDetails.css";

export default function OrderDetails() {
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [showInvoice, setShowInvoice] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);

  useEffect(() => {
    if (order) return;

    // Try fetching from API or local storage
    const loadOrder = async () => {
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("userToken");
        if (token) {
          const res = await api.get("/api/orders/my-orders");
          if (res?.success && Array.isArray(res.orders) && res.orders.length > 0) {
            setOrder(res.orders[0]);
            return;
          }
        }

        const stored = JSON.parse(localStorage.getItem("vb_orders") || "[]");
        if (Array.isArray(stored) && stored.length > 0) {
          setOrder(stored[0]);
        }
      } catch (err) {
        console.warn("Could not load order details:", err);
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [order]);

  if (loading) {
    return (
      <UserShell>
        <div style={{ padding: "50px", textAlign: "center", color: "#8da497" }}>
          <p>Loading order details...</p>
        </div>
      </UserShell>
    );
  }

  if (!order) {
    return (
      <UserShell>
        <div className="order-details-section">
          <Link to="/orders" className="back-orders-link">
            <FiArrowLeft /> Back to All Orders
          </Link>
          <div style={{ padding: "40px", textAlign: "center", color: "#8da497" }}>
            <FiPackage size={40} style={{ opacity: 0.5, marginBottom: "10px" }} />
            <h3 style={{ color: "#edf4ef" }}>No Order Selected</h3>
            <p style={{ margin: "6px 0 16px" }}>Please select an order from your order history.</p>
            <Link to="/orders" className="btn">
              View Orders
            </Link>
          </div>
        </div>
      </UserShell>
    );
  }

  const items = order.items || [];
  const status = order.status || "Confirmed";
  const dateStr = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : order.date || "Recent";

  return (
    <UserShell>
      <div className="order-details-section">
        <Link to="/orders" className="back-orders-link">
          <FiArrowLeft /> Back to All Orders
        </Link>

        <div className="order-details-head">
          <div>
            <span className="eyebrow">Order ID: {order.orderId}</span>
            <h1>Order Summary</h1>
            <p style={{ margin: "4px 0 0", color: "#8c9a92", fontSize: "13px" }}>
              Placed on {dateStr}
            </p>
          </div>
          <div className="order-details-head-actions">
            {status === "Delivered" && (
              <button
                type="button"
                className="btn-details-return"
                onClick={() => setShowReturnModal(true)}
                title="Request Return or Refund for this Order"
              >
                <FiRotateCcw /> Return / Refund
              </button>
            )}
            <button
              type="button"
              className="btn-details-invoice"
              onClick={() => setShowInvoice(true)}
              title="Download or Print Tax Invoice"
            >
              <FiPrinter /> Download Bill / Invoice
            </button>
            <span className={`status-badge ${(status || "").toLowerCase()}`}>
              <FiCheckCircle /> {status}
            </span>
          </div>
        </div>

        <div className="order-detail-card">
          <div className="timeline">
            <span className={["Confirmed", "Processing", "Shipped", "Delivered"].includes(status) ? "done" : ""}>
              1. Order Placed
            </span>
            <span className={["Processing", "Shipped", "Delivered"].includes(status) ? "done" : ""}>
              2. Packed & Quality Checked
            </span>
            <span className={["Shipped", "Delivered"].includes(status) ? "done" : ""}>
              3. Shipped
            </span>
            <span className={status === "Delivered" ? "done" : ""}>
              4. Delivered
            </span>
          </div>

          <hr />

          <div className="order-items-breakdown">
            <h3>Items in this Order ({items.length})</h3>
            {items.map((item, idx) => (
              <div className="order-line" key={idx}>
                <span>
                  {item.name} × {item.qty || 1}
                </span>
                <b>₹{(Number(item.price) || 0) * (item.qty || 1)}</b>
              </div>
            ))}

            <div className="order-line" style={{ marginTop: "10px" }}>
              <span>Subtotal</span>
              <b>₹{order.subtotal || 0}</b>
            </div>

            {order.discount > 0 && (
              <div className="order-line" style={{ color: "#4ade80" }}>
                <span>Coupon Discount {order.coupon ? `(${order.coupon})` : ""}</span>
                <b>-₹{order.discount}</b>
              </div>
            )}

            <div className="order-line">
              <span>Shipping</span>
              <b>{order.shipping === 0 ? "FREE" : `₹${order.shipping}`}</b>
            </div>

            <div className="order-line grand">
              <span>Total Paid ({order.paymentMethod === "online" ? "Online" : "Cash on Delivery"})</span>
              <b>₹{order.grandTotal}</b>
            </div>
          </div>

          {order.customer?.address && (
            <div style={{ marginTop: "20px", paddingTop: "14px", borderTop: "1px solid rgba(216, 181, 106, 0.15)" }}>
              <h4 style={{ color: "#d8b56a", fontSize: "12px", textTransform: "uppercase", marginBottom: "6px" }}>
                <FiMapPin /> Delivery Address
              </h4>
              <p style={{ color: "#c2d1c7", fontSize: "13px", margin: 0 }}>
                <strong>{order.customer.name}</strong> {order.customer.phone ? `(${order.customer.phone})` : ""}
                <br />
                {order.customer.address}, {order.customer.city}, {order.customer.state} - {order.customer.pincode}
              </p>
            </div>
          )}
        </div>

        {/* Invoice Modal */}
        {showInvoice && (
          <InvoiceModal
            order={order}
            onClose={() => setShowInvoice(false)}
          />
        )}

        {/* Return Request Modal */}
        {showReturnModal && (
          <ReturnRequestModal
            order={order}
            onClose={() => setShowReturnModal(false)}
            onSuccess={() => {
              // Could refresh order status
            }}
          />
        )}
      </div>
    </UserShell>
  );
}

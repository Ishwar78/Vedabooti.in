import React, { useState, useEffect } from "react";
import AdminShell from "../../components/AdminShell";
import {
  FiShoppingBag,
  FiSearch,
  FiEye,
  FiX,
  FiRefreshCw,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiPhone,
  FiMail,
  FiTag
} from "react-icons/fi";
import api from "../../lib/api";
import "./AdminOrders.css";

const STATUS_OPTIONS = ["Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/orders");
      if (res?.success && Array.isArray(res.orders)) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await api.patch(`/api/orders/${orderId}/status`, { status: newStatus });
      if (res?.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      alert(err.message || "Failed to update order status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const term = search.toLowerCase();
    const matchSearch =
      (order.orderId && order.orderId.toLowerCase().includes(term)) ||
      (order.customer?.name && order.customer.name.toLowerCase().includes(term)) ||
      (order.customer?.email && order.customer.email.toLowerCase().includes(term)) ||
      (order.customer?.phone && order.customer.phone.toLowerCase().includes(term));

    const matchStatus = statusFilter === "All" || order.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "status-delivered";
      case "Shipped":
        return "status-shipped";
      case "Processing":
        return "status-processing";
      case "Cancelled":
        return "status-cancelled";
      default:
        return "status-confirmed";
    }
  };

  return (
    <AdminShell>
      <div className="admin-orders-page">
        {/* Head */}
        <div className="crud-head">
          <div>
            <span className="eyebrow">Sales & Logistics</span>
            <h1>Customer Orders</h1>
            <p>Monitor real-time incoming orders, track delivery stages, and update statuses.</p>
          </div>
          <button type="button" className="btn" onClick={fetchOrders} title="Refresh orders">
            <FiRefreshCw className={loading ? "spin" : ""} /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="orders-summary-strip">
          <div className="order-summary-card">
            <span>Total Orders</span>
            <strong>{orders.length}</strong>
          </div>
          <div className="order-summary-card">
            <span>Confirmed</span>
            <strong style={{ color: "#60a5fa" }}>
              {orders.filter((o) => o.status === "Confirmed").length}
            </strong>
          </div>
          <div className="order-summary-card">
            <span>In Transit</span>
            <strong style={{ color: "#fbbf24" }}>
              {orders.filter((o) => o.status === "Processing" || o.status === "Shipped").length}
            </strong>
          </div>
          <div className="order-summary-card">
            <span>Delivered</span>
            <strong style={{ color: "#4ade80" }}>
              {orders.filter((o) => o.status === "Delivered").length}
            </strong>
          </div>
        </div>

        {/* Toolbar */}
        <div className="crud-toolbar">
          <div className="search-wrap">
            <FiSearch />
            <input
              className="input"
              placeholder="Search by Order ID, customer name, phone, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="crud-table orders-table">
          <div className="table-row table-head">
            <span>Order ID</span>
            <span>Customer</span>
            <span>Items</span>
            <span>Total</span>
            <span>Status</span>
            <span>Date</span>
            <span>Action</span>
          </div>

          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#8da497" }}>
              <FiRefreshCw className="spin" size={26} />
              <p style={{ marginTop: "8px" }}>Loading orders from database...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#8da497" }}>
              <FiShoppingBag size={34} style={{ opacity: 0.5, marginBottom: "8px" }} />
              <p>No customer orders match your search.</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div className="table-row" key={order._id}>
                <span>
                  <strong className="order-id-badge">{order.orderId}</strong>
                  {order.coupon && (
                    <span className="order-coupon-pill" title={`Coupon: ${order.coupon}`}>
                      <FiTag /> {order.coupon}
                    </span>
                  )}
                </span>

                <span>
                  <b style={{ color: "#fff", display: "block" }}>
                    {order.customer?.name || "Customer"}
                  </b>
                  <small style={{ color: "#829589", fontSize: "11px" }}>
                    {order.customer?.phone || order.customer?.email}
                  </small>
                </span>

                <span style={{ color: "#a5b6ac", fontSize: "12px" }}>
                  {order.items && order.items.length > 0
                    ? `${order.items.length} item(s): ${order.items[0]?.name || "Item"} ${
                        order.items.length > 1 ? `+${order.items.length - 1} more` : ""
                      }`
                    : "No items"}
                </span>

                <span>
                  <strong style={{ color: "#d8b56a", fontSize: "14px" }}>
                    ₹{order.grandTotal}
                  </strong>
                  <small style={{ display: "block", color: "#6a8174", fontSize: "10.5px" }}>
                    {order.paymentMethod === "cod" ? "COD" : "Online"}
                  </small>
                </span>

                <span>
                  <select
                    className={`status-select ${getStatusClass(order.status)}`}
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                    disabled={updatingStatus}
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </span>

                <span style={{ color: "#829589", fontSize: "11px" }}>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "Recent"}
                </span>

                <div className="row-actions">
                  <button
                    type="button"
                    title="View Full Details"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <FiEye /> View
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="product-modal-backdrop" onClick={() => setSelectedOrder(null)}>
            <div
              className="order-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="product-modal-header">
                <div>
                  <span className="modal-eyebrow">ORDER DETAILS</span>
                  <h2>{selectedOrder.orderId}</h2>
                  <p>
                    Placed on{" "}
                    {selectedOrder.createdAt
                      ? new Date(selectedOrder.createdAt).toLocaleString("en-IN")
                      : "Recent"}
                  </p>
                </div>
                <button
                  type="button"
                  className="modal-close"
                  onClick={() => setSelectedOrder(null)}
                >
                  <FiX />
                </button>
              </div>

              <div className="order-modal-body">
                {/* Status bar */}
                <div className="order-modal-status-bar">
                  <span>Current Status:</span>
                  <select
                    className={`status-select ${getStatusClass(selectedOrder.status)}`}
                    value={selectedOrder.status}
                    onChange={(e) =>
                      handleUpdateStatus(selectedOrder._id, e.target.value)
                    }
                    disabled={updatingStatus}
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Customer & Shipping Details */}
                <div className="order-modal-grid">
                  <div className="order-detail-card">
                    <h4>Customer Information</h4>
                    <p>
                      <strong>{selectedOrder.customer?.name || "Customer"}</strong>
                    </p>
                    {selectedOrder.customer?.phone && (
                      <p className="detail-meta">
                        <FiPhone /> {selectedOrder.customer.phone}
                      </p>
                    )}
                    {selectedOrder.customer?.email && (
                      <p className="detail-meta">
                        <FiMail /> {selectedOrder.customer.email}
                      </p>
                    )}
                  </div>

                  <div className="order-detail-card">
                    <h4>Delivery Address</h4>
                    <p className="detail-meta">
                      <FiMapPin style={{ flexShrink: 0, marginTop: "3px" }} />
                      <span>
                        {selectedOrder.customer?.address || "Address not provided"}
                        {selectedOrder.customer?.city ? `, ${selectedOrder.customer.city}` : ""}
                        {selectedOrder.customer?.state ? `, ${selectedOrder.customer.state}` : ""}
                        {selectedOrder.customer?.pincode ? ` - ${selectedOrder.customer.pincode}` : ""}
                      </span>
                    </p>
                    <p style={{ marginTop: "6px", fontSize: "12px", color: "#8da497" }}>
                      Payment: <b>{selectedOrder.paymentMethod === "online" ? "Online Pre-paid" : "Cash on Delivery"}</b>
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="order-items-box">
                  <h4>Ordered Products ({selectedOrder.items?.length || 0})</h4>
                  <div className="order-modal-items">
                    {(selectedOrder.items || []).map((it, idx) => (
                      <div className="order-modal-item" key={idx}>
                        <img
                          src={it.image || "/assets/product1.jpeg"}
                          alt={it.name}
                        />
                        <div className="item-name-qty">
                          <strong>{it.name}</strong>
                          <small>Quantity: {it.qty || 1}</small>
                        </div>
                        <div className="item-line-price">
                          ₹{(Number(it.price) || 0) * (it.qty || 1)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financials */}
                <div className="order-modal-bill">
                  <div className="bill-line">
                    <span>Subtotal</span>
                    <span>₹{selectedOrder.subtotal || 0}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="bill-line discount-line">
                      <span>Discount {selectedOrder.coupon ? `(${selectedOrder.coupon})` : ""}</span>
                      <span>-₹{selectedOrder.discount}</span>
                    </div>
                  )}
                  <div className="bill-line">
                    <span>Shipping</span>
                    <span>{selectedOrder.shipping === 0 ? "FREE" : `₹${selectedOrder.shipping}`}</span>
                  </div>
                  <hr style={{ borderColor: "#183b2a", margin: "8px 0" }} />
                  <div className="bill-line total-line">
                    <strong>Total Paid / Payable</strong>
                    <strong style={{ color: "#d8b56a", fontSize: "16px" }}>
                      ₹{selectedOrder.grandTotal}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
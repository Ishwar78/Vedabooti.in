import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import UserShell from "../../components/UserShell";
import {
  FiLifeBuoy,
  FiSend,
  FiCheckCircle,
  FiClock,
  FiPhone,
  FiMail,
  FiMessageCircle,
  FiPackage,
  FiRefreshCw,
  FiAlertCircle,
  FiFileText,
  FiCornerDownRight,
} from "react-icons/fi";
import api from "../../lib/api";
import "./Support.css";

const CATEGORIES = [
  "Order Status",
  "Return & Exchange",
  "Product Query",
  "Payment & Refund",
  "General Support",
];

export default function Support() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("new"); // "new" | "history"

  // User details
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Recent orders list to help pick orderId
  const [userOrders, setUserOrders] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    orderId: location.state?.orderId || "",
    category: "General Support",
    subject: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Tickets history
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  // Sync user profile & fetch user orders
  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("userToken");
    if (!token) return;

    api
      .get("/api/auth/me")
      .then((res) => {
        if (res?.success && res.user) {
          setUser(res.user);
          setFormData((prev) => ({
            ...prev,
            name: prev.name || res.user.name || "",
            email: prev.email || res.user.email || "",
            phone: prev.phone || res.user.phone || "",
          }));
        }
      })
      .catch(() => {});

    // Fetch user orders for easy selection
    api
      .get("/api/orders/my-orders")
      .then((res) => {
        if (res?.success && Array.isArray(res.orders)) {
          setUserOrders(res.orders);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch tickets for history tab
  const fetchMyTickets = async () => {
    setLoadingTickets(true);
    try {
      const res = await api.get("/api/support/my-tickets");
      if (res?.success && Array.isArray(res.tickets)) {
        setTickets(res.tickets);
      }
    } catch (err) {
      console.warn("Could not fetch user tickets:", err.message);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.subject.trim() || !formData.message.trim()) {
      setErrorMessage("Please enter a subject and detailed message.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/api/support", formData);
      if (res?.success) {
        setCreatedTicket(res.ticket);
        setFormData({
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
          orderId: "",
          category: "General Support",
          subject: "",
          message: "",
        });
        // Refresh ticket list
        fetchMyTickets();
      } else {
        setErrorMessage(res?.message || "Failed to submit request.");
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to submit support request.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Resolved":
        return "badge-resolved";
      case "In Progress":
        return "badge-in-progress";
      case "Closed":
        return "badge-closed";
      default:
        return "badge-open";
    }
  };

  return (
    <UserShell>
      <div className="user-support-page">
        {/* Header */}
        <div className="support-dashboard-head">
          <div className="head-text">
            <span className="eyebrow">
              <FiLifeBuoy /> Help & Support Desk
            </span>
            <h1>Customer Support & Inquiries</h1>
            <p>
              Submit an inquiry regarding your orders, product consultations, returns,
              or tracking. Our dedicated herbal care team is here to assist you.
            </p>
          </div>

          <div className="support-quick-info">
            <div className="quick-pill">
              <FiPhone />
              <div>
                <small>Helpline (Mon - Sat)</small>
                <strong>+91 99999 99999</strong>
              </div>
            </div>
            <div className="quick-pill">
              <FiMail />
              <div>
                <small>Direct Email</small>
                <strong>support@vedabooti.com</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="support-tab-nav">
          <button
            type="button"
            className={`tab-btn ${activeTab === "new" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("new");
              setCreatedTicket(null);
            }}
          >
            <FiSend />
            <span>Raise New Request</span>
          </button>

          <button
            type="button"
            className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("history");
              fetchMyTickets();
            }}
          >
            <FiFileText />
            <span>My Support Tickets</span>
            {tickets.length > 0 && <span className="tab-counter">{tickets.length}</span>}
          </button>
        </div>

        {/* ================= TAB 1: RAISE REQUEST ================= */}
        {activeTab === "new" && (
          <div className="support-form-card">
            {createdTicket ? (
              <div className="ticket-success-box">
                <FiCheckCircle className="success-icon" />
                <h3>Request Submitted Successfully!</h3>
                <p>
                  Your support ticket has been created with ID{" "}
                  <strong className="ticket-id-tag">#{createdTicket.ticketId}</strong>.
                  Our team has been notified and will review your inquiry shortly.
                </p>
                <div className="success-actions">
                  <button
                    type="button"
                    className="btn-action primary"
                    onClick={() => setActiveTab("history")}
                  >
                    View Ticket in History
                  </button>
                  <button
                    type="button"
                    className="btn-action secondary"
                    onClick={() => setCreatedTicket(null)}
                  >
                    Submit Another Query
                  </button>
                </div>
              </div>
            ) : (
              <form className="support-ticket-form" onSubmit={handleSubmit}>
                <div className="form-intro">
                  <h3>Submit a Support Ticket</h3>
                  <p>Please provide details so we can resolve your query as quickly as possible.</p>
                </div>

                {errorMessage && (
                  <div className="support-error-banner">
                    <FiAlertCircle />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                    />
                  </div>

                  <div className="form-group">
                    <label>Query Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Related Order ID (Optional)</label>
                  {userOrders.length > 0 ? (
                    <div className="order-select-wrap">
                      <select
                        name="orderId"
                        value={formData.orderId}
                        onChange={handleChange}
                      >
                        <option value="">-- Select Related Order (if applicable) --</option>
                        {userOrders.map((ord) => (
                          <option key={ord.orderId || ord._id} value={ord.orderId}>
                            {ord.orderId} (₹{ord.grandTotal} - {ord.status})
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <input
                      type="text"
                      name="orderId"
                      value={formData.orderId}
                      onChange={handleChange}
                      placeholder="e.g. VB-562832"
                    />
                  )}
                  <small className="help-text">
                    Select or enter the Order ID if this query is about a specific purchase.
                  </small>
                </div>

                <div className="form-group">
                  <label>Subject / Issue Summary *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Brief summary of your query or issue"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Detailed Message *</label>
                  <textarea
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Please explain your question or problem in detail..."
                    required
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="submit-ticket-btn"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <FiRefreshCw className="spin" /> Submitting Request...
                      </>
                    ) : (
                      <>
                        <FiSend /> Submit Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ================= TAB 2: MY TICKETS ================= */}
        {activeTab === "history" && (
          <div className="support-history-container">
            <div className="history-topbar">
              <div>
                <h3>Your Support Inquiries</h3>
                <p>Track the real-time status and replies on your past requests.</p>
              </div>
              <button
                type="button"
                className="refresh-history-btn"
                onClick={fetchMyTickets}
                title="Refresh Tickets"
              >
                <FiRefreshCw className={loadingTickets ? "spin" : ""} /> Refresh
              </button>
            </div>

            {loadingTickets ? (
              <div className="support-loading-card">
                <FiRefreshCw className="spin" />
                <p>Loading your support tickets...</p>
              </div>
            ) : tickets.length === 0 ? (
              <div className="no-tickets-box">
                <FiLifeBuoy className="empty-icon" />
                <h3>No Support Tickets Found</h3>
                <p>You haven't submitted any support requests yet.</p>
                <button
                  type="button"
                  className="btn-action primary"
                  onClick={() => setActiveTab("new")}
                >
                  <FiSend /> Raise Your First Request
                </button>
              </div>
            ) : (
              <div className="tickets-list">
                {tickets.map((t) => (
                  <div className="ticket-card" key={t._id}>
                    <div className="ticket-card-header">
                      <div className="ticket-meta-left">
                        <span className="ticket-badge-id">#{t.ticketId}</span>
                        <span className="ticket-cat-badge">{t.category}</span>
                        {t.orderId && (
                          <span className="ticket-order-tag">
                            <FiPackage /> Order: {t.orderId}
                          </span>
                        )}
                      </div>
                      <div className="ticket-meta-right">
                        <span className={`status-pill ${getStatusBadgeClass(t.status)}`}>
                          {t.status}
                        </span>
                        <span className="ticket-date">
                          <FiClock />{" "}
                          {t.createdAt
                            ? new Date(t.createdAt).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "Recent"}
                        </span>
                      </div>
                    </div>

                    <div className="ticket-card-body">
                      <h4 className="ticket-subject">{t.subject}</h4>
                      <p className="ticket-message">{t.message}</p>

                      {/* Admin response if available */}
                      {t.adminReply && (
                        <div className="admin-reply-box">
                          <div className="reply-head">
                            <FiCornerDownRight />
                            <strong>Official Response from Veda Booti Support:</strong>
                          </div>
                          <p className="reply-text">{t.adminReply}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </UserShell>
  );
}
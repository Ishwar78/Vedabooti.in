import React, { useState, useEffect } from "react";
import AdminShell from "../../components/AdminShell";
import {
  FiLifeBuoy,
  FiSearch,
  FiRefreshCw,
  FiEye,
  FiTrash2,
  FiCheckCircle,
  FiClock,
  FiUser,
  FiMail,
  FiPhone,
  FiPackage,
  FiX,
  FiSend,
  FiCornerDownRight,
  FiAlertCircle,
} from "react-icons/fi";
import api from "../../lib/api";
import "./AdminSupport.css";

const STATUS_OPTIONS = ["Open", "In Progress", "Resolved", "Closed"];
const CATEGORY_OPTIONS = [
  "All Categories",
  "Order Status",
  "Return & Exchange",
  "Product Query",
  "Payment & Refund",
  "General Support",
];

export default function AdminSupport() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  // Selected ticket for modal
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [modalReply, setModalReply] = useState("");
  const [modalStatus, setModalStatus] = useState("Open");

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/support");
      if (res?.success && Array.isArray(res.tickets)) {
        setTickets(res.tickets);
      }
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Update status directly
  const handleUpdateStatus = async (ticketId, newStatus) => {
    setUpdating(true);
    try {
      const res = await api.patch(`/api/support/${ticketId}/status`, { status: newStatus });
      if (res?.success) {
        setTickets((prev) =>
          prev.map((t) => (t._id === ticketId ? { ...t, status: newStatus } : t))
        );
        if (selectedTicket && selectedTicket._id === ticketId) {
          setSelectedTicket((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      alert(err.message || "Failed to update ticket status.");
    } finally {
      setUpdating(false);
    }
  };

  // Open modal and prefill reply
  const openModal = (ticket) => {
    setSelectedTicket(ticket);
    setModalReply(ticket.adminReply || "");
    setModalStatus(ticket.status || "Open");
  };

  // Save reply & status inside modal
  const handleSaveModal = async (e) => {
    e.preventDefault();
    if (!selectedTicket) return;

    setUpdating(true);
    try {
      const res = await api.patch(`/api/support/${selectedTicket._id}/status`, {
        status: modalStatus,
        adminReply: modalReply,
      });

      if (res?.success) {
        setTickets((prev) =>
          prev.map((t) =>
            t._id === selectedTicket._id
              ? { ...t, status: modalStatus, adminReply: modalReply }
              : t
          )
        );
        setSelectedTicket((prev) => ({
          ...prev,
          status: modalStatus,
          adminReply: modalReply,
        }));
        alert("Ticket updated and response saved successfully!");
      }
    } catch (err) {
      alert(err.message || "Failed to save response.");
    } finally {
      setUpdating(false);
    }
  };

  // Delete ticket
  const handleDeleteTicket = async (ticketId, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this support ticket?")) return;

    try {
      const res = await api.delete(`/api/support/${ticketId}`);
      if (res?.success) {
        setTickets((prev) => prev.filter((t) => t._id !== ticketId));
        if (selectedTicket && selectedTicket._id === ticketId) {
          setSelectedTicket(null);
        }
      }
    } catch (err) {
      alert(err.message || "Failed to delete ticket.");
    }
  };

  // Filtered tickets
  const filteredTickets = tickets.filter((t) => {
    const term = search.toLowerCase();
    const matchSearch =
      (t.ticketId && t.ticketId.toLowerCase().includes(term)) ||
      (t.name && t.name.toLowerCase().includes(term)) ||
      (t.email && t.email.toLowerCase().includes(term)) ||
      (t.orderId && t.orderId.toLowerCase().includes(term)) ||
      (t.subject && t.subject.toLowerCase().includes(term));

    const matchStatus = statusFilter === "All" || t.status === statusFilter;
    const matchCategory =
      categoryFilter === "All Categories" || t.category === categoryFilter;

    return matchSearch && matchStatus && matchCategory;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case "Resolved":
        return "status-resolved";
      case "In Progress":
        return "status-inprogress";
      case "Closed":
        return "status-closed";
      default:
        return "status-open";
    }
  };

  return (
    <AdminShell>
      <div className="admin-support-page">
        {/* Head */}
        <div className="crud-head">
          <div>
            <span className="eyebrow">Customer Care & Support</span>
            <h1>Help & Support Inquiries</h1>
            <p>
              Manage real-time customer tickets, answer queries, track order issues, and resolve complaints.
            </p>
          </div>
          <button
            type="button"
            className="btn"
            onClick={fetchTickets}
            title="Refresh tickets"
          >
            <FiRefreshCw className={loading ? "spin" : ""} /> Refresh
          </button>
        </div>

        {/* Stats Strip */}
        <div className="support-summary-strip">
          <div className="support-summary-card">
            <span>Total Tickets</span>
            <strong>{tickets.length}</strong>
          </div>
          <div className="support-summary-card">
            <span>Open</span>
            <strong style={{ color: "#60a5fa" }}>
              {tickets.filter((t) => t.status === "Open").length}
            </strong>
          </div>
          <div className="support-summary-card">
            <span>In Progress</span>
            <strong style={{ color: "#fbbf24" }}>
              {tickets.filter((t) => t.status === "In Progress").length}
            </strong>
          </div>
          <div className="support-summary-card">
            <span>Resolved</span>
            <strong style={{ color: "#4ade80" }}>
              {tickets.filter((t) => t.status === "Resolved").length}
            </strong>
          </div>
        </div>

        {/* Toolbar */}
        <div className="crud-toolbar">
          <div className="search-wrap">
            <FiSearch />
            <input
              className="input"
              placeholder="Search by Ticket ID, customer name, email, order ID, or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filters-wrap">
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

            <select
              className="select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="crud-table support-table">
          <div className="table-row table-head">
            <span>Ticket</span>
            <span>Customer</span>
            <span>Category & Order</span>
            <span>Subject & Query</span>
            <span>Status</span>
            <span>Date</span>
            <span style={{ textAlign: "right" }}>Actions</span>
          </div>

          {loading ? (
            <div className="table-empty">
              <FiRefreshCw className="spin" /> Loading customer tickets...
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="table-empty">
              <FiLifeBuoy style={{ fontSize: "28px", marginBottom: "8px", opacity: 0.5 }} />
              <p>No support tickets match your search or filter.</p>
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <div
                className="table-row"
                key={ticket._id}
                onClick={() => openModal(ticket)}
                style={{ cursor: "pointer" }}
              >
                <span>
                  <strong className="ticket-id-tag">#{ticket.ticketId}</strong>
                </span>

                <span>
                  <b style={{ color: "#ffffff", display: "block" }}>
                    {ticket.name || "Customer"}
                  </b>
                  <small style={{ color: "#829589", fontSize: "11px" }}>
                    {ticket.email}
                  </small>
                </span>

                <span>
                  <span className="cat-pill">{ticket.category}</span>
                  {ticket.orderId && (
                    <small className="order-pill">
                      <FiPackage /> {ticket.orderId}
                    </small>
                  )}
                </span>

                <span>
                  <strong style={{ color: "#e2ece6", display: "block", fontSize: "13px" }}>
                    {ticket.subject}
                  </strong>
                  <small className="query-snippet">
                    {ticket.message.length > 55
                      ? `${ticket.message.slice(0, 55)}...`
                      : ticket.message}
                  </small>
                </span>

                <span onClick={(e) => e.stopPropagation()}>
                  <select
                    className={`status-select ${getStatusClass(ticket.status)}`}
                    value={ticket.status}
                    onChange={(e) => handleUpdateStatus(ticket._id, e.target.value)}
                    disabled={updating}
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </span>

                <span style={{ color: "#829589", fontSize: "11px" }}>
                  {ticket.createdAt
                    ? new Date(ticket.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "Recent"}
                </span>

                <div className="row-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    title="View & Reply"
                    onClick={() => openModal(ticket)}
                  >
                    <FiEye />
                  </button>
                  <button
                    type="button"
                    className="danger"
                    title="Delete Ticket"
                    onClick={(e) => handleDeleteTicket(ticket._id, e)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal: View details & Reply */}
        {selectedTicket && (
          <div className="order-modal-backdrop" onClick={() => setSelectedTicket(null)}>
            <div
              className="order-modal-card support-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="order-modal-head">
                <div>
                  <span className="order-modal-kicker">
                    Support Ticket Details
                  </span>
                  <h3>Ticket #{selectedTicket.ticketId}</h3>
                  <small style={{ color: "#799083" }}>
                    Submitted on{" "}
                    {selectedTicket.createdAt
                      ? new Date(selectedTicket.createdAt).toLocaleString("en-IN")
                      : "Recent"}
                  </small>
                </div>
                <button
                  type="button"
                  className="modal-close"
                  onClick={() => setSelectedTicket(null)}
                >
                  <FiX />
                </button>
              </div>

              <div className="order-modal-body">
                {/* Status Bar */}
                <div className="ticket-modal-status-bar">
                  <span>Current Ticket Status:</span>
                  <select
                    className={`status-select ${getStatusClass(modalStatus)}`}
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value)}
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Details Grid */}
                <div className="support-modal-grid">
                  <div className="order-detail-card">
                    <h4>Customer Information</h4>
                    <p>
                      <strong>{selectedTicket.name}</strong>
                    </p>
                    <p className="detail-meta">
                      <FiMail /> {selectedTicket.email}
                    </p>
                    {selectedTicket.phone && (
                      <p className="detail-meta">
                        <FiPhone /> {selectedTicket.phone}
                      </p>
                    )}
                  </div>

                  <div className="order-detail-card">
                    <h4>Query Information</h4>
                    <p className="detail-meta">
                      <b>Category:</b> {selectedTicket.category}
                    </p>
                    {selectedTicket.orderId && (
                      <p className="detail-meta">
                        <FiPackage /> <b>Related Order:</b> {selectedTicket.orderId}
                      </p>
                    )}
                  </div>
                </div>

                {/* Message Box */}
                <div className="ticket-msg-box">
                  <h4>Subject: {selectedTicket.subject}</h4>
                  <div className="ticket-full-message">
                    {selectedTicket.message}
                  </div>
                </div>

                {/* Reply Form */}
                <form className="admin-reply-form" onSubmit={handleSaveModal}>
                  <h4>
                    <FiCornerDownRight /> Admin Response / Resolution Note
                  </h4>
                  <p>
                    This response will be visible to the customer when they view this ticket
                    in their dashboard.
                  </p>
                  <textarea
                    rows="4"
                    value={modalReply}
                    onChange={(e) => setModalReply(e.target.value)}
                    placeholder="Type your response to the customer here..."
                  />

                  <div className="modal-actions">
                    <button
                      type="submit"
                      className="btn-save-reply"
                      disabled={updating}
                    >
                      {updating ? (
                        <>
                          <FiRefreshCw className="spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <FiSend /> Save Status & Response
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
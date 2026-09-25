import React, { useState, useEffect } from "react";
import {
  FiRotateCcw,
  FiSearch,
  FiEye,
  FiCheck,
  FiX,
  FiDollarSign,
  FiRefreshCw,
  FiCopy,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiChevronRight,
  FiCreditCard,
  FiSmartphone,
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiPackage,
} from "react-icons/fi";
import AdminShell from "../../components/AdminShell";
import api from "../../lib/api";
import "./AdminReturnRequests.css";

export default function AdminReturnRequests() {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    refunded: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/returns");
      if (res?.success) {
        setRequests(res.requests || res.returns || []);
        if (res.stats) {
          setStats(res.stats);
        }
      }
    } catch (err) {
      console.error("Error fetching return requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setUpdating(true);
      const res = await api.patch(`/api/returns/${id}/status`, {
        status: newStatus,
        adminNotes: adminNotes || undefined,
      });
      if (res?.success) {
        // Update local state
        setRequests((prev) =>
          prev.map((r) => (r._id === id ? res.returnRequest : r))
        );
        if (selectedRequest && selectedRequest._id === id) {
          setSelectedRequest(res.returnRequest);
        }
        // Recalculate stats
        fetchRequests();
      }
    } catch (err) {
      alert("Failed to update status: " + (err.response?.data?.message || err.message));
    } finally {
      setUpdating(false);
    }
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const filteredData = requests.filter((item) => {
    const matchesFilter = filter === "All" || item.status === filter;
    if (!matchesFilter) return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.requestId?.toLowerCase().includes(q) ||
      item.orderId?.toLowerCase().includes(q) ||
      item.customer?.name?.toLowerCase().includes(q) ||
      item.customer?.email?.toLowerCase().includes(q) ||
      item.customer?.phone?.includes(q) ||
      item.refundDetails?.upiId?.toLowerCase().includes(q) ||
      item.refundDetails?.accountNumber?.includes(q)
    );
  });

  return (
    <AdminShell>
      <div className="admin-page returns-admin-page">
        {/* Header */}
        <div className="admin-page-head">
          <div>
            <span className="admin-kicker">ORDER MANAGEMENT</span>
            <h1>Return & Refund Requests</h1>
            <p>Review customer returns, verify UPI / Bank details, and process refunds.</p>
          </div>
          <button
            type="button"
            className="refresh-btn"
            onClick={fetchRequests}
            title="Refresh List"
          >
            <FiRefreshCw className={loading ? "spin" : ""} /> Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="return-stats-grid">
          <div
            className={`stat-card ${filter === "All" ? "active" : ""}`}
            onClick={() => setFilter("All")}
          >
            <div className="stat-card-icon icon-total">
              <FiRotateCcw />
            </div>
            <div className="stat-card-content">
              <strong>{stats.total}</strong>
              <span>Total Requests</span>
            </div>
          </div>

          <div
            className={`stat-card ${filter === "Pending" ? "active" : ""}`}
            onClick={() => setFilter("Pending")}
          >
            <div className="stat-card-icon icon-pending">
              <FiClock />
            </div>
            <div className="stat-card-content">
              <strong>{stats.pending}</strong>
              <span>Pending Review</span>
            </div>
          </div>

          <div
            className={`stat-card ${filter === "Approved" ? "active" : ""}`}
            onClick={() => setFilter("Approved")}
          >
            <div className="stat-card-icon icon-approved">
              <FiCheckCircle />
            </div>
            <div className="stat-card-content">
              <strong>{stats.approved}</strong>
              <span>Approved</span>
            </div>
          </div>

          <div
            className={`stat-card ${filter === "Refunded" ? "active" : ""}`}
            onClick={() => setFilter("Refunded")}
          >
            <div className="stat-card-icon icon-refunded">
              <FiDollarSign />
            </div>
            <div className="stat-card-content">
              <strong>{stats.refunded}</strong>
              <span>Refund Completed</span>
            </div>
          </div>

          <div
            className={`stat-card ${filter === "Rejected" ? "active" : ""}`}
            onClick={() => setFilter("Rejected")}
          >
            <div className="stat-card-icon icon-rejected">
              <FiAlertCircle />
            </div>
            <div className="stat-card-content">
              <strong>{stats.rejected}</strong>
              <span>Rejected</span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="admin-toolbar">
          <div className="admin-search">
            <FiSearch />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Request ID, Order ID, Customer, Phone, UPI ID..."
            />
          </div>
          <div className="filter-buttons">
            {["All", "Pending", "Approved", "Refunded", "Rejected"].map((tab) => (
              <button
                key={tab}
                className={filter === tab ? "active" : ""}
                onClick={() => setFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="admin-table-wrap">
          {loading ? (
            <div className="table-loading">
              <FiRefreshCw className="spin" size={26} />
              <p>Loading return requests...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="table-empty">
              <FiPackage size={42} style={{ opacity: 0.5, color: "#d8b56a" }} />
              <h3>No Return Requests Found</h3>
              <p>
                {filter !== "All"
                  ? `There are currently no return requests with status "${filter}".`
                  : "No return requests have been submitted by customers yet."}
              </p>
            </div>
          ) : (
            <table className="admin-table returns-table">
              <thead>
                <tr>
                  <th>Request / Order</th>
                  <th>Customer Info</th>
                  <th>Products</th>
                  <th>Amount</th>
                  <th>Refund Method</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((req) => {
                  const dateStr = req.createdAt
                    ? new Date(req.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "Recent";

                  return (
                    <tr key={req._id}>
                      <td>
                        <div className="req-cell">
                          <strong className="req-id">{req.requestId}</strong>
                          <span className="order-id-sub">Order #{req.orderId}</span>
                        </div>
                      </td>
                      <td>
                        <div className="cust-cell">
                          <span className="cust-name">{req.customer?.name || "Customer"}</span>
                          <span className="cust-phone">{req.customer?.phone || req.customer?.email}</span>
                        </div>
                      </td>
                      <td>
                        <div className="items-summary-cell" title={req.returnReason}>
                          <span className="items-count">
                            {req.items?.length || 1} Item(s)
                          </span>
                          <span className="reason-tag">{req.returnReason}</span>
                        </div>
                      </td>
                      <td>
                        <strong className="refund-amount-cell">₹{req.refundAmount || 0}</strong>
                      </td>
                      <td>
                        {req.refundMethod === "upi" ? (
                          <div className="method-pill upi" title={req.refundDetails?.upiId}>
                            <FiSmartphone size={13} />
                            <span>UPI: {req.refundDetails?.upiId || "N/A"}</span>
                          </div>
                        ) : (
                          <div
                            className="method-pill bank"
                            title={`${req.refundDetails?.bankName} - ${req.refundDetails?.accountNumber}`}
                          >
                            <FiCreditCard size={13} />
                            <span>
                              {req.refundDetails?.bankName
                                ? `${req.refundDetails?.bankName} (A/C ...${(req.refundDetails?.accountNumber || "").slice(-4)})`
                                : "Bank Transfer"}
                            </span>
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="date-cell">{dateStr}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${req.status.toLowerCase()}`}>
                          {req.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="btn-view"
                            title="View Full Details & Bank / UPI Info"
                            onClick={() => {
                              setSelectedRequest(req);
                              setAdminNotes(req.adminNotes || "");
                            }}
                          >
                            <FiEye /> View
                          </button>
                          {req.status === "Pending" && (
                            <>
                              <button
                                type="button"
                                className="btn-approve"
                                title="Approve Return Request"
                                onClick={() => handleStatusUpdate(req._id, "Approved")}
                              >
                                <FiCheck />
                              </button>
                              <button
                                type="button"
                                className="btn-danger"
                                title="Reject Request"
                                onClick={() => handleStatusUpdate(req._id, "Rejected")}
                              >
                                <FiX />
                              </button>
                            </>
                          )}
                          {req.status === "Approved" && (
                            <button
                              type="button"
                              className="btn-refund"
                              title="Mark Refund as Completed"
                              onClick={() => handleStatusUpdate(req._id, "Refunded")}
                            >
                              <FiDollarSign /> Refund
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal: Full Return Request Details */}
        {selectedRequest && (
          <div className="admin-modal-overlay" onClick={() => setSelectedRequest(null)}>
            <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <div>
                  <div className="modal-eyebrow">RETURN REQUEST DETAILS</div>
                  <h2>{selectedRequest.requestId}</h2>
                  <span className="modal-sub">Linked to Order #{selectedRequest.orderId}</span>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setSelectedRequest(null)}
                >
                  <FiX />
                </button>
              </div>

              <div className="admin-modal-body">
                {/* Status Bar */}
                <div className="modal-status-banner">
                  <div className="status-label-group">
                    <span>Current Status:</span>
                    <span className={`status-badge ${selectedRequest.status.toLowerCase()}`}>
                      {selectedRequest.status}
                    </span>
                  </div>
                  <div className="status-amount-group">
                    <span>Refund Amount:</span>
                    <strong>₹{selectedRequest.refundAmount}</strong>
                  </div>
                </div>

                {/* Refund Method Section (UPI / Bank) - CRITICAL USER REQUIREMENT */}
                <div className="refund-method-card">
                  <div className="refund-method-header">
                    <h4>
                      {selectedRequest.refundMethod === "upi" ? (
                        <>
                          <FiSmartphone /> Customer UPI Refund Details
                        </>
                      ) : (
                        <>
                          <FiCreditCard /> Customer Bank Account Details
                        </>
                      )}
                    </h4>
                    <span className="method-type-tag">
                      {selectedRequest.refundMethod === "upi" ? "Instant UPI Transfer" : "NEFT / IMPS Bank Transfer"}
                    </span>
                  </div>

                  {selectedRequest.refundMethod === "upi" ? (
                    <div className="payout-upi-box">
                      <div className="payout-field-group">
                        <label>UPI ID (VPA):</label>
                        <div className="copyable-field">
                          <code>{selectedRequest.refundDetails?.upiId || "Not provided"}</code>
                          {selectedRequest.refundDetails?.upiId && (
                            <button
                              type="button"
                              className="copy-btn"
                              onClick={() =>
                                copyToClipboard(selectedRequest.refundDetails?.upiId, "upiId")
                              }
                            >
                              {copiedField === "upiId" ? <FiCheck /> : <FiCopy />}
                              {copiedField === "upiId" ? "Copied" : "Copy UPI"}
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="payout-note">
                        Send refund of <strong>₹{selectedRequest.refundAmount}</strong> directly to this UPI ID via Google Pay, PhonePe, Paytm, or BHIM.
                      </p>
                    </div>
                  ) : (
                    <div className="payout-bank-box">
                      <div className="bank-grid">
                        <div className="bank-field">
                          <label>Account Holder Name:</label>
                          <strong>{selectedRequest.refundDetails?.accountHolderName || "—"}</strong>
                        </div>
                        <div className="bank-field">
                          <label>Bank Name:</label>
                          <strong>{selectedRequest.refundDetails?.bankName || "—"}</strong>
                        </div>
                        <div className="bank-field">
                          <label>Account Number:</label>
                          <div className="copyable-field inline">
                            <code>{selectedRequest.refundDetails?.accountNumber || "—"}</code>
                            {selectedRequest.refundDetails?.accountNumber && (
                              <button
                                type="button"
                                className="copy-btn mini"
                                onClick={() =>
                                  copyToClipboard(
                                    selectedRequest.refundDetails?.accountNumber,
                                    "accNum"
                                  )
                                }
                              >
                                {copiedField === "accNum" ? <FiCheck /> : <FiCopy />}
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="bank-field">
                          <label>IFSC Code:</label>
                          <div className="copyable-field inline">
                            <code>{selectedRequest.refundDetails?.ifscCode || "—"}</code>
                            {selectedRequest.refundDetails?.ifscCode && (
                              <button
                                type="button"
                                className="copy-btn mini"
                                onClick={() =>
                                  copyToClipboard(
                                    selectedRequest.refundDetails?.ifscCode,
                                    "ifsc"
                                  )
                                }
                              >
                                {copiedField === "ifsc" ? <FiCheck /> : <FiCopy />}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Customer Details & Reason */}
                <div className="modal-info-columns">
                  <div className="modal-col">
                    <h4 className="section-title">
                      <FiUser /> Customer Information
                    </h4>
                    <div className="detail-item">
                      <span>Name:</span>
                      <strong>{selectedRequest.customer?.name}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Phone:</span>
                      <strong>{selectedRequest.customer?.phone || "—"}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Email:</span>
                      <strong>{selectedRequest.customer?.email || "—"}</strong>
                    </div>
                    {selectedRequest.customer?.address && (
                      <div className="detail-item">
                        <span>Address:</span>
                        <p style={{ margin: "2px 0 0", color: "#c1d0c6", fontSize: "13px" }}>
                          {selectedRequest.customer?.address}, {selectedRequest.customer?.city},{" "}
                          {selectedRequest.customer?.state} - {selectedRequest.customer?.pincode}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="modal-col">
                    <h4 className="section-title">
                      <FiAlertCircle /> Return Reason & Notes
                    </h4>
                    <div className="detail-item">
                      <span>Primary Reason:</span>
                      <strong style={{ color: "#d8b56a" }}>{selectedRequest.returnReason}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Customer Comments:</span>
                      <p className="cust-comment-text">
                        "{selectedRequest.comments || "No additional comments provided."}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Products in Return */}
                <div className="modal-products-section">
                  <h4 className="section-title">
                    <FiPackage /> Return Items ({selectedRequest.items?.length || 0})
                  </h4>
                  <div className="modal-products-list">
                    {selectedRequest.items?.map((it, idx) => (
                      <div key={idx} className="modal-product-item">
                        <div className="item-meta">
                          <strong>{it.name}</strong>
                          <small>Quantity: {it.qty || 1}</small>
                        </div>
                        <span className="item-subtotal">
                          ₹{(Number(it.price) || 0) * (it.qty || 1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Admin Status Actions & Notes */}
                <div className="modal-admin-actions">
                  <h4 className="section-title">Update Request Status & Admin Notes</h4>
                  <div className="admin-notes-input">
                    <label>Admin Notes / Transaction Ref (Optional):</label>
                    <textarea
                      rows={2}
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="e.g. Refund processed via UTR: 123456789 or Return pickup scheduled..."
                    />
                  </div>

                  <div className="status-button-row">
                    {selectedRequest.status !== "Approved" && selectedRequest.status !== "Refunded" && (
                      <button
                        type="button"
                        className="btn-modal-action approve"
                        disabled={updating}
                        onClick={() => handleStatusUpdate(selectedRequest._id, "Approved")}
                      >
                        <FiCheckCircle /> Approve Request
                      </button>
                    )}

                    {selectedRequest.status !== "Refunded" && (
                      <button
                        type="button"
                        className="btn-modal-action refund"
                        disabled={updating}
                        onClick={() => handleStatusUpdate(selectedRequest._id, "Refunded")}
                      >
                        <FiDollarSign /> Mark as Refund Completed
                      </button>
                    )}

                    {selectedRequest.status !== "Rejected" && selectedRequest.status !== "Refunded" && (
                      <button
                        type="button"
                        className="btn-modal-action reject"
                        disabled={updating}
                        onClick={() => handleStatusUpdate(selectedRequest._id, "Rejected")}
                      >
                        <FiX /> Reject Request
                      </button>
                    )}

                    {selectedRequest.status !== "Pending" && (
                      <button
                        type="button"
                        className="btn-modal-action pending"
                        disabled={updating}
                        onClick={() => handleStatusUpdate(selectedRequest._id, "Pending")}
                      >
                        <FiClock /> Reset to Pending
                      </button>
                    )}
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
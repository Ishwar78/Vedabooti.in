import React, { useState, useEffect } from "react";
import {
  FiStar,
  FiSearch,
  FiEye,
  FiTrash2,
  FiCheck,
  FiX,
  FiRefreshCw,
  FiUser,
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import AdminShell from "../../components/AdminShell";
import api, { getProductImageUrl } from "../../lib/api";
import "./AdminReviews.css";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    averageRating: "5.0",
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (statusFilter !== "All") queryParams.append("status", statusFilter);
      if (search.trim()) queryParams.append("search", search.trim());

      const res = await api.get(`/api/reviews/admin?${queryParams.toString()}`);
      if (res?.success) {
        setReviews(res.reviews || []);
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      console.error("Failed to fetch admin reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReviews();
  };

  const handleUpdateStatus = async (reviewId, newStatus, e) => {
    if (e) e.stopPropagation();
    setUpdatingId(reviewId);
    try {
      const res = await api.patch(`/api/reviews/${reviewId}/status`, { status: newStatus });
      if (res?.success) {
        setReviews((prev) =>
          prev.map((r) => (r._id === reviewId ? { ...r, status: newStatus } : r))
        );
        if (selectedReview && selectedReview._id === reviewId) {
          setSelectedReview((prev) => ({ ...prev, status: newStatus }));
        }
        // Update stats
        fetchReviews();
      }
    } catch (err) {
      alert(err.message || "Failed to update review status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (reviewId, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm("Are you sure you want to permanently delete this review?")) return;

    try {
      const res = await api.delete(`/api/reviews/${reviewId}`);
      if (res?.success) {
        setReviews((prev) => prev.filter((r) => r._id !== reviewId));
        if (selectedReview && selectedReview._id === reviewId) {
          setSelectedReview(null);
        }
        fetchReviews();
      }
    } catch (err) {
      alert(err.message || "Failed to delete review.");
    }
  };

  return (
    <AdminShell>
      <div className="admin-page reviews-page">
        {/* Page Head */}
        <div className="admin-page-head">
          <div>
            <span className="admin-kicker">CUSTOMER FEEDBACK</span>
            <h1>Product Reviews & Ratings</h1>
            <p>Review authentic feedback submitted by verified buyers and manage public approvals.</p>
          </div>

          <div className="review-stats-cluster">
            <div className="review-rating-box">
              <FiStar />
              <div>
                <strong>{stats.averageRating || "5.0"}</strong>
                <span>Avg Rating</span>
              </div>
            </div>

            <button
              type="button"
              className="btn-refresh"
              onClick={fetchReviews}
              title="Refresh Reviews"
            >
              <FiRefreshCw className={loading ? "spin" : ""} /> Refresh
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="reviews-summary-strip">
          <div className="rev-summary-card">
            <span>Total Reviews</span>
            <strong>{stats.total || 0}</strong>
          </div>
          <div className="rev-summary-card">
            <span>Approved</span>
            <strong style={{ color: "#34d399" }}>{stats.approved || 0}</strong>
          </div>
          <div className="rev-summary-card">
            <span>Pending Moderation</span>
            <strong style={{ color: "#fbbf24" }}>{stats.pending || 0}</strong>
          </div>
          <div className="rev-summary-card">
            <span>Rejected</span>
            <strong style={{ color: "#f87171" }}>{stats.rejected || 0}</strong>
          </div>
        </div>

        {/* Toolbar */}
        <div className="admin-toolbar">
          <form className="admin-search" onSubmit={handleSearchSubmit}>
            <FiSearch />
            <input
              placeholder="Search by customer, email, product, or comment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          <div className="filter-buttons">
            {["All", "Approved", "Pending", "Rejected"].map((st) => (
              <button
                type="button"
                className={statusFilter === st ? "active" : ""}
                key={st}
                onClick={() => setStatusFilter(st)}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="reviews-loading">
            <FiRefreshCw className="spin" />
            <p>Loading customer reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="reviews-empty">
            <FiStar style={{ fontSize: "32px", opacity: 0.4 }} />
            <h3>No Reviews Found</h3>
            <p>No customer reviews match your selected filter.</p>
          </div>
        ) : (
          <div className="reviews-grid">
            {reviews.map((r) => (
              <article
                className="review-card"
                key={r._id}
                onClick={() => setSelectedReview(r)}
                style={{ cursor: "pointer" }}
              >
                <div className="review-top">
                  <div>
                    <strong style={{ color: "#ffffff", fontSize: "14px" }}>
                      {r.userName}
                    </strong>
                    {r.isVerifiedBuyer && (
                      <span className="verified-buyer-chip">
                        <FiCheck /> Verified Buyer
                      </span>
                    )}
                  </div>
                  <span className="review-date">
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "Recent"}
                  </span>
                </div>

                <div className="product-reviewed-tag">
                  <FiPackage />
                  <span>{r.productName || r.productId || "Veda Booti Product"}</span>
                </div>

                <div className="stars">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <FiStar
                      key={i}
                      className={i <= Number(r.rating) ? "filled" : ""}
                    />
                  ))}
                  <b className="stars-num">{Number(r.rating)}.0</b>
                </div>

                <p className="review-text-body">"{r.comment}"</p>

                <div className="review-actions" onClick={(e) => e.stopPropagation()}>
                  <span className={`status-badge ${r.status?.toLowerCase() || "approved"}`}>
                    {r.status || "Approved"}
                  </span>

                  <div className="action-btns-right">
                    <button
                      type="button"
                      title="View Details"
                      onClick={() => setSelectedReview(r)}
                    >
                      <FiEye />
                    </button>

                    {r.status !== "Approved" && (
                      <button
                        type="button"
                        className="btn-approve"
                        title="Approve Review"
                        onClick={(e) => handleUpdateStatus(r._id, "Approved", e)}
                        disabled={updatingId === r._id}
                      >
                        <FiCheck />
                      </button>
                    )}

                    {r.status !== "Rejected" && (
                      <button
                        type="button"
                        className="btn-reject"
                        title="Reject Review"
                        onClick={(e) => handleUpdateStatus(r._id, "Rejected", e)}
                        disabled={updatingId === r._id}
                      >
                        <FiX />
                      </button>
                    )}

                    <button
                      type="button"
                      className="danger"
                      title="Delete Review"
                      onClick={(e) => handleDelete(r._id, e)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Modal: View Review Details */}
        {selectedReview && (
          <div className="order-modal-backdrop" onClick={() => setSelectedReview(null)}>
            <div
              className="order-modal-card review-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="order-modal-head">
                <div>
                  <span className="order-modal-kicker">Review Details</span>
                  <h3>Review for {selectedReview.productName || "Product"}</h3>
                  <small style={{ color: "#799083" }}>
                    Submitted on{" "}
                    {selectedReview.createdAt
                      ? new Date(selectedReview.createdAt).toLocaleString("en-IN")
                      : "Recent"}
                  </small>
                </div>
                <button
                  type="button"
                  className="modal-close"
                  onClick={() => setSelectedReview(null)}
                >
                  <FiX />
                </button>
              </div>

              <div className="order-modal-body">
                <div className="review-modal-meta-grid">
                  <div className="order-detail-card">
                    <h4>Customer</h4>
                    <p>
                      <strong>{selectedReview.userName}</strong>
                    </p>
                    <p className="detail-meta">Email: {selectedReview.userEmail}</p>
                    {selectedReview.isVerifiedBuyer && (
                      <span className="verified-buyer-chip" style={{ marginTop: "6px" }}>
                        <FiCheck /> Verified Buyer (Order Completed)
                      </span>
                    )}
                  </div>

                  <div className="order-detail-card">
                    <h4>Product & Rating</h4>
                    <p>
                      <strong>{selectedReview.productName || selectedReview.productId}</strong>
                    </p>
                    <div className="stars" style={{ margin: "6px 0 0" }}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <FiStar
                          key={i}
                          className={i <= Number(selectedReview.rating) ? "filled" : ""}
                        />
                      ))}
                      <span style={{ color: "#fff", marginLeft: "6px", fontSize: "13px" }}>
                        ({selectedReview.rating} out of 5)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="review-modal-comment-box">
                  <h4>Customer Feedback</h4>
                  <p>"{selectedReview.comment}"</p>
                </div>

                <div className="review-modal-footer">
                  <div className="modal-status-choice">
                    <span>Change Status:</span>
                    <button
                      type="button"
                      className={`status-btn-opt ${
                        selectedReview.status === "Approved" ? "active-app" : ""
                      }`}
                      onClick={() => handleUpdateStatus(selectedReview._id, "Approved")}
                    >
                      <FiCheck /> Approved
                    </button>
                    <button
                      type="button"
                      className={`status-btn-opt ${
                        selectedReview.status === "Pending" ? "active-pen" : ""
                      }`}
                      onClick={() => handleUpdateStatus(selectedReview._id, "Pending")}
                    >
                      <FiClock /> Pending
                    </button>
                    <button
                      type="button"
                      className={`status-btn-opt ${
                        selectedReview.status === "Rejected" ? "active-rej" : ""
                      }`}
                      onClick={() => handleUpdateStatus(selectedReview._id, "Rejected")}
                    >
                      <FiX /> Rejected
                    </button>
                  </div>

                  <button
                    type="button"
                    className="modal-btn-delete"
                    onClick={() => handleDelete(selectedReview._id)}
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
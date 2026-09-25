import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  FiStar,
  FiSave,
  FiPackage,
  FiUser,
  FiCheck,
  FiArrowLeft,
  FiCheckCircle,
  FiExternalLink,
  FiRefreshCw,
  FiPlus,
} from "react-icons/fi";
import AdminShell from "../../components/AdminShell";
import api, { getProductImageUrl } from "../../lib/api";
import "./AdminCreateReview.css";

export default function AdminCreateReview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedProductId = searchParams.get("productId") || "";

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState(preselectedProductId);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    rating: 5,
    comment: "",
    isVerifiedBuyer: true,
    status: "Approved",
    createdAt: new Date().toISOString().split("T")[0],
  });

  // Fetch all active products
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await api.get("/api/products");
      const list = res?.products || (Array.isArray(res) ? res : []);
      setProducts(list);
      if (list.length > 0 && !selectedProductId) {
        setSelectedProductId(list[0]._id || list[0].id);
      }
    } catch (err) {
      console.error("Failed to load products for review form:", err);
      setErrorMsg("Failed to load products list.");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Find currently selected product object
  const selectedProduct = products.find(
    (p) => String(p._id || p.id) === String(selectedProductId)
  ) || null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRatingChange = (newRating) => {
    setFormData((prev) => ({ ...prev, rating: newRating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!selectedProductId) {
      setErrorMsg("Please select a product for this review.");
      return;
    }

    if (!formData.userName.trim()) {
      setErrorMsg("Please enter the customer / reviewer name.");
      return;
    }

    if (!formData.comment.trim()) {
      setErrorMsg("Please write the review message / experience.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        productId: selectedProduct ? String(selectedProduct._id || selectedProduct.id) : selectedProductId,
        productSlug: selectedProduct?.slug || "",
        productName: selectedProduct?.name || "",
        productImage: (selectedProduct?.images && selectedProduct.images[0]) || selectedProduct?.image || "",
        userName: formData.userName.trim(),
        userEmail: formData.userEmail.trim(),
        rating: Number(formData.rating),
        comment: formData.comment.trim(),
        isVerifiedBuyer: formData.isVerifiedBuyer,
        status: formData.status,
        createdAt: formData.createdAt ? new Date(formData.createdAt).toISOString() : new Date().toISOString(),
      };

      const res = await api.post("/api/reviews/admin", payload);

      if (res?.success) {
        setSuccessMsg(`Review for "${payload.productName}" published successfully!`);
        // Reset customer name and comment so admin can immediately add another review for this product
        setFormData((prev) => ({
          ...prev,
          userName: "",
          userEmail: "",
          comment: "",
        }));
      } else {
        setErrorMsg(res?.message || "Failed to create review.");
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to create review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const ratingDescriptions = {
    5: "5 Stars — Outstanding / Highly Recommended",
    4: "4 Stars — Very Good Quality",
    3: "3 Stars — Average / Satisfactory",
    2: "2 Stars — Below Average",
    1: "1 Star — Poor Experience",
  };

  return (
    <AdminShell>
      <div className="admin-page create-review-page">
        {/* Header */}
        <div className="admin-page-head">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <Link to="/admin/reviews" className="back-link" title="Back to Reviews">
                <FiArrowLeft /> Back to Reviews
              </Link>
            </div>
            <span className="admin-kicker">FEEDBACK & TESTIMONIALS</span>
            <h1>Create Product Review</h1>
            <p>
              Select any product and add authentic customer reviews. You can add as many reviews as you want to any product.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <Link to="/admin/reviews" className="cancel-btn" style={{ textDecoration: "none" }}>
              View All Reviews
            </Link>
          </div>
        </div>

        {/* Alerts */}
        {successMsg && (
          <div className="alert-box success">
            <FiCheckCircle />
            <div style={{ flex: 1 }}>
              <strong>Success!</strong> {successMsg}
              <div style={{ marginTop: "6px", display: "flex", gap: "14px", flexWrap: "wrap" }}>
                {selectedProduct && (
                  <Link
                    to={`/product/${selectedProduct.slug || selectedProduct._id}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#d8b56a", fontWeight: "600", textDecoration: "underline", display: "inline-flex", alignItems: "center", gap: "4px" }}
                  >
                    View on Product Page <FiExternalLink />
                  </Link>
                )}
                <Link
                  to="/admin/reviews"
                  style={{ color: "#aebdb5", textDecoration: "underline" }}
                >
                  Go to Reviews List
                </Link>
              </div>
            </div>
            <button type="button" onClick={() => setSuccessMsg("")} className="alert-close">×</button>
          </div>
        )}

        {errorMsg && (
          <div className="alert-box error">
            <span>⚠️</span>
            <div style={{ flex: 1 }}>{errorMsg}</div>
            <button type="button" onClick={() => setErrorMsg("")} className="alert-close">×</button>
          </div>
        )}

        <form className="review-form" onSubmit={handleSubmit}>
          {/* Section 1: Choose Product */}
          <div className="form-section">
            <div className="form-section-title">
              <FiPackage />
              <div>
                <h2>Select Target Product</h2>
                <small>Choose the product to which this review will be attached.</small>
              </div>
            </div>

            {loadingProducts ? (
              <div className="field-loading">
                <FiRefreshCw className="spin" /> Loading products list...
              </div>
            ) : products.length === 0 ? (
              <div className="field-empty-warning">
                <p>No products found in the database. Please add a product first from the Admin Products section.</p>
                <Link to="/admin/products" className="gold-btn small-btn">
                  <FiPlus /> Go to Products
                </Link>
              </div>
            ) : (
              <div className="product-select-row">
                <label className="full">
                  <span>Product *</span>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    required
                  >
                    <option value="">-- Choose a Product --</option>
                    {products.map((p) => (
                      <option key={p._id || p.id} value={p._id || p.id}>
                        {p.name} {p.category ? `(${p.category})` : ""} - ₹{p.price}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Selected Product Preview Card */}
                {selectedProduct && (
                  <div className="selected-product-card">
                    <img
                      src={getProductImageUrl(
                        (selectedProduct.images && selectedProduct.images[0]) || selectedProduct.image
                      )}
                      alt={selectedProduct.name}
                      onError={(e) => {
                        e.currentTarget.src = "/assets/product-placeholder.png";
                      }}
                    />
                    <div className="selected-product-info">
                      <h4>{selectedProduct.name}</h4>
                      <p>
                        <span>Category: <b>{selectedProduct.category || "General"}</b></span>
                        <span>Price: <b>₹{selectedProduct.price}</b></span>
                        <span>Stock: <b>{selectedProduct.stock || 0}</b></span>
                      </p>
                      <Link
                        to={`/product/${selectedProduct.slug || selectedProduct._id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="preview-link"
                      >
                        Preview Product Page <FiExternalLink />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 2: Reviewer Details */}
          <div className="form-section">
            <div className="form-section-title">
              <FiUser />
              <div>
                <h2>Customer / Reviewer Details</h2>
                <small>Enter the name of the customer leaving this testimonial.</small>
              </div>
            </div>

            <div className="form-grid">
              <label>
                <span>Customer Name *</span>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh Kumar, Priya S."
                  required
                />
              </label>

              <label>
                <span>Customer Email / City (Optional)</span>
                <input
                  type="text"
                  name="userEmail"
                  value={formData.userEmail}
                  onChange={handleChange}
                  placeholder="e.g. ramesh@gmail.com or Delhi"
                />
              </label>

              <label>
                <span>Review Date</span>
                <input
                  type="date"
                  name="createdAt"
                  value={formData.createdAt}
                  onChange={handleChange}
                />
              </label>

              <label>
                <span>Publication Status</span>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="Approved">Approved (Display on website immediately)</option>
                  <option value="Pending">Pending Moderation</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </label>

              <div className="full checkbox-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isVerifiedBuyer"
                    checked={formData.isVerifiedBuyer}
                    onChange={handleChange}
                  />
                  <span>
                    <strong>Mark as Verified Buyer</strong>
                    <small>Displays a golden "✓ Verified Buyer" trust badge next to the review on the product page.</small>
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 3: Star Rating */}
          <div className="form-section">
            <div className="form-section-title">
              <FiStar />
              <div>
                <h2>Rating</h2>
                <small>Select star rating between 1 and 5.</small>
              </div>
            </div>

            <div className="rating-picker-box">
              <div className="rating-picker">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => handleRatingChange(star)}
                    className={star <= formData.rating ? "selected" : ""}
                    aria-label={`${star} Stars`}
                  >
                    <FiStar />
                  </button>
                ))}
              </div>
              <div className="rating-label">
                <strong>{formData.rating} / 5</strong>
                <span>{ratingDescriptions[formData.rating]}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Review Comment */}
          <div className="form-section">
            <div className="form-section-title">
              <FiCheck />
              <div>
                <h2>Review Feedback / Experience *</h2>
                <small>The complete text experience of the customer to display on the storefront.</small>
              </div>
            </div>

            <label className="full">
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                rows="5"
                placeholder="Write genuine customer feedback, e.g. 'Very effective Ayurvedic product! Saw noticeable stamina and energy improvement within 2 weeks of regular use. Highly recommend to everyone.'"
                required
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/admin/reviews")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="gold-btn"
              disabled={submitting || products.length === 0}
            >
              {submitting ? (
                <>
                  <FiRefreshCw className="spin" /> Publishing Review...
                </>
              ) : (
                <>
                  <FiSave /> Publish Review
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
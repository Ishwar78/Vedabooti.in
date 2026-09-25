import React, { useState, useEffect, useRef } from "react";
import {
  FiImage,
  FiPlus,
  FiTrash2,
  FiEdit,
  FiEye,
  FiCheck,
  FiX,
  FiRefreshCw,
  FiExternalLink,
  FiSmartphone,
  FiMonitor,
  FiArrowUp,
  FiArrowDown,
  FiAlertCircle,
  FiUploadCloud,
} from "react-icons/fi";
import AdminShell from "../../components/AdminShell";
import api, { getBannerImageUrl, API_BASE_URL } from "../../lib/api";
import "./AdminHero.css";

export default function AdminHero() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  // Form State
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [link, setLink] = useState("/shop");
  const [buttonText, setButtonText] = useState("Shop Now");
  const [order, setOrder] = useState(1);
  const [status, setStatus] = useState("Active");

  // File states & previews
  const [desktopFile, setDesktopFile] = useState(null);
  const [desktopPreview, setDesktopPreview] = useState("");
  const [mobileFile, setMobileFile] = useState(null);
  const [mobilePreview, setMobilePreview] = useState("");

  const desktopInputRef = useRef(null);
  const mobileInputRef = useRef(null);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/banners/admin");
      if (res?.success) {
        setBanners(res.banners || []);
      }
    } catch (err) {
      console.error("Failed to fetch banners:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openCreateModal = () => {
    setEditingBanner(null);
    setTitle("");
    setSubtitle("");
    setLink("/shop");
    setButtonText("Shop Now");
    setOrder(banners.length + 1);
    setStatus("Active");
    setDesktopFile(null);
    setDesktopPreview("");
    setMobileFile(null);
    setMobilePreview("");
    setShowModal(true);
  };

  const openEditModal = (banner) => {
    setEditingBanner(banner);
    setTitle(banner.title || "");
    setSubtitle(banner.subtitle || "");
    setLink(banner.link || "/shop");
    setButtonText(banner.buttonText || "Shop Now");
    setOrder(banner.order || 1);
    setStatus(banner.status || "Active");
    setDesktopFile(null);
    setDesktopPreview(getBannerImageUrl(banner.desktopImage));
    setMobileFile(null);
    setMobilePreview(banner.mobileImage ? getBannerImageUrl(banner.mobileImage) : "");
    setShowModal(true);
  };

  const handleDesktopFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDesktopFile(file);
      setDesktopPreview(URL.createObjectURL(file));
    }
  };

  const handleMobileFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMobileFile(file);
      setMobilePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingBanner && !desktopFile) {
      alert("Please upload a desktop banner image.");
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("link", link);
      formData.append("buttonText", buttonText);
      formData.append("order", order);
      formData.append("status", status);

      if (desktopFile) {
        formData.append("desktopImage", desktopFile);
      }
      if (mobileFile) {
        formData.append("mobileImage", mobileFile);
      }

      let res;
      if (editingBanner) {
        res = await api.put(`/api/banners/${editingBanner._id}`, formData);
      } else {
        res = await api.post("/api/banners", formData);
      }

      if (res?.success) {
        setShowModal(false);
        fetchBanners();
      } else {
        alert(res?.message || "Failed to save banner.");
      }
    } catch (err) {
      console.error("Banner save error:", err);
      alert("Error saving banner: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hero banner?")) return;
    try {
      const res = await api.delete(`/api/banners/${id}`);
      if (res?.success) {
        setBanners((prev) => prev.filter((b) => b._id !== id));
      } else {
        alert(res?.message || "Failed to delete banner.");
      }
    } catch (err) {
      alert("Error deleting banner: " + (err.response?.data?.message || err.message));
    }
  };

  const handleToggleStatus = async (banner) => {
    const newStatus = banner.status === "Active" ? "Inactive" : "Active";
    try {
      const res = await api.put(`/api/banners/${banner._id}`, { status: newStatus });
      if (res?.success) {
        setBanners((prev) =>
          prev.map((b) => (b._id === banner._id ? { ...b, status: newStatus } : b))
        );
      }
    } catch (err) {
      alert("Failed to toggle status: " + err.message);
    }
  };

  return (
    <AdminShell>
      <div className="admin-page hero-admin-page">
        {/* Header */}
        <div className="hero-admin-head">
          <div>
            <span className="admin-kicker">STOREFRONT CUSTOMIZATION</span>
            <h1>Home Hero Banners</h1>
            <p>
              Upload and manage responsive hero banners for desktop and mobile views. Banners display 100% full-width without cutting or black backgrounds.
            </p>
          </div>
          <div className="hero-head-actions">
            <button
              type="button"
              className="refresh-btn"
              onClick={fetchBanners}
              title="Refresh Banners"
            >
              <FiRefreshCw className={loading ? "spin" : ""} /> Refresh
            </button>
            <button
              type="button"
              className="btn btn-add-banner"
              onClick={openCreateModal}
            >
              <FiPlus /> Add New Banner
            </button>
          </div>
        </div>

        {/* Banners Grid / List */}
        <div className="banner-management-content">
          {loading ? (
            <div className="banner-loading-state">
              <FiRefreshCw className="spin" size={30} />
              <p>Loading banners...</p>
            </div>
          ) : banners.length === 0 ? (
            <div className="banner-empty-state">
              <FiImage size={48} style={{ color: "#d8b56a", opacity: 0.6 }} />
              <h3>No Hero Banners Found</h3>
              <p>Upload your first hero banner to showcase products on the home page.</p>
              <button
                type="button"
                className="btn btn-add-banner"
                onClick={openCreateModal}
              >
                <FiPlus /> Add First Banner
              </button>
            </div>
          ) : (
            <div className="banners-cards-grid">
              {banners.map((b, idx) => (
                <div key={b._id} className={`banner-admin-card ${b.status.toLowerCase()}`}>
                  {/* Banner Image Preview */}
                  <div className="banner-card-preview">
                    <img
                      src={getBannerImageUrl(b.desktopImage)}
                      alt={b.title || `Banner ${idx + 1}`}
                      className="preview-desktop-img"
                    />
                    <div className="banner-card-badge-row">
                      <span className={`status-pill ${b.status.toLowerCase()}`}>
                        {b.status}
                      </span>
                      <span className="order-pill">Order: #{b.order || idx + 1}</span>
                    </div>

                    {b.mobileImage && b.mobileImage !== b.desktopImage && (
                      <div className="has-mobile-badge" title="Dedicated Mobile Banner available">
                        <FiSmartphone /> Mobile Banner Available
                      </div>
                    )}
                  </div>

                  {/* Banner Info */}
                  <div className="banner-card-info">
                    <h3 className="banner-title-text">{b.title || "Untitled Banner"}</h3>
                    {b.subtitle && <p className="banner-sub-text">{b.subtitle}</p>}

                    <div className="banner-meta-links">
                      <div className="meta-link-item">
                        <span>Target Link:</span>
                        <a href={b.link || "/shop"} target="_blank" rel="noreferrer">
                          {b.link || "/shop"} <FiExternalLink size={11} />
                        </a>
                      </div>
                      <div className="meta-link-item">
                        <span>Button Text:</span>
                        <strong>{b.buttonText || "Shop Now"}</strong>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="banner-card-actions">
                      <button
                        type="button"
                        className={`btn-toggle-status ${b.status === "Active" ? "active" : "inactive"}`}
                        onClick={() => handleToggleStatus(b)}
                        title={b.status === "Active" ? "Set to Inactive" : "Set to Active"}
                      >
                        {b.status === "Active" ? <FiCheck /> : <FiX />}
                        {b.status === "Active" ? "Active" : "Inactive"}
                      </button>

                      <button
                        type="button"
                        className="btn-edit-banner"
                        onClick={() => openEditModal(b)}
                        title="Edit Banner Details & Images"
                      >
                        <FiEdit /> Edit
                      </button>

                      <button
                        type="button"
                        className="btn-delete-banner"
                        onClick={() => handleDelete(b._id)}
                        title="Delete Banner"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal: Add or Edit Hero Banner */}
        {showModal && (
          <div className="hero-modal-overlay" onClick={() => setShowModal(false)}>
            <div className="hero-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="hero-modal-header">
                <div>
                  <span className="modal-kicker">
                    {editingBanner ? "EDIT BANNER" : "NEW HERO BANNER"}
                  </span>
                  <h2>{editingBanner ? "Edit Hero Banner" : "Upload Hero Banner"}</h2>
                  <p className="modal-lead">
                    Supports high-resolution desktop and mobile-optimized banners with edge-to-edge scaling.
                  </p>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setShowModal(false)}
                >
                  <FiX />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="hero-modal-form">
                <div className="modal-form-grid">
                  {/* Upload Columns */}
                  <div className="form-upload-section">
                    {/* Desktop Banner Upload */}
                    <div className="upload-box-wrapper">
                      <label className="upload-label">
                        <FiMonitor /> Desktop Banner Image (Required)
                      </label>
                      <p className="upload-hint">
                        Recommended: <strong>1920 × 600px</strong> or <strong>1600 × 550px</strong> (JPG / PNG / WebP)
                      </p>

                      <div
                        className={`upload-dropzone ${desktopPreview ? "has-preview" : ""}`}
                        onClick={() => desktopInputRef.current?.click()}
                      >
                        {desktopPreview ? (
                          <div className="dropzone-preview-container">
                            <img src={desktopPreview} alt="Desktop preview" className="dropzone-img" />
                            <div className="change-img-overlay">
                              <FiUploadCloud size={20} />
                              <span>Click to Change Desktop Image</span>
                            </div>
                          </div>
                        ) : (
                          <div className="dropzone-placeholder">
                            <FiUploadCloud size={32} />
                            <span>Click to browse or drop desktop image</span>
                            <small>Max 15MB</small>
                          </div>
                        )}
                        <input
                          ref={desktopInputRef}
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleDesktopFileChange}
                        />
                      </div>
                    </div>

                    {/* Mobile Banner Upload */}
                    <div className="upload-box-wrapper">
                      <label className="upload-label">
                        <FiSmartphone /> Mobile Banner Image (Optional)
                      </label>
                      <p className="upload-hint">
                        Recommended: <strong>800 × 800px</strong> or <strong>750 × 1000px</strong>. If empty, desktop image is used seamlessly.
                      </p>

                      <div
                        className={`upload-dropzone ${mobilePreview ? "has-preview" : ""}`}
                        onClick={() => mobileInputRef.current?.click()}
                      >
                        {mobilePreview ? (
                          <div className="dropzone-preview-container">
                            <img src={mobilePreview} alt="Mobile preview" className="dropzone-img mobile" />
                            <div className="change-img-overlay">
                              <FiUploadCloud size={20} />
                              <span>Click to Change Mobile Image</span>
                            </div>
                          </div>
                        ) : (
                          <div className="dropzone-placeholder">
                            <FiSmartphone size={28} />
                            <span>Upload separate mobile banner</span>
                            <small>Optional for phone view</small>
                          </div>
                        )}
                        <input
                          ref={mobileInputRef}
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={handleMobileFileChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Text & Settings Column */}
                  <div className="form-fields-section">
                    <div className="field-group">
                      <label>Banner Title (Alt Text)</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="e.g. BLACK 3X Shaadi Wala Combo"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="field-group">
                      <label>Subtitle / Description</label>
                      <textarea
                        className="textarea"
                        rows={2}
                        placeholder="e.g. Pure Ayurvedic care for peak vitality and strength"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                      />
                    </div>

                    <div className="field-row-two">
                      <div className="field-group">
                        <label>Target Link</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="/shop or /products/..."
                          value={link}
                          onChange={(e) => setLink(e.target.value)}
                        />
                      </div>
                      <div className="field-group">
                        <label>Button Text</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="Shop Now"
                          value={buttonText}
                          onChange={(e) => setButtonText(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="field-row-two">
                      <div className="field-group">
                        <label>Display Sort Order</label>
                        <input
                          type="number"
                          className="input"
                          min="1"
                          max="99"
                          value={order}
                          onChange={(e) => setOrder(Number(e.target.value) || 1)}
                        />
                      </div>
                      <div className="field-group">
                        <label>Publish Status</label>
                        <select
                          className="input select"
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          <option value="Active">Active (Visible on Home)</option>
                          <option value="Inactive">Inactive (Hidden)</option>
                        </select>
                      </div>
                    </div>

                    <div className="aspect-info-card">
                      <FiAlertCircle />
                      <p>
                        <strong>Responsive Tip:</strong> Banners scale proportionally across all screens. There are no black background bars or top/bottom cuts on mobile or desktop.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="hero-modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <FiRefreshCw className="spin" /> Saving Banner...
                      </>
                    ) : (
                      <>
                        <FiCheck /> {editingBanner ? "Update Banner" : "Publish Banner"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
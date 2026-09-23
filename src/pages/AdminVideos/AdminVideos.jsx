import React, { useState, useEffect, useRef } from "react";
import {
  FiVideo,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiPlay,
  FiUploadCloud,
  FiX,
  FiCheck,
  FiSearch,
  FiExternalLink,
  FiEye,
  FiRefreshCw
} from "react-icons/fi";
import AdminShell from "../../components/AdminShell";
import api, { getVideoUrl } from "../../lib/api";
import "./AdminVideos.css";

export default function AdminVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal State for Add / Edit
  const [showModal, setShowModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [formState, setFormState] = useState({
    title: "",
    tag: "100% NATURAL",
    link: "/shop",
    status: "Active",
    author: "",
    videoSrc: "",
    order: 0,
  });

  const [videoFile, setVideoFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  // Video Player Preview Modal
  const [previewModalVideo, setPreviewModalVideo] = useState(null);

  // Fetch videos from backend
  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/videos");
      if (res && res.videos) {
        setVideos(res.videos);
      }
    } catch (err) {
      console.error("Failed to load videos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Video File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("video/") && !file.name.match(/\.(mp4|webm|mov|mkv|ogg)$/i)) {
        alert("Please select a valid video file (.mp4, .webm, .mov, etc.)");
        return;
      }
      setVideoFile(file);
      const objectUrl = URL.createObjectURL(file);
      setVideoPreviewUrl(objectUrl);
    }
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingVideo(null);
    setFormState({
      title: "",
      tag: "100% NATURAL",
      link: "/shop",
      status: "Active",
      author: "",
      videoSrc: "",
      order: videos.length + 1,
    });
    setVideoFile(null);
    setVideoPreviewUrl("");
    setShowModal(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (v) => {
    setEditingVideo(v);
    setFormState({
      title: v.title || "",
      tag: v.tag || "100% NATURAL",
      link: v.link || "/shop",
      status: v.status || "Active",
      author: v.author || "",
      videoSrc: v.videoSrc || "",
      order: v.order || 0,
    });
    setVideoFile(null);
    setVideoPreviewUrl(getVideoUrl(v.videoSrc));
    setShowModal(true);
  };

  // Submit Video (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.title.trim()) {
      alert("Please enter a video title.");
      return;
    }
    if (!videoFile && !formState.videoSrc.trim() && !editingVideo) {
      alert("Please upload a video file or provide a video URL/path.");
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", formState.title.trim());
      formData.append("tag", formState.tag.trim());
      formData.append("link", formState.link.trim() || "/shop");
      formData.append("status", formState.status);
      formData.append("author", formState.author.trim());
      formData.append("order", formState.order);

      if (videoFile) {
        formData.append("video", videoFile);
      } else if (formState.videoSrc) {
        formData.append("videoSrc", formState.videoSrc.trim());
      }

      if (editingVideo) {
        await api.put(`/api/videos/${editingVideo._id}`, formData);
        alert("Video reel updated successfully!");
      } else {
        await api.post("/api/videos", formData);
        alert("Video reel added successfully!");
      }

      setShowModal(false);
      await fetchVideos();
    } catch (err) {
      console.error("Save video error:", err);
      alert(err.message || "Failed to save video.");
    } finally {
      setSaving(false);
    }
  };

  // Delete Video
  const handleDelete = async (id, title) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete video "${title}"?`);
    if (!confirmDelete) return;

    try {
      await api.delete(`/api/videos/${id}`);
      setVideos((prev) => prev.filter((v) => v._id !== id));
      alert("Video deleted successfully.");
    } catch (err) {
      alert(err.message || "Failed to delete video.");
    }
  };

  // Toggle Video Status (Active / Draft)
  const handleToggleStatus = async (v) => {
    try {
      const res = await api.patch(`/api/videos/${v._id}/status`);
      if (res && res.status) {
        setVideos((prev) =>
          prev.map((item) => (item._id === v._id ? { ...item, status: res.status } : item))
        );
      }
    } catch (err) {
      alert("Failed to update video status.");
    }
  };

  // Filtered list
  const filteredVideos = videos.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      (v.tag && v.tag.toLowerCase().includes(search.toLowerCase())) ||
      (v.author && v.author.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === "All" || v.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <AdminShell>
      <div className="admin-page videos-page">
        {/* ================= PAGE HEADER ================= */}
        <div className="admin-page-head">
          <div>
            <span className="admin-kicker">CUSTOMER REELS MANAGEMENT</span>
            <h1>Customer Video Reels</h1>
            <p>
              Manage short video stories displayed in "What Our Customers Say" on the Home page.
            </p>
          </div>
          <div className="head-actions">
            <button
              className="refresh-btn"
              onClick={fetchVideos}
              title="Refresh videos"
              type="button"
            >
              <FiRefreshCw className={loading ? "spin" : ""} />
            </button>
            <button className="gold-btn" onClick={handleOpenAdd} type="button">
              <FiPlus /> Upload New Video
            </button>
          </div>
        </div>

        {/* ================= STATS SUMMARY ================= */}
        <div className="video-stats-bar">
          <div className="stat-pill">
            <span>Total Videos:</span>
            <strong>{videos.length}</strong>
          </div>
          <div className="stat-pill active-pill">
            <span>Active on Website:</span>
            <strong>{videos.filter((v) => v.status === "Active").length}</strong>
          </div>
          <div className="stat-pill draft-pill">
            <span>Drafts:</span>
            <strong>{videos.filter((v) => v.status === "Draft").length}</strong>
          </div>
        </div>

        {/* ================= TOOLBAR ================= */}
        <div className="video-toolbar">
          <div className="search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Search by title, tag, or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={() => setSearch("")}
              >
                <FiX />
              </button>
            )}
          </div>

          <div className="filter-group">
            <label>Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Videos</option>
              <option value="Active">Active Only</option>
              <option value="Draft">Draft Only</option>
            </select>
          </div>
        </div>

        {/* ================= VIDEO GRID ================= */}
        {loading ? (
          <div className="admin-loading-state">
            <FiRefreshCw className="spin" size={32} />
            <p>Loading video stories from database...</p>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="empty-video-state">
            <FiVideo size={48} />
            <h3>No Videos Found</h3>
            <p>
              {search || statusFilter !== "All"
                ? "No videos match your search or filter."
                : "You haven't uploaded any video reels yet."}
            </p>
            <button className="gold-btn" onClick={handleOpenAdd}>
              <FiPlus /> Upload Your First Video
            </button>
          </div>
        ) : (
          <div className="video-grid">
            {filteredVideos.map((v) => {
              const fullVideoUrl = getVideoUrl(v.videoSrc);
              return (
                <article className="video-card" key={v._id || v.id}>
                  {/* Thumbnail / Video Container */}
                  <div className="video-thumb">
                    <video
                      src={fullVideoUrl}
                      muted
                      preload="metadata"
                      playsInline
                      className="card-video-element"
                    />
                    <div className="video-overlay-tint" />

                    <div className="tag-pill-badge">{v.tag || "100% NATURAL"}</div>

                    <button
                      className="play-btn"
                      onClick={() => setPreviewModalVideo(v)}
                      title="Play Preview"
                      type="button"
                    >
                      <FiPlay />
                    </button>
                  </div>

                  {/* Card Details */}
                  <div className="video-info">
                    <div className="video-info-top">
                      <button
                        type="button"
                        className={`status-badge-btn ${v.status.toLowerCase()}`}
                        onClick={() => handleToggleStatus(v)}
                        title="Click to toggle Active/Draft"
                      >
                        {v.status === "Active" ? "● Active on Home" : "○ Draft"}
                      </button>
                      <span className="order-tag">Order: #{v.order || 0}</span>
                    </div>

                    <h3 className="video-title">{v.title}</h3>

                    {v.author && <p className="video-author">By {v.author}</p>}

                    <div className="video-link-preview">
                      <FiExternalLink size={12} />
                      <span>{v.link || "/shop"}</span>
                    </div>

                    <div className="video-src-info" title={v.videoSrc}>
                      Source: {v.videoSrc.startsWith("/uploads/") ? "Uploaded File" : v.videoSrc}
                    </div>

                    {/* Actions */}
                    <div className="video-actions">
                      <button
                        type="button"
                        className="preview-btn"
                        onClick={() => setPreviewModalVideo(v)}
                      >
                        <FiEye /> Watch
                      </button>
                      <button
                        type="button"
                        className="edit-btn"
                        onClick={() => handleOpenEdit(v)}
                      >
                        <FiEdit2 /> Edit
                      </button>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => handleDelete(v._id, v.title)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ================= ADD / EDIT MODAL ================= */}
        {showModal && (
          <div className="modal-backdrop" onClick={() => setShowModal(false)}>
            <div
              className="modal-box video-form-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <span className="admin-kicker">
                    {editingVideo ? "EDIT CUSTOMER REEL" : "NEW CUSTOMER REEL"}
                  </span>
                  <h2>{editingVideo ? "Edit Video Story" : "Upload Customer Video"}</h2>
                </div>
                <button
                  type="button"
                  className="modal-close"
                  onClick={() => setShowModal(false)}
                >
                  <FiX />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="modal-form">
                {/* 1. VIDEO FILE UPLOAD BOX */}
                <div className="form-group">
                  <label>Video File (Upload MP4 / WebM / MOV):</label>
                  <div
                    className={`video-dropzone ${videoFile ? "has-file" : ""}`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="video/mp4,video/webm,video/ogg,video/quicktime,video/mkv"
                      style={{ display: "none" }}
                    />
                    <FiUploadCloud size={38} className="upload-icon" />
                    {videoFile ? (
                      <div className="file-info-preview">
                        <strong>{videoFile.name}</strong>
                        <span>({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                        <small className="change-hint">Click to choose a different video</small>
                      </div>
                    ) : (
                      <div className="file-placeholder">
                        <strong>Click or Drag to Upload Video</strong>
                        <span>Supports MP4, WebM, MOV (Max 200MB)</span>
                        {editingVideo && (
                          <small className="keep-hint">
                            Leave empty to keep existing video ({editingVideo.videoSrc})
                          </small>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* VIDEO LIVE PREVIEW INSIDE FORM */}
                {videoPreviewUrl && (
                  <div className="form-video-preview-wrapper">
                    <label>Video Preview:</label>
                    <video
                      src={videoPreviewUrl}
                      controls
                      playsInline
                      className="form-video-preview"
                    />
                  </div>
                )}

                {/* OR ENTER URL */}
                <div className="form-group">
                  <label>
                    Or Video URL / Path: <small>(Optional if file uploaded)</small>
                  </label>
                  <input
                    type="text"
                    name="videoSrc"
                    value={formState.videoSrc}
                    onChange={handleInputChange}
                    placeholder="e.g. /assets/Video.mp4 or https://..."
                  />
                </div>

                {/* TITLE & TAG */}
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      Video Title <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formState.title}
                      onChange={handleInputChange}
                      placeholder="e.g. Honey, Black 3X Power Kit"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Tag / Badge</label>
                    <input
                      type="text"
                      name="tag"
                      value={formState.tag}
                      onChange={handleInputChange}
                      placeholder="e.g. 100% NATURAL, AYURVEDIC CARE"
                    />
                  </div>
                </div>

                {/* PRODUCT LINK & STATUS */}
                <div className="form-row">
                  <div className="form-group">
                    <label>View Product Link</label>
                    <input
                      type="text"
                      name="link"
                      value={formState.link}
                      onChange={handleInputChange}
                      placeholder="e.g. /shop or /product/honey"
                    />
                  </div>

                  <div className="form-group">
                    <label>Display Status</label>
                    <select
                      name="status"
                      value={formState.status}
                      onChange={handleInputChange}
                    >
                      <option value="Active">Active (Visible on Home)</option>
                      <option value="Draft">Draft (Hidden)</option>
                    </select>
                  </div>
                </div>

                {/* CUSTOMER NAME & ORDER */}
                <div className="form-row">
                  <div className="form-group">
                    <label>Customer Name (Optional)</label>
                    <input
                      type="text"
                      name="author"
                      value={formState.author}
                      onChange={handleInputChange}
                      placeholder="e.g. Priya Sharma"
                    />
                  </div>

                  <div className="form-group">
                    <label>Display Order</label>
                    <input
                      type="number"
                      name="order"
                      value={formState.order}
                      onChange={handleInputChange}
                      placeholder="1, 2, 3..."
                    />
                  </div>
                </div>

                {/* FORM ACTIONS */}
                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowModal(false)}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="gold-btn save-btn" disabled={saving}>
                    {saving ? (
                      <>
                        <FiRefreshCw className="spin" />
                        {videoFile ? "Uploading Video..." : "Saving..."}
                      </>
                    ) : (
                      <>
                        <FiCheck />
                        {editingVideo ? "Update Video" : "Save & Publish"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= FULLSCREEN PLAY PREVIEW MODAL ================= */}
        {previewModalVideo && (
          <div
            className="modal-backdrop player-modal-backdrop"
            onClick={() => setPreviewModalVideo(null)}
          >
            <div
              className="player-modal-box"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="player-close-btn"
                onClick={() => setPreviewModalVideo(null)}
              >
                <FiX />
              </button>

              <div className="player-content">
                <video
                  src={getVideoUrl(previewModalVideo.videoSrc)}
                  controls
                  autoPlay
                  playsInline
                  className="modal-full-video"
                />
                <div className="player-details">
                  <span className="player-tag">{previewModalVideo.tag}</span>
                  <h3>{previewModalVideo.title}</h3>
                  {previewModalVideo.author && <p>By {previewModalVideo.author}</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
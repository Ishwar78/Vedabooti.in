import React, { useState, useEffect } from "react";
import {
  FiMail,
  FiPhone,
  FiTrash2,
  FiEye,
  FiSearch,
  FiEdit3,
  FiX,
  FiMapPin,
  FiClock,
  FiInstagram,
  FiFacebook,
  FiYoutube,
  FiSave,
  FiLoader
} from "react-icons/fi";

import AdminShell from "../../components/AdminShell";
import api from "../../lib/api";
import "./AdminContact.css";

export default function AdminContact() {
  const [search, setSearch] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ================= CONTACT PAGE DETAILS =================
  const [contactDetails, setContactDetails] = useState({
    titleLine1: "We'd love to",
    titleLine2: "hear from you.",
    description:
      "Reach out to us for product information, order assistance, shipping queries or general support.",
    email: "support@vedabooti.com",
    phone: "+91 99999 99999",
    businessName: "Veda Booti Health Care",
    address: "India",
    supportDays: "Monday – Saturday",
    supportTime: "10:00 AM – 6:00 PM",
    emailResponse: "We usually reply within 24 hours",
    instagram: "https://instagram.com/vedabooti",
    facebook: "https://facebook.com/vedabooti",
    youtube: "https://youtube.com/@vedabooti"
  });

  // Editable form state for modal
  const [formData, setFormData] = useState(contactDetails);

  // ================= CONTACT MESSAGES =================
  const [contacts, setContacts] = useState([]);

  // Load from MongoDB
  const fetchContactData = async () => {
    setLoading(true);
    try {
      const detailsRes = await api.get("/api/contact/details");
      if (detailsRes?.details) {
        setContactDetails(detailsRes.details);
        setFormData(detailsRes.details);
      }

      const msgRes = await api.get("/api/contact/messages");
      if (msgRes?.messages) {
        setContacts(msgRes.messages);
      }
    } catch (err) {
      console.error("Failed to load contact data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactData();
  }, []);

  // ================= SEARCH MESSAGES =================
  const filtered = contacts.filter((item) =>
    `${item.name} ${item.email} ${item.subject || ""} ${item.message || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ================= OPEN EDIT =================
  const openEditModal = () => {
    setFormData(contactDetails);
    setShowEdit(true);
  };

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // ================= SAVE CONTACT DETAILS TO DB =================
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await api.put("/api/contact/details", formData);
      if (res && res.details) {
        setContactDetails(res.details);
      }
      setShowEdit(false);
      alert("Website contact details updated successfully in database!");
    } catch (err) {
      console.error("Error saving contact details:", err);
      alert(err.message || "Failed to update contact details.");
    } finally {
      setSaving(false);
    }
  };

  // ================= DELETE MESSAGE =================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/api/contact/messages/${id}`);
      setContacts((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert("Failed to delete message.");
    }
  };

  return (
    <AdminShell>
      <div className="admin-page contact-page">

        {/* ================= PAGE HEADER ================= */}
        <div className="admin-page-head">
          <div>
            <span className="admin-kicker">
              WEBSITE CONTACT MANAGEMENT
            </span>
            <h1>Contact Page</h1>
            <p>
              Manage contact information displayed on your website and review customer messages.
            </p>
          </div>

          <div className="contact-header-actions">
            <div className="admin-stat-card">
              <FiMail />
              <strong>{contacts.length}</strong>
              <span>Total Messages</span>
            </div>

            <button
              type="button"
              className="contact-edit-btn"
              onClick={openEditModal}
            >
              <FiEdit3 />
              Edit Contact Details
            </button>
          </div>
        </div>

        {/* ================= CURRENT CONTACT DETAILS ================= */}
        <section className="contact-settings-card">
          <div className="contact-settings-head">
            <div>
              <span className="section-kicker">
                PUBLIC CONTACT INFORMATION
              </span>
              <h2>Website Contact Details</h2>
              <p>
                These details are displayed live on your public Contact & Support page.
              </p>
            </div>

            <button
              type="button"
              className="small-edit-btn"
              onClick={openEditModal}
            >
              <FiEdit3 />
              Edit
            </button>
          </div>

          <div className="contact-preview-grid">
            {/* EMAIL */}
            <div className="contact-info-box">
              <div className="contact-info-icon">
                <FiMail />
              </div>
              <div>
                <span>Email</span>
                <strong>{contactDetails.email}</strong>
                <small>{contactDetails.emailResponse}</small>
              </div>
            </div>

            {/* PHONE */}
            <div className="contact-info-box">
              <div className="contact-info-icon">
                <FiPhone />
              </div>
              <div>
                <span>Phone</span>
                <strong>{contactDetails.phone}</strong>
                <small>{contactDetails.supportDays}</small>
              </div>
            </div>

            {/* ADDRESS */}
            <div className="contact-info-box">
              <div className="contact-info-icon">
                <FiMapPin />
              </div>
              <div>
                <span>Visit Us</span>
                <strong>{contactDetails.businessName}</strong>
                <small>{contactDetails.address}</small>
              </div>
            </div>

            {/* HOURS */}
            <div className="contact-info-box">
              <div className="contact-info-icon">
                <FiClock />
              </div>
              <div>
                <span>Support Hours</span>
                <strong>{contactDetails.supportDays}</strong>
                <small>{contactDetails.supportTime}</small>
              </div>
            </div>
          </div>

          {/* SOCIAL LINKS */}
          <div className="social-preview">
            <span className="social-preview-title">
              Follow Veda Booti
            </span>

            <div className="social-links-preview">
              <a
                href={contactDetails.instagram}
                target="_blank"
                rel="noreferrer"
                title="Instagram"
              >
                <FiInstagram />
              </a>

              <a
                href={contactDetails.facebook}
                target="_blank"
                rel="noreferrer"
                title="Facebook"
              >
                <FiFacebook />
              </a>

              <a
                href={contactDetails.youtube}
                target="_blank"
                rel="noreferrer"
                title="YouTube"
              >
                <FiYoutube />
              </a>
            </div>
          </div>
        </section>

        {/* ================= CUSTOMER MESSAGES ================= */}
        <section style={{ marginTop: "35px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <span style={{ fontSize: "11px", letterSpacing: "1.8px", color: "var(--gold2, #d5b46a)", textTransform: "uppercase", fontWeight: "600" }}>
                INBOX
              </span>
              <h2 style={{ fontSize: "24px", color: "#edf4ef", margin: "4px 0" }}>
                Customer Messages
              </h2>
              <p style={{ color: "#879990", margin: 0, fontSize: "13px" }}>
                Inquiries submitted via the website contact form.
              </p>
            </div>

            <div className="contact-search-box" style={{ display: "flex", alignItems: "center", gap: "8px", background: "#081e14", border: "1px solid #1d3b2d", borderRadius: "8px", padding: "0 12px", height: "40px" }}>
              <FiSearch style={{ color: "#71857a" }} />
              <input
                type="text"
                placeholder="Search messages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ background: "transparent", border: 0, outline: 0, color: "#edf4ef", fontSize: "13px" }}
              />
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#879990" }}>
              <FiLoader className="spin" style={{ fontSize: "22px" }} />
              <p style={{ marginTop: "10px" }}>Loading contact data from database...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px dashed rgba(255,255,255,0.1)", color: "#879990" }}>
              <FiMail style={{ fontSize: "32px", color: "var(--gold2, #d5b46a)", marginBottom: "8px" }} />
              <h3 style={{ color: "#fff", marginBottom: "4px" }}>No Messages Found</h3>
              <p style={{ fontSize: "13px", margin: 0 }}>Customer messages submitted on the Contact page will appear here.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              {filtered.map((msg) => (
                <div
                  key={msg._id}
                  style={{
                    background: "#081e14",
                    border: "1px solid #1a382a",
                    borderRadius: "12px",
                    padding: "18px 22px",
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: "14px",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                      <strong style={{ fontSize: "16px", color: "#edf4ef" }}>{msg.name}</strong>
                      <span style={{ fontSize: "12px", color: "#879990" }}>• {msg.email}</span>
                      {msg.phone && <span style={{ fontSize: "12px", color: "#879990" }}>• {msg.phone}</span>}
                      {msg.createdAt && (
                        <span style={{ fontSize: "11px", color: "#667a70", marginLeft: "auto" }}>
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {msg.subject && (
                      <div style={{ fontSize: "13px", color: "var(--gold2, #d5b46a)", fontWeight: "600", marginBottom: "6px" }}>
                        Subject: {msg.subject}
                      </div>
                    )}
                    <p style={{ fontSize: "14px", color: "#c5d4cb", margin: 0, lineHeight: "1.5" }}>
                      {msg.message}
                    </p>
                  </div>

                  <button
                    type="button"
                    title="Delete Message"
                    onClick={() => handleDelete(msg._id)}
                    style={{
                      background: "rgba(239, 68, 68, 0.12)",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      color: "#fca5a5",
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      display: "grid",
                      placeItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>

      {/* ================= EDIT CONTACT MODAL ================= */}
      {showEdit && (
        <div
          className="contact-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowEdit(false);
            }
          }}
        >
          <div className="contact-modal">
            {/* MODAL HEADER */}
            <div className="contact-modal-head">
              <div>
                <span className="section-kicker">
                  WEBSITE SETTINGS
                </span>
                <h2>Edit Contact Details</h2>
                <p>
                  Update the information shown on the public Contact page.
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() => setShowEdit(false)}
              >
                <FiX />
              </button>
            </div>

            {/* FORM */}
            <form
              className="contact-edit-form"
              onSubmit={handleSave}
            >
              {/* ================= HEADING ================= */}
              <div className="form-section-title">
                <span>Contact Page Content</span>
              </div>

              <div className="form-grid">
                <label>
                  <span>Heading Line 1</span>
                  <input
                    name="titleLine1"
                    value={formData.titleLine1 || ""}
                    onChange={handleChange}
                    placeholder="We'd love to"
                  />
                </label>

                <label>
                  <span>Heading Line 2</span>
                  <input
                    name="titleLine2"
                    value={formData.titleLine2 || ""}
                    onChange={handleChange}
                    placeholder="hear from you."
                  />
                </label>
              </div>

              <div className="form-grid single-column">
                <label>
                  <span>Description</span>
                  <textarea
                    rows="3"
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    placeholder="Reach out to us..."
                  />
                </label>
              </div>

              {/* ================= BASIC DETAILS ================= */}
              <div className="form-section-title">
                <span>Basic Contact Info</span>
              </div>

              <div className="form-grid">
                <label>
                  <span>Support Email</span>
                  <div className="form-input-icon">
                    <FiMail />
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleChange}
                      placeholder="support@vedabooti.com"
                    />
                  </div>
                </label>

                <label>
                  <span>Phone Number</span>
                  <div className="form-input-icon">
                    <FiPhone />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleChange}
                      placeholder="+91 99999 99999"
                    />
                  </div>
                </label>

                <label>
                  <span>Business Name</span>
                  <input
                    name="businessName"
                    value={formData.businessName || ""}
                    onChange={handleChange}
                    placeholder="Veda Booti Health Care"
                  />
                </label>

                <label>
                  <span>Email Response Note</span>
                  <input
                    name="emailResponse"
                    value={formData.emailResponse || ""}
                    onChange={handleChange}
                    placeholder="We usually reply within 24 hours"
                  />
                </label>
              </div>

              {/* ================= ADDRESS & HOURS ================= */}
              <div className="form-section-title">
                <span>Address & Working Hours</span>
              </div>

              <div className="form-grid">
                <label className="full-width">
                  <span>Physical Address / Location</span>
                  <div className="form-input-icon">
                    <FiMapPin />
                    <input
                      name="address"
                      value={formData.address || ""}
                      onChange={handleChange}
                      placeholder="124/B, Ayurveda Bhavan, New Delhi, India"
                    />
                  </div>
                </label>

                <label>
                  <span>Support Days</span>
                  <div className="form-input-icon">
                    <FiClock />
                    <input
                      name="supportDays"
                      value={formData.supportDays || ""}
                      onChange={handleChange}
                      placeholder="Monday – Saturday"
                    />
                  </div>
                </label>

                <label>
                  <span>Support Timings</span>
                  <div className="form-input-icon">
                    <FiClock />
                    <input
                      name="supportTime"
                      value={formData.supportTime || ""}
                      onChange={handleChange}
                      placeholder="10:00 AM – 6:00 PM"
                    />
                  </div>
                </label>
              </div>

              {/* ================= SOCIAL LINKS ================= */}
              <div className="form-section-title">
                <span>Social Media Links</span>
              </div>

              <div className="form-grid">
                <label className="full-width">
                  <span>Instagram URL</span>
                  <div className="form-input-icon">
                    <FiInstagram />
                    <input
                      type="url"
                      name="instagram"
                      value={formData.instagram || ""}
                      onChange={handleChange}
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                </label>

                <label className="full-width">
                  <span>Facebook URL</span>
                  <div className="form-input-icon">
                    <FiFacebook />
                    <input
                      type="url"
                      name="facebook"
                      value={formData.facebook || ""}
                      onChange={handleChange}
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                </label>

                <label className="full-width">
                  <span>YouTube URL</span>
                  <div className="form-input-icon">
                    <FiYoutube />
                    <input
                      type="url"
                      name="youtube"
                      value={formData.youtube || ""}
                      onChange={handleChange}
                      placeholder="https://youtube.com/@..."
                    />
                  </div>
                </label>
              </div>

              {/* ================= ACTIONS ================= */}
              <div className="contact-modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowEdit(false)}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-contact-btn"
                  disabled={saving}
                >
                  <FiSave />
                  {saving ? "Saving..." : "Save Contact Details"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AdminShell>
  );
}
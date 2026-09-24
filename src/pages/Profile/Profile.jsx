import React, { useState, useEffect } from "react";
import UserShell from "../../components/UserShell";
import { FiCheckCircle, FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import api from "../../lib/api";
import "./Profile.css";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      // 1. First check local storage for instant render
      try {
        const raw = localStorage.getItem("user");
        if (raw) {
          const u = JSON.parse(raw);
          setFormData({
            name: u.name || "",
            email: u.email || "",
            phone: u.phone || "",
          });
        }
      } catch {}

      // 2. Fetch fresh user profile from backend
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("userToken");
        if (token) {
          const res = await api.get("/api/auth/me");
          if (res?.success && res.user) {
            setFormData({
              name: res.user.name || "",
              email: res.user.email || "",
              phone: res.user.phone || "",
            });
            localStorage.setItem("user", JSON.stringify(res.user));
          }
        }
      } catch (err) {
        console.warn("Could not fetch remote profile:", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await api.put("/api/auth/profile", {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
      });

      if (res?.success && res.user) {
        localStorage.setItem("user", JSON.stringify(res.user));
        window.dispatchEvent(new Event("storage"));
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch (err) {
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <UserShell>
      <div className="account-section">
        <span className="eyebrow">Account Settings</span>
        <h1>Profile Details</h1>
        <p className="account-sub">
          Keep your contact information up-to-date for smooth order deliveries.
        </p>

        {saved && (
          <div className="profile-saved-banner">
            <FiCheckCircle /> Profile changes saved successfully!
          </div>
        )}

        {error && (
          <div
            style={{
              padding: "12px 16px",
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid #ef4444",
              borderRadius: "8px",
              color: "#fca5a5",
              fontSize: "14px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FiAlertCircle /> {error}
          </div>
        )}

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#8da497" }}>
            <FiRefreshCw className="spin" size={24} />
            <p style={{ marginTop: "8px" }}>Loading your profile...</p>
          </div>
        ) : (
          <form className="account-form" onSubmit={handleSubmit}>
            <div>
              <label>
                Full Name
                <input
                  className="input"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Full Name"
                  required
                />
              </label>
            </div>

            <label>
              Email Address (Verified)
              <input
                className="input"
                type="email"
                name="email"
                value={formData.email}
                readOnly
                title="Email is verified with your OTP login and cannot be altered directly."
                style={{ opacity: 0.75, cursor: "not-allowed", background: "rgba(255,255,255,0.02)" }}
              />
            </label>

            <label>
              Phone Number
              <input
                className="input"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +91 98765 43210"
              />
            </label>

            <button className="btn" type="submit" disabled={saving}>
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </form>
        )}
      </div>
    </UserShell>
  );
}

import React, { useState, useEffect } from "react";
import UserShell from "../../components/UserShell";
import { FiPlus, FiCheckCircle, FiTrash2, FiMapPin, FiRefreshCw } from "react-icons/fi";
import api from "../../lib/api";
import "./Addresses.css";

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [newAddr, setNewAddr] = useState({
    type: "Home",
    fullName: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
  });

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("userToken");
      if (token) {
        const res = await api.get("/api/auth/addresses");
        if (res?.success && Array.isArray(res.addresses)) {
          setAddresses(res.addresses);
          return;
        }
      }
      // fallback to localStorage
      const local = JSON.parse(localStorage.getItem("vb_addresses") || "[]");
      setAddresses(local);
    } catch (err) {
      console.warn("Could not fetch addresses from API:", err.message);
      const local = JSON.parse(localStorage.getItem("vb_addresses") || "[]");
      setAddresses(local);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("userToken");
      if (token) {
        const res = await api.post("/api/auth/addresses", {
          type: newAddr.type,
          fullName: newAddr.fullName.trim(),
          phone: newAddr.phone.trim(),
          addressLine1: newAddr.addressLine1.trim(),
          city: newAddr.city.trim(),
          state: newAddr.state.trim(),
          pincode: newAddr.pincode.trim(),
        });

        if (res?.success && Array.isArray(res.addresses)) {
          setAddresses(res.addresses);
        }
      } else {
        // Guest/offline local save
        const updated = [
          ...addresses,
          {
            ...newAddr,
            _id: `local-${Date.now()}`,
          },
        ];
        setAddresses(updated);
        localStorage.setItem("vb_addresses", JSON.stringify(updated));
      }

      setShowAdd(false);
      setNewAddr({
        type: "Home",
        fullName: "",
        phone: "",
        addressLine1: "",
        city: "",
        state: "",
        pincode: "",
      });
      setMessage("Address added successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      alert(err.message || "Failed to save address.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("userToken");
      if (token && !String(id).startsWith("local-")) {
        const res = await api.delete(`/api/auth/addresses/${id}`);
        if (res?.success && Array.isArray(res.addresses)) {
          setAddresses(res.addresses);
          return;
        }
      }

      const updated = addresses.filter((a) => (a._id || a.id) !== id);
      setAddresses(updated);
      localStorage.setItem("vb_addresses", JSON.stringify(updated));
    } catch (err) {
      alert(err.message || "Failed to delete address.");
    }
  };

  return (
    <UserShell>
      <div className="addresses-section">
        <div className="addresses-top">
          <div>
            <span className="eyebrow">Delivery Locations</span>
            <h1>Saved Addresses ({addresses.length})</h1>
            <p className="account-sub">
              Manage your delivery addresses for quick and hassle-free checkout.
            </p>
          </div>
          <button
            type="button"
            className="btn"
            onClick={() => setShowAdd((v) => !v)}
          >
            <FiPlus /> {showAdd ? "Close Form" : "Add New Address"}
          </button>
        </div>

        {message && (
          <div
            style={{
              padding: "12px 16px",
              background: "rgba(34, 197, 94, 0.12)",
              border: "1px solid #22c55e",
              borderRadius: "8px",
              color: "#86efac",
              fontSize: "14px",
              marginBottom: "18px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FiCheckCircle /> {message}
          </div>
        )}

        {showAdd && (
          <form className="add-address-form" onSubmit={handleAddSubmit}>
            <h3>Add New Delivery Address</h3>
            <div className="addr-form-grid">
              <input
                className="input"
                placeholder="Full Name *"
                value={newAddr.fullName}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, fullName: e.target.value })
                }
                required
              />
              <input
                className="input"
                placeholder="Phone Number *"
                value={newAddr.phone}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, phone: e.target.value })
                }
                required
              />
              <input
                className="input wide"
                placeholder="Address (House/Flat No., Street, Landmark) *"
                value={newAddr.addressLine1}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, addressLine1: e.target.value })
                }
                required
              />
              <input
                className="input"
                placeholder="City *"
                value={newAddr.city}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, city: e.target.value })
                }
                required
              />
              <input
                className="input"
                placeholder="State *"
                value={newAddr.state}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, state: e.target.value })
                }
                required
              />
              <input
                className="input"
                placeholder="Pincode *"
                value={newAddr.pincode}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, pincode: e.target.value })
                }
                required
              />
              <select
                className="select"
                value={newAddr.type}
                onChange={(e) =>
                  setNewAddr({ ...newAddr, type: e.target.value })
                }
              >
                <option value="Home">Home (Default)</option>
                <option value="Office">Office / Work</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button className="btn" type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save Address"}
            </button>
          </form>
        )}

        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#8da497" }}>
            <FiRefreshCw className="spin" size={24} />
            <p style={{ marginTop: "8px" }}>Loading your addresses...</p>
          </div>
        ) : addresses.length === 0 ? (
          <div
            style={{
              padding: "48px 24px",
              textAlign: "center",
              background: "#091d14",
              borderRadius: "12px",
              border: "1px dashed rgba(216, 181, 106, 0.25)",
              color: "#8da497",
            }}
          >
            <FiMapPin size={36} style={{ color: "#d8b56a", opacity: 0.8 }} />
            <h3 style={{ color: "#edf4ef", marginTop: "12px" }}>No Saved Addresses</h3>
            <p style={{ maxWidth: "420px", margin: "6px auto 18px", fontSize: "14px" }}>
              You haven't added any delivery addresses yet. Add an address now for faster checkout.
            </p>
            <button
              type="button"
              className="btn"
              onClick={() => setShowAdd(true)}
            >
              <FiPlus /> Add Your First Address
            </button>
          </div>
        ) : (
          <div className="address-grid">
            {addresses.map((addr) => {
              const addrId = addr._id || addr.id;
              return (
                <article className="address-card" key={addrId}>
                  <div className="address-badge-row">
                    <span className="addr-tag">{addr.type || "HOME"}</span>
                    <button
                      type="button"
                      className="addr-delete-btn"
                      onClick={() => handleDelete(addrId)}
                      title="Delete address"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                  <h3>{addr.fullName || addr.name}</h3>
                  <p>
                    {addr.addressLine1 || addr.line1}
                    {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                    <br />
                    {addr.city}, {addr.state} — {addr.pincode}
                    <br />
                    Phone: {addr.phone}
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </UserShell>
  );
}

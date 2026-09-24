import React, { useState, useEffect } from "react";
import AdminShell from "../../components/AdminShell";
import {
  FiTag,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiCheck,
  FiX,
  FiRefreshCw,
  FiPercent,
  FiDollarSign,
} from "react-icons/fi";
import api from "../../lib/api";
import "./AdminCoupons.css";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const [form, setForm] = useState({
    code: "",
    title: "",
    description: "",
    discountType: "Percentage",
    discountValue: "",
    minOrder: "",
    status: "Active",
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/coupons");
      if (res?.success && Array.isArray(res.coupons)) {
        setCoupons(res.coupons);
      }
    } catch (err) {
      console.error("Failed to load coupons:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openCreateModal = () => {
    setEditingCoupon(null);
    setForm({
      code: "",
      title: "",
      description: "",
      discountType: "Percentage",
      discountValue: "",
      minOrder: "",
      status: "Active",
    });
    setShowModal(true);
  };

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);
    setForm({
      code: coupon.code,
      title: coupon.title || "",
      description: coupon.description || "",
      discountType: coupon.discountType || "Percentage",
      discountValue: String(coupon.discountValue || ""),
      minOrder: String(coupon.minOrder || ""),
      status: coupon.status || "Active",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCoupon(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!form.code.trim()) {
      alert("Please enter a coupon code.");
      return;
    }
    if (!form.discountValue || Number(form.discountValue) <= 0) {
      alert("Please enter a valid discount value greater than 0.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        title: form.title.trim(),
        description: form.description.trim(),
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minOrder: Number(form.minOrder) || 0,
        status: form.status,
      };

      if (editingCoupon) {
        await api.put(`/api/coupons/${editingCoupon._id}`, payload);
        alert("Coupon updated successfully!");
      } else {
        await api.post("/api/coupons", payload);
        alert("Coupon created successfully!");
      }

      closeModal();
      await fetchCoupons();
    } catch (err) {
      alert(err.message || "Failed to save coupon.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (coupon) => {
    try {
      await api.patch(`/api/coupons/${coupon._id}/status`);
      await fetchCoupons();
    } catch (err) {
      alert(err.message || "Failed to update status.");
    }
  };

  const handleDelete = async (coupon) => {
    if (!window.confirm(`Are you sure you want to delete coupon "${coupon.code}"?`)) return;
    try {
      await api.delete(`/api/coupons/${coupon._id}`);
      await fetchCoupons();
    } catch (err) {
      alert(err.message || "Failed to delete coupon.");
    }
  };

  const filteredCoupons = coupons.filter((c) => {
    const matchSearch =
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      (c.title && c.title.toLowerCase().includes(search.toLowerCase())) ||
      (c.description && c.description.toLowerCase().includes(search.toLowerCase()));

    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const activeCount = coupons.filter((c) => c.status === "Active").length;
  const inactiveCount = coupons.filter((c) => c.status === "Inactive").length;

  return (
    <AdminShell>
      <div className="coupon-mgmt">
        {/* Header */}
        <div className="crud-head">
          <div>
            <span className="eyebrow">Marketing & Promotions</span>
            <h1>Coupon Management</h1>
            <p>Create and manage discount coupons for customer checkout.</p>
          </div>
          <button type="button" className="btn" onClick={openCreateModal}>
            <FiPlus /> Add New Coupon
          </button>
        </div>

        {/* Stats Strip */}
        <div className="coupon-stats">
          <div className="coupon-stat-card">
            <span>Total Coupons</span>
            <strong>{coupons.length}</strong>
          </div>
          <div className="coupon-stat-card">
            <span>Active Coupons</span>
            <strong style={{ color: "#4ade80" }}>{activeCount}</strong>
          </div>
          <div className="coupon-stat-card">
            <span>Inactive Coupons</span>
            <strong style={{ color: "#94a3b8" }}>{inactiveCount}</strong>
          </div>
        </div>

        {/* Toolbar */}
        <div className="crud-toolbar">
          <div className="search-wrap">
            <FiSearch />
            <input
              className="input"
              placeholder="Search coupons by code or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>
        </div>

        {/* Coupons Table */}
        <div className="crud-table">
          <div className="table-row table-head">
            <span>Coupon Code</span>
            <span>Title & Details</span>
            <span>Discount</span>
            <span>Min Order</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#8da497" }}>
              <FiRefreshCw className="spin" size={26} />
              <p style={{ marginTop: "8px" }}>Loading coupons from database...</p>
            </div>
          ) : filteredCoupons.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#8da497" }}>
              <p>No coupons found.</p>
              <button className="btn" onClick={openCreateModal} style={{ marginTop: "10px" }}>
                <FiPlus /> Create First Coupon
              </button>
            </div>
          ) : (
            filteredCoupons.map((coupon) => (
              <div className="table-row" key={coupon._id}>
                <span className="code-cell">
                  <code>{coupon.code}</code>
                </span>

                <span>
                  <strong style={{ color: "#fff", display: "block" }}>
                    {coupon.title || "Special Promotion"}
                  </strong>
                  {coupon.description && (
                    <small style={{ color: "#8c9a92", fontSize: "11px" }}>
                      {coupon.description}
                    </small>
                  )}
                </span>

                <span>
                  <strong style={{ color: "#d8b56a", fontSize: "14px" }}>
                    {coupon.discountType === "Percentage"
                      ? `${coupon.discountValue}% OFF`
                      : `₹${coupon.discountValue} OFF`}
                  </strong>
                  <small style={{ display: "block", color: "#6e8478", fontSize: "11px" }}>
                    {coupon.discountType}
                  </small>
                </span>

                <span>
                  {coupon.minOrder > 0 ? (
                    <span style={{ color: "#bdcac3" }}>₹{coupon.minOrder}</span>
                  ) : (
                    <small style={{ color: "#6e8478" }}>No Minimum</small>
                  )}
                </span>

                <span>
                  <span
                    className={`status ${coupon.status === "Active" ? "active" : "draft"}`}
                    onClick={() => handleToggleStatus(coupon)}
                    style={{ cursor: "pointer" }}
                    title="Click to toggle status"
                  >
                    {coupon.status}
                  </span>
                </span>

                <div className="row-actions">
                  <button
                    type="button"
                    title="Edit Coupon"
                    onClick={() => openEditModal(coupon)}
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    type="button"
                    className="delete-action"
                    title="Delete Coupon"
                    onClick={() => handleDelete(coupon)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="product-modal-backdrop" onClick={closeModal}>
            <div
              className="coupon-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="product-modal-header">
                <div>
                  <span className="modal-eyebrow">COUPON SETUP</span>
                  <h2>{editingCoupon ? "Edit Coupon" : "Add New Coupon"}</h2>
                  <p>Configure promo codes and discount rules for customer checkout.</p>
                </div>
                <button type="button" className="modal-close" onClick={closeModal}>
                  <FiX />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="coupon-form">
                <div className="coupon-form-grid">
                  <div className="field">
                    <label>
                      Coupon Code <span>*</span>
                    </label>
                    <input
                      className="input uppercase"
                      value={form.code}
                      onChange={(e) =>
                        setForm({ ...form, code: e.target.value.toUpperCase() })
                      }
                      placeholder="e.g. VEDA20"
                      required
                    />
                    <small style={{ color: "#799285", fontSize: "11px" }}>
                      Code customers enter at checkout (letters & numbers only)
                    </small>
                  </div>

                  <div className="field">
                    <label>
                      Discount Type <span>*</span>
                    </label>
                    <select
                      className="select"
                      value={form.discountType}
                      onChange={(e) =>
                        setForm({ ...form, discountType: e.target.value })
                      }
                    >
                      <option value="Percentage">Percentage (% OFF)</option>
                      <option value="Fixed Amount">Fixed Amount (₹ Flat OFF)</option>
                    </select>
                  </div>

                  <div className="field">
                    <label>
                      Discount Value ({form.discountType === "Percentage" ? "%" : "₹"}) <span>*</span>
                    </label>
                    <input
                      className="input"
                      type="number"
                      min="1"
                      value={form.discountValue}
                      onChange={(e) =>
                        setForm({ ...form, discountValue: e.target.value })
                      }
                      placeholder={form.discountType === "Percentage" ? "e.g. 15" : "e.g. 100"}
                      required
                    />
                  </div>

                  <div className="field">
                    <label>Minimum Order Value (₹)</label>
                    <input
                      className="input"
                      type="number"
                      min="0"
                      value={form.minOrder}
                      onChange={(e) =>
                        setForm({ ...form, minOrder: e.target.value })
                      }
                      placeholder="e.g. 499 (0 for no minimum)"
                    />
                  </div>

                  <div className="field full">
                    <label>Coupon Title</label>
                    <input
                      className="input"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      placeholder="e.g. 15% Welcome Offer"
                    />
                  </div>

                  <div className="field full">
                    <label>Description / Conditions</label>
                    <textarea
                      className="input textarea"
                      rows="2"
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      placeholder="e.g. Save ₹100 on orders above ₹499"
                    />
                  </div>

                  <div className="field full">
                    <label>Status</label>
                    <select
                      className="select"
                      value={form.status}
                      onChange={(e) =>
                        setForm({ ...form, status: e.target.value })
                      }
                    >
                      <option value="Active">Active (Available for checkout)</option>
                      <option value="Inactive">Inactive (Disabled)</option>
                    </select>
                  </div>
                </div>

                <div className="coupon-modal-footer">
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn"
                    disabled={submitting}
                  >
                    <FiCheck />
                    {submitting ? "Saving..." : editingCoupon ? "Update Coupon" : "Create Coupon"}
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

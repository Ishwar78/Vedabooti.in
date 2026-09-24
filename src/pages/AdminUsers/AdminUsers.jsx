import React, { useState, useEffect } from "react";
import { FiUsers, FiSearch, FiTrash2, FiRefreshCw, FiCheckCircle, FiSlash } from "react-icons/fi";
import AdminShell from "../../components/AdminShell";
import api from "../../lib/api";
import "./AdminUsers.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/auth/users");
      if (res && res.users) {
        setUsers(res.users);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    try {
      const res = await api.patch(`/api/auth/users/${user._id}/status`);
      if (res && res.status) {
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, status: res.status } : u))
        );
      }
    } catch (err) {
      alert(err.message || "Failed to toggle user status.");
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to delete user "${user.name}" (${user.email})?`)) {
      return;
    }
    try {
      await api.delete(`/api/auth/users/${user._id}`);
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
      alert("User deleted successfully.");
    } catch (err) {
      alert(err.message || "Failed to delete user.");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = `${u.name} ${u.email} ${u.phone || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = users.filter((u) => u.status === "Active").length;

  return (
    <AdminShell>
      <div className="admin-page users-page">
        <div className="admin-page-head">
          <div>
            <span className="admin-kicker">CUSTOMER MANAGEMENT</span>
            <h1>Registered Users</h1>
            <p>Manage verified customer accounts, registrations, and account status.</p>
          </div>
          <button
            className="gold-btn"
            onClick={fetchUsers}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <FiRefreshCw className={loading ? "spin" : ""} /> Refresh
          </button>
        </div>

        <div className="user-stats">
          <div>
            <FiUsers />
            <strong>{users.length}</strong>
            <span>Total Customers</span>
          </div>
          <div>
            <FiCheckCircle style={{ color: "#22c55e" }} />
            <strong style={{ color: "#22c55e" }}>{activeCount}</strong>
            <span>Active Customers</span>
          </div>
          <div>
            <FiSlash style={{ color: "#ef4444" }} />
            <strong style={{ color: "#ef4444" }}>{users.length - activeCount}</strong>
            <span>Blocked / Suspended</span>
          </div>
        </div>

        <div className="admin-toolbar" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div className="admin-search" style={{ flex: 1 }}>
            <FiSearch />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or phone..."
            />
          </div>

          <select
            className="select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              height: "42px",
              padding: "0 12px",
              background: "#061810",
              color: "#e2ede6",
              border: "1px solid #1c4a33",
              borderRadius: "8px",
              outline: "none",
            }}
          >
            <option value="All">All Status</option>
            <option value="Active">Active Only</option>
            <option value="Blocked">Blocked Only</option>
          </select>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Registered On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "35px", color: "#8da496" }}>
                    <FiRefreshCw className="spin" size={24} />
                    <p style={{ marginTop: "10px" }}>Loading customer accounts...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "35px", color: "#8da496" }}>
                    No registered customers found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <strong style={{ color: "#fff", display: "block" }}>{u.name}</strong>
                      <small style={{ color: "#8ea296" }}>{u.email}</small>
                    </td>
                    <td>{u.phone || "—"}</td>
                    <td>{new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td>
                      <span
                        className={`status-badge ${u.status.toLowerCase()}`}
                        onClick={() => handleToggleStatus(u)}
                        style={{ cursor: "pointer" }}
                        title="Click to toggle status"
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="action-buttons">
                      <button
                        className="danger"
                        onClick={() => handleDeleteUser(u)}
                        title="Delete User"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
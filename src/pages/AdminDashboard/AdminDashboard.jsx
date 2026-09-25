import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiShoppingBag,
  FiPackage,
  FiGrid,
  FiMessageCircle,
  FiArrowUpRight,
  FiUsers,
  FiDollarSign,
  FiRotateCcw,
  FiRefreshCw,
  FiTag,
  FiImage,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiTrendingUp,
} from "react-icons/fi";
import AdminShell from "../../components/AdminShell";
import api from "../../lib/api";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalTickets: 0,
    openTickets: 0,
    pendingReturns: 0,
    fulfillmentRate: 100,
    inStockRate: 100,
    supportRate: 100,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/dashboard-stats");
      if (res?.success) {
        if (res.stats) setStats(res.stats);
        if (Array.isArray(res.recentOrders)) setRecentOrders(res.recentOrders);
      }
    } catch (err) {
      console.error("Dashboard stats fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <AdminShell>
      <div className="admin-page dashboard-page">
        {/* Header */}
        <div className="admin-head">
          <div>
            <span className="eyebrow">Veda Booti Admin</span>
            <h1>Live Store Dashboard</h1>
            <p>Real-time analytics, inventory counts, and live customer orders.</p>
          </div>
          <div className="admin-head-actions">
            <button
              type="button"
              className="dashboard-refresh-btn"
              onClick={fetchDashboardData}
              title="Refresh Dashboard"
            >
              <FiRefreshCw className={loading ? "spin" : ""} /> Refresh
            </button>
            <Link className="btn" to="/admin/products">
              <FiPackage /> Manage Products
            </Link>
          </div>
        </div>

        {/* 6 Key Stats Grid */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="stat-card-icon icon-orders">
              <FiShoppingBag />
            </div>
            <div className="stat-card-body">
              <b>{stats.totalOrders}</b>
              <small>Total Orders</small>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-card-icon icon-revenue">
              <FiDollarSign />
            </div>
            <div className="stat-card-body">
              <b>₹{stats.totalRevenue.toLocaleString("en-IN")}</b>
              <small>Total Revenue</small>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-card-icon icon-products">
              <FiPackage />
            </div>
            <div className="stat-card-body">
              <b>{stats.totalProducts}</b>
              <small>Active Products</small>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-card-icon icon-categories">
              <FiGrid />
            </div>
            <div className="stat-card-body">
              <b>{stats.totalCategories}</b>
              <small>Categories</small>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-card-icon icon-users">
              <FiUsers />
            </div>
            <div className="stat-card-body">
              <b>{stats.totalUsers}</b>
              <small>Registered Users</small>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-card-icon icon-returns">
              <FiRotateCcw />
            </div>
            <div className="stat-card-body">
              <b>{stats.pendingReturns}</b>
              <small>Pending Returns</small>
            </div>
          </div>
        </div>

        {/* Panels */}
        <div className="admin-panels">
          {/* Recent Live Orders */}
          <section className="admin-panel orders-panel">
            <div className="panel-title">
              <div>
                <h2>Recent Orders</h2>
                <span className="panel-sub">Live purchases from real customers</span>
              </div>
              <Link to="/admin/orders" className="panel-view-all">
                <span>View All Orders</span>
                <FiArrowUpRight />
              </Link>
            </div>

            {loading ? (
              <div className="panel-loading">
                <FiRefreshCw className="spin" size={24} />
                <p>Loading recent orders...</p>
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="panel-empty">
                <FiShoppingBag size={36} style={{ color: "#d8b56a", opacity: 0.6 }} />
                <h3>No Customer Orders Yet</h3>
                <p>Orders will show here in real-time as customers complete checkout.</p>
              </div>
            ) : (
              <div className="recent-orders-list">
                {recentOrders.map((o) => {
                  const summary =
                    o.items?.map((it) => `${it.name} × ${it.qty || 1}`).join(", ") ||
                    "Ayurvedic Items";
                  const dateStr = o.createdAt
                    ? new Date(o.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      })
                    : "Recent";

                  return (
                    <div className="recent-order-row" key={o._id || o.orderId}>
                      <div className="order-id-col">
                        <strong className="order-id-txt">{o.orderId}</strong>
                        <small className="order-date-txt">{dateStr}</small>
                      </div>
                      <div className="order-cust-col">
                        <span className="cust-name-txt">{o.customer?.name || "Customer"}</span>
                        <p className="order-items-preview">{summary}</p>
                      </div>
                      <div className="order-amt-col">
                        <b>₹{o.grandTotal}</b>
                      </div>
                      <div className="order-status-col">
                        <span className={`status-badge ${(o.status || "").toLowerCase()}`}>
                          {o.status || "Confirmed"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Store Health & Shortcuts */}
          <div className="dashboard-side-panels">
            {/* Store Health */}
            <section className="admin-panel health-panel">
              <div className="panel-title">
                <h2>Store Health</h2>
              </div>
              <div className="progress-group">
                <div className="progress-label">
                  <span>Order Fulfillment</span>
                  <b>{stats.fulfillmentRate}%</b>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${stats.fulfillmentRate}%` }}
                  />
                </div>
              </div>

              <div className="progress-group">
                <div className="progress-label">
                  <span>Inventory In Stock</span>
                  <b>{stats.inStockRate}%</b>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill gold"
                    style={{ width: `${stats.inStockRate}%` }}
                  />
                </div>
              </div>

              <div className="progress-group">
                <div className="progress-label">
                  <span>Support Resolution SLA</span>
                  <b>{stats.supportRate}%</b>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill blue"
                    style={{ width: `${stats.supportRate}%` }}
                  />
                </div>
              </div>
            </section>

            {/* Quick Actions Shortcuts */}
            <section className="admin-panel shortcuts-panel">
              <div className="panel-title">
                <h2>Quick Navigation</h2>
              </div>
              <div className="shortcuts-grid">
                <Link to="/admin/coupons" className="shortcut-btn">
                  <FiTag />
                  <span>Coupons</span>
                </Link>
                <Link to="/admin/hero" className="shortcut-btn">
                  <FiImage />
                  <span>Hero Banners</span>
                </Link>
                <Link to="/admin/return-requests" className="shortcut-btn">
                  <FiRotateCcw />
                  <span>Returns ({stats.pendingReturns})</span>
                </Link>
                <Link to="/admin/support" className="shortcut-btn">
                  <FiMessageCircle />
                  <span>Support</span>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
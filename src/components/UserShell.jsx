import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiUser,
  FiPackage,
  FiHeart,
  FiMapPin,
  FiLifeBuoy,
  FiLogOut,
  FiMenu,
  FiX,
  FiShoppingBag
} from "react-icons/fi";

import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import api from "../lib/api";
import { syncCartToBackend, dispatchStorageUpdate } from "../lib/cartWishlist";
import "./UserShell.css";

const USER_NAV_ITEMS = [
  { to: "/user", label: "Overview", icon: FiGrid },
  { to: "/profile", label: "Profile Details", icon: FiUser },
  { to: "/orders", label: "My Orders", icon: FiPackage },
  { to: "/addresses", label: "Saved Addresses", icon: FiMapPin },
  { to: "/wishlist", label: "My Wishlist", icon: FiHeart },
  { to: "/support", label: "Help & Support", icon: FiLifeBuoy }
];

export default function UserShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("userToken");
    if (!token) return;

    api.get("/api/auth/me")
      .then((res) => {
        if (res?.success && res.user) {
          setUser(res.user);
          localStorage.setItem("user", JSON.stringify(res.user));
        }
      })
      .catch(() => {});
  }, []);

  const isCurrentActive = (path) => {
    if (
      path === "/orders" &&
      location.pathname.startsWith("/order-details")
    ) {
      return true;
    }

    return location.pathname === path;
  };

  // ================= LOGOUT =================
  const handleLogout = async () => {
    // Sync cart to backend before logout so it is preserved in user's account
    try {
      await syncCartToBackend();
    } catch {}

    // Remove common login/session data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userToken");
    localStorage.removeItem("authToken");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("vb_cart"); // clear local cart on logout

    // Close mobile sidebar
    setMobileOpen(false);

    // Notify other components
    dispatchStorageUpdate();
    window.dispatchEvent(new Event("storage"));

    // Redirect to login
    navigate("/login");
  };

  return (
    <div className="user-shell-wrapper">

      <SiteHeader />

      <div className="user-shell-body container">

        {/* ================= USER SIDEBAR ================= */}
        <aside
          className={`user-sidebar ${
            mobileOpen ? "open" : ""
          }`}
        >

          {/* Sidebar Header */}
          <div className="user-sidebar-head">

            <div className="user-avatar-badge">
              <FiUser />
            </div>

            <div className="user-sidebar-profile">
              <b>{user?.name || "Customer"}</b>
              <small>{user?.email || "My Account"}</small>
            </div>

            <button
              type="button"
              className="user-sidebar-close"
              onClick={() => setMobileOpen(false)}
              aria-label="Close account menu"
            >
              <FiX />
            </button>

          </div>

          {/* Navigation */}
          <nav className="user-sidebar-nav">

            {USER_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isCurrentActive(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`user-nav-link ${
                    active ? "active" : ""
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon className="nav-icon" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

          </nav>

          {/* Sidebar Footer */}
          <div className="user-sidebar-foot">

            {/* Browse Products */}
            <Link
              to="/shop"
              className="user-foot-link"
              onClick={() => setMobileOpen(false)}
            >
              <FiShoppingBag />
              <span>Browse Products</span>
            </Link>

            {/* Logout */}
            <button
              type="button"
              className="user-foot-link logout"
              onClick={handleLogout}
            >
              <FiLogOut />
              <span>Logout</span>
            </button>

          </div>

        </aside>

        {/* ================= MOBILE BACKDROP ================= */}
        {mobileOpen && (
          <div
            className="user-sidebar-backdrop"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* ================= MAIN CONTENT ================= */}
        <main className="user-main-content">

          {/* Mobile Account Menu */}
          <div className="user-mobile-topbar">

            <button
              type="button"
              className="user-mobile-toggle"
              onClick={() => setMobileOpen(true)}
            >
              <FiMenu />
              <span>Account Menu</span>
            </button>

          </div>

          {children}

        </main>

      </div>

      <SiteFooter />

    </div>
  );
}
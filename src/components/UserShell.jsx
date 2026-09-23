import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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

  const isCurrentActive = (path) => {
    if (path === "/orders" && location.pathname.startsWith("/order-details")) {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <div className="user-shell-wrapper">
      <SiteHeader />

      <div className="user-shell-body container">
        {/* Persistent User Sidebar */}
        <aside className={`user-sidebar ${mobileOpen ? "open" : ""}`}>
          <div className="user-sidebar-head">
            <div className="user-avatar-badge">
              <FiUser />
            </div>
            <div className="user-sidebar-profile">
              <b>Wellness Lover</b>
              <small>customer@example.com</small>
            </div>
            <button
              type="button"
              className="user-sidebar-close"
              onClick={() => setMobileOpen(false)}
            >
              <FiX />
            </button>
          </div>

          <nav className="user-sidebar-nav">
            {USER_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isCurrentActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`user-nav-link ${active ? "active" : ""}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon className="nav-icon" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="user-sidebar-foot">
            <Link to="/shop" className="user-foot-link">
              <FiShoppingBag />
              <span>Browse Products</span>
            </Link>
            <Link to="/" className="user-foot-link logout">
              <FiLogOut />
              <span>Back to Store</span>
            </Link>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {mobileOpen && (
          <div
            className="user-sidebar-backdrop"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Content Area */}
        <main className="user-main-content">
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

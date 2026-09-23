import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiGrid,
  FiPackage,
  FiShoppingBag,
  FiMessageCircle,
  FiImage,
  FiMenu,
  FiX,
  FiLogOut,
  FiMail,
  FiUsers,
  FiStar,
  FiEdit3,
  FiVideo,
  FiRotateCcw,
} from "react-icons/fi";
import "./AdminShell.css";

export default function AdminShell({ children }) {
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  const items = [
    ["/admin", "Dashboard", FiHome],
    ["/admin/categories", "Categories", FiGrid],
    ["/admin/products", "Products", FiPackage],
    ["/admin/orders", "Orders", FiShoppingBag],
    ["/admin/support", "Support", FiMessageCircle],
    ["/admin/hero", "Home Hero", FiImage],

    
    ["/admin/contact", "Contact", FiMail],
    ["/admin/inquiry", "Inquiry", FiMessageCircle],
    ["/admin/users", "Users", FiUsers],
    ["/admin/reviews", "Reviews", FiStar],
    ["/admin/create-review", "Create Review", FiEdit3],
    ["/admin/videos", "Videos", FiVideo],
    ["/admin/return-requests", "Return Request", FiRotateCcw],
  ];

  return (
    <div className="admin-shell">

      {/* Sidebar */}
      <aside className={open ? "admin-side open" : "admin-side"}>

        {/* Brand */}
        <div className="admin-brand">
          <img
            src="/assets/veda-booti-logo.png"
            alt="Veda Booti"
          />

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            <FiX />
          </button>
        </div>

        {/* Sidebar Links */}
        <div className="admin-links">

          {items.map(([to, label, Icon]) => (
            <Link
              className={loc.pathname === to ? "active" : ""}
              to={to}
              key={to}
              onClick={() => setOpen(false)}
            >
              <Icon />
              <span>{label}</span>
            </Link>
          ))}

        </div>

        {/* Logout */}
        <Link
          className="logout"
          to="/admin-login"
          onClick={() => setOpen(false)}
        >
          <FiLogOut />
          <span>Logout</span>
        </Link>

      </aside>

      {/* Main Content */}
      <main className="admin-content">

        <button
          className="admin-menu"
          onClick={() => setOpen(true)}
          aria-label="Open sidebar"
        >
          <FiMenu />
        </button>

        {children}

      </main>

    </div>
  );
}
import React from "react";
import { Link } from "react-router-dom";
import { FiPackage, FiHeart, FiMapPin, FiUser, FiLifeBuoy, FiArrowRight } from "react-icons/fi";
import UserShell from "../../components/UserShell";
import { getWishlistCount } from "../../lib/cartWishlist";
import "./UserDashboard.css";

export default function UserDashboard() {
  const orders = JSON.parse(localStorage.getItem("vb_orders") || "[]");
  const wishlistCount = getWishlistCount();

  return (
    <UserShell>
      <div className="user-overview">
        <div className="user-top">
          <div>
            <span className="eyebrow">My Account</span>
            <h1>Hello, Wellness Lover</h1>
            <p>Manage your Veda Booti orders, addresses, and wishlist from one place.</p>
          </div>
          <Link className="btn" to="/shop">
            Continue Shopping
          </Link>
        </div>

        <div className="stats">
          <div>
            <FiPackage />
            <b>{orders.length || 3}</b>
            <small>Total Orders</small>
          </div>
          <div>
            <FiHeart />
            <b>{wishlistCount}</b>
            <small>Wishlist Items</small>
          </div>
          <div>
            <FiMapPin />
            <b>2</b>
            <small>Saved Addresses</small>
          </div>
        </div>

        <div className="dash-grid">
          <Link to="/orders" className="dash-card">
            <FiPackage />
            <h3>My Orders</h3>
            <p>Track your recent orders and delivery status.</p>
            <span className="dash-link-arrow">
              View Orders <FiArrowRight />
            </span>
          </Link>

          <Link to="/profile" className="dash-card">
            <FiUser />
            <h3>Profile Details</h3>
            <p>Update your personal information and contact details.</p>
            <span className="dash-link-arrow">
              Edit Profile <FiArrowRight />
            </span>
          </Link>

          <Link to="/addresses" className="dash-card">
            <FiMapPin />
            <h3>Saved Addresses</h3>
            <p>Manage home and office delivery addresses.</p>
            <span className="dash-link-arrow">
              Manage Addresses <FiArrowRight />
            </span>
          </Link>

          <Link to="/support" className="dash-card">
            <FiLifeBuoy />
            <h3>Help & Support</h3>
            <p>Need help with your order? Reach our wellness experts.</p>
            <span className="dash-link-arrow">
              Get Help <FiArrowRight />
            </span>
          </Link>
        </div>
      </div>
    </UserShell>
  );
}
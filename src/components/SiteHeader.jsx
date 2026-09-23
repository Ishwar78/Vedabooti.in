import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiUser, FiHeart, FiShoppingBag, FiMenu, FiX } from "react-icons/fi";
import { getCartCount, getWishlistCount, subscribeToStorage } from "../lib/cartWishlist";
import "./SiteHeader.css";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const updateCounts = () => {
      setCartCount(getCartCount());
      setWishlistCount(getWishlistCount());
    };
    updateCounts();
    return subscribeToStorage(updateCounts);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <>
      <header className="site-header fixed-header">
        <div className="top-strip">
          <span>✦ Free Shipping on Orders Above ₹499</span>
          <span>◉ 100% Natural & Ayurvedic</span>
          <span>◈ COD Available | Easy Returns</span>
        </div>
        <div className="nav-wrap">
          <Link className="brand" to="/">
            <img src="/assets/veda-booti-logo.png" alt="Veda Booti" />
          </Link>
          <button className="mobile-menu" onClick={() => setOpen((v) => !v)}>
            {open ? <FiX /> : <FiMenu />}
          </button>
          <nav className={open ? "main-nav open" : "main-nav"}>
            <Link to="/" onClick={() => setOpen(false)}>Home</Link>
            <Link to="/shop" onClick={() => setOpen(false)}>Shop</Link>
            <Link to="/categories" onClick={() => setOpen(false)}>Categories</Link>
            <Link to="/about" onClick={() => setOpen(false)}>About Us</Link>
            <Link to="/support" onClick={() => setOpen(false)}>Contact</Link>
          </nav>
          <form className="search-box" onSubmit={submit}>
            <FiSearch />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for products..."
            />
          </form>
          <div className="nav-actions">
            <Link to="/user" aria-label="Account" title="My Account">
              <FiUser />
            </Link>
            <Link to="/wishlist" aria-label="Wishlist" title="Wishlist">
              <FiHeart />
              {wishlistCount > 0 && <b className="wishlist-count">{wishlistCount}</b>}
            </Link>
            <Link to="/cart" aria-label="Cart" title="Cart">
              <FiShoppingBag />
              {cartCount > 0 && <b className="cart-count">{cartCount}</b>}
            </Link>
          </div>
        </div>
      </header>
      <div className="header-spacer" />
    </>
  );
}

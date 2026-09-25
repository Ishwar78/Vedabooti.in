import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiUser, FiHeart, FiShoppingBag, FiMenu, FiX } from "react-icons/fi";
import { getCartCount, getWishlistCount, subscribeToStorage, restoreUserCartFromBackend } from "../lib/cartWishlist";
import "./SiteHeader.css";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // If user is logged in, ensure cart is restored from database
    if (localStorage.getItem("token") || localStorage.getItem("userToken")) {
      restoreUserCartFromBackend();
    }

    const updateCounts = () => {
      setCartCount(getCartCount());
      setWishlistCount(getWishlistCount());
      try {
        const u = localStorage.getItem("user");
        setCurrentUser(u ? JSON.parse(u) : null);
      } catch {
        setCurrentUser(null);
      }
    };
    updateCounts();
    window.addEventListener("storage", updateCounts);
    const unsub = subscribeToStorage(updateCounts);
    return () => {
      window.removeEventListener("storage", updateCounts);
      if (unsub) unsub();
    };
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q.trim())}`);
      setMobileSearchOpen(false);
      setOpen(false);
    }
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
          <nav className="main-nav desktop-nav">
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/categories">Categories</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
          </nav>
          <form className="search-box desktop-search" onSubmit={submit}>
            <button type="submit" className="search-icon-btn" aria-label="Search">
              <FiSearch />
            </button>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for products..."
            />
            {q && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setQ("")}
                aria-label="Clear search"
              >
                <FiX />
              </button>
            )}
          </form>
          <div className="nav-actions">
            <button
              type="button"
              className="mobile-search-toggle"
              onClick={() => {
                setMobileSearchOpen((v) => !v);
                setOpen(false);
              }}
              aria-label="Search"
              title="Search"
            >
              {mobileSearchOpen ? <FiX /> : <FiSearch />}
            </button>
            <Link
              to={currentUser ? "/user" : "/login"}
              aria-label={currentUser ? "My Account" : "Sign In"}
              title={currentUser ? `Account: ${currentUser.name || currentUser.email}` : "Sign In / Register"}
              style={{ position: "relative" }}
            >
              <FiUser />
              {currentUser && (
                <span
                  style={{
                    position: "absolute",
                    top: "3px",
                    right: "3px",
                    width: "8px",
                    height: "8px",
                    backgroundColor: "#22c55e",
                    borderRadius: "50%",
                    border: "2px solid #061810",
                  }}
                  title="Signed In"
                />
              )}
            </Link>
            <Link to="/wishlist" aria-label="Wishlist" title="Wishlist">
              <FiHeart />
              {wishlistCount > 0 && <b className="wishlist-count">{wishlistCount}</b>}
            </Link>
            <Link to="/cart" aria-label="Cart" title="Cart">
              <FiShoppingBag />
              {cartCount > 0 && <b className="cart-count">{cartCount}</b>}
            </Link>
            {/* Mobile Hamburger Menu button strictly at the far right on mobile, never in center */}
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => {
                setOpen((v) => !v);
                setMobileSearchOpen(false);
              }}
              aria-label={open ? "Close menu" : "Open menu"}
              title={open ? "Close menu" : "Open menu"}
            >
              {open ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer (Opens full width cleanly below the bar) */}
        {open && (
          <nav className="mobile-nav-drawer" aria-label="Mobile Navigation">
            <div className="mobile-nav-links">
              <Link to="/" onClick={() => setOpen(false)}>
                <span>Home</span>
              </Link>
              <Link to="/shop" onClick={() => setOpen(false)}>
                <span>Shop</span>
              </Link>
              <Link to="/categories" onClick={() => setOpen(false)}>
                <span>Categories</span>
              </Link>
              <Link to="/about" onClick={() => setOpen(false)}>
                <span>About Us</span>
              </Link>
              <Link to="/contact" onClick={() => setOpen(false)}>
                <span>Contact</span>
              </Link>
            </div>
          </nav>
        )}

        {/* Mobile Search Drawer (Opens when user clicks search icon in mobile view) */}
        {mobileSearchOpen && (
          <form className="mobile-search-bar" onSubmit={submit}>
            <div className="mobile-search-inner">
              <FiSearch className="mobile-search-icon" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search authentic Ayurvedic herbs, combos..."
                autoFocus
              />
              {q && (
                <button
                  type="button"
                  className="mobile-search-clear"
                  onClick={() => setQ("")}
                  aria-label="Clear search text"
                >
                  <FiX />
                </button>
              )}
              <button type="submit" className="mobile-search-go">
                Search
              </button>
            </div>
          </form>
        )}
      </header>
      <div className={`header-spacer ${mobileSearchOpen ? "has-search" : ""}`} />
    </>
  );
}

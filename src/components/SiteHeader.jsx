import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiUser, FiHeart, FiShoppingBag, FiMenu, FiX } from "react-icons/fi";
import { getCartCount, getWishlistCount, subscribeToStorage, restoreUserCartFromBackend } from "../lib/cartWishlist";
import "./SiteHeader.css";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
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
            <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
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
          </div>
        </div>
      </header>
      <div className="header-spacer" />
    </>
  );
}

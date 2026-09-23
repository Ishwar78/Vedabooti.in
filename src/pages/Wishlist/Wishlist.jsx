import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiTrash2, FiShoppingBag, FiHeart, FiArrowRight } from "react-icons/fi";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import {
  getWishlist,
  removeFromWishlist,
  addToCart,
  subscribeToStorage
} from "../../lib/cartWishlist";
import "./Wishlist.css";

export default function Wishlist() {
  const [items, setItems] = useState([]);
  const nav = useNavigate();

  const refreshWishlist = () => {
    setItems(getWishlist());
  };

  useEffect(() => {
    refreshWishlist();
    return subscribeToStorage(refreshWishlist);
  }, []);

  const handleRemove = (id) => {
    const updated = removeFromWishlist(id);
    setItems(updated);
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    nav("/cart");
  };

  return (
    <div>
      <SiteHeader />
      <main className="wishlist-page container">
        <div className="wishlist-head">
          <div>
            <span className="eyebrow">Saved For Later</span>
            <h1>My Wishlist ({items.length})</h1>
          </div>
          {items.length > 0 && (
            <Link to="/shop" className="btn dark">
              Continue Shopping
            </Link>
          )}
        </div>

        {items.length > 0 ? (
          <div className="wishlist-grid">
            {items.map((item) => (
              <article className="wish-card" key={item.id}>
                <div className="wish-media">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="wish-img"
                    />
                  ) : (
                    <div className="wish-placeholder">
                      <span>Veda Booti</span>
                    </div>
                  )}
                  <button
                    type="button"
                    className="wish-remove-icon-btn"
                    onClick={() => handleRemove(item.id)}
                    aria-label="Remove from Wishlist"
                    title="Remove from Wishlist"
                  >
                    <FiTrash2 />
                  </button>
                </div>

                <div className="wish-body">
                  <Link
                    to={`/product/${item.slug || "ashwagandha-powder"}`}
                    className="wish-title"
                  >
                    <h3>{item.name}</h3>
                  </Link>
                  <p>{item.subtitle}</p>

                  <div className="wish-price-row">
                    <span className="wish-price">₹{item.price}</span>
                    {item.old && (
                      <span className="wish-old">₹{item.old}</span>
                    )}
                  </div>

                  <div className="wish-actions">
                    <button
                      type="button"
                      className="btn wish-add-btn"
                      onClick={() => handleAddToCart(item)}
                    >
                      <FiShoppingBag />
                      <span>Move to Cart</span>
                    </button>
                    <button
                      type="button"
                      className="wish-remove-btn"
                      onClick={() => handleRemove(item.id)}
                    >
                      <FiTrash2 /> Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="wish-empty">
            <FiHeart
              style={{
                fontSize: "44px",
                color: "#e11d48",
                marginBottom: "14px"
              }}
            />
            <h2>Your wishlist is waiting</h2>
            <p>Save items you want to revisit and purchase later.</p>
            <Link className="btn" to="/shop">
              Explore Products
              <FiArrowRight style={{ marginLeft: "6px" }} />
            </Link>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
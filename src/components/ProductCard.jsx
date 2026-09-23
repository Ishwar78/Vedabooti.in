import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiHeart, FiShoppingBag, FiZap } from "react-icons/fi";
import {
  addToCart,
  isInWishlist,
  toggleWishlist,
  setDirectCheckoutItem,
  subscribeToStorage
} from "../lib/cartWishlist";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const nav = useNavigate();
  const [wished, setWished] = useState(false);

  useEffect(() => {
    setWished(isInWishlist(product.id));
    return subscribeToStorage(() => {
      setWished(isInWishlist(product.id));
    });
  }, [product.id]);

  const handleCardClick = () => {
    nav(`/product/${product.slug}`, { state: { product } });
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    nav("/cart");
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    const item = { ...product, qty: 1 };
    setDirectCheckoutItem(item);
    nav("/checkout", { state: { directItem: item } });
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    const res = toggleWishlist(product);
    setWished(res.added);
  };

  return (
    <article className="product-card" onClick={handleCardClick}>
      <div className="pc-media">
        <span className="badge">{product.tag || "Bestseller"}</span>
        <button
          type="button"
          className={`pc-heart ${wished ? "active" : ""}`}
          onClick={handleWishlist}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          title={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <FiHeart style={{ fill: wished ? "currentColor" : "none" }} />
        </button>

        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="product-real-img"
          />
        ) : (
          <div
            className="product-visual"
            style={{ "--accent": product.accent || "#5e8f4b" }}
          >
            <div className="jar-cap"></div>
            <div className="jar">
              <b>
                Veda<br />Booti
              </b>
              <small>{product.name}</small>
              <i>{product.short || "Herbal Care"}</i>
            </div>
            <span className="leaf l1">✦</span>
            <span className="leaf l2">✦</span>
          </div>
        )}
      </div>

      <div className="pc-body">
        <Link
          to={`/product/${product.slug}`}
          state={{ product }}
          className="pc-name"
          onClick={(e) => e.stopPropagation()}
        >
          {product.name}
        </Link>
        <small>{product.subtitle}</small>

        <div className="stars">
          ★★★★★ <em>{product.rating}</em>
        </div>

        <div className="price-row">
          <span className="price">₹{product.price}</span>
          <span className="old-price">₹{product.old}</span>
        </div>

        <div className="pc-actions">
          <button
            type="button"
            className="pc-btn add-btn"
            onClick={handleAddToCart}
            title="Add to Cart"
          >
            <FiShoppingBag />
            <span>Add to Cart</span>
          </button>
          <button
            type="button"
            className="pc-btn buy-btn"
            onClick={handleBuyNow}
            title="Buy Now"
          >
            <FiZap />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </article>
  );
}

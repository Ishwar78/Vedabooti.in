import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiHeart, FiShoppingBag, FiZap, FiCheck } from "react-icons/fi";
import {
  addToCart,
  isInWishlist,
  toggleWishlist,
  setDirectCheckoutItem,
  subscribeToStorage
} from "../lib/cartWishlist";
import { getProductImageUrl } from "../lib/api";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const nav = useNavigate();
  const [wished, setWished] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const productId = product._id || product.id || product.slug;

  useEffect(() => {
    setWished(isInWishlist(productId));
    return subscribeToStorage(() => {
      setWished(isInWishlist(productId));
    });
  }, [productId]);

  const handleCardClick = () => {
    nav(`/product/${product.slug}`, { state: { product } });
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
    }, 1800);
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
        <span className="badge">{product.discount || product.tag || "Bestseller"}</span>
        <button
          type="button"
          className={`pc-heart ${wished ? "active" : ""}`}
          onClick={handleWishlist}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          title={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <FiHeart style={{ fill: wished ? "currentColor" : "none" }} />
        </button>

        {(product.image || (product.images && product.images[0])) ? (
          <img
            src={getProductImageUrl(product.image || product.images[0])}
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
          {(product.oldPrice || product.old) && Number(product.oldPrice || product.old) > Number(product.price) && (
            <span className="old-price">₹{product.oldPrice || product.old}</span>
          )}
          {product.discount && (
            <span
              style={{
                marginLeft: "auto",
                fontSize: "11px",
                color: "#22c55e",
                background: "rgba(34, 197, 94, 0.12)",
                padding: "2px 6px",
                borderRadius: "4px",
                fontWeight: 600,
              }}
            >
              {product.discount}
            </span>
          )}
        </div>

        <div className="pc-actions">
          <button
            type="button"
            className={`pc-btn add-btn ${addedToCart ? "added" : ""}`}
            onClick={handleAddToCart}
            title={addedToCart ? "Added to Cart!" : "Add to Cart"}
            style={
              addedToCart
                ? {
                    background: "#166534",
                    borderColor: "#22c55e",
                    color: "#86efac",
                  }
                : {}
            }
          >
            {addedToCart ? <FiCheck /> : <FiShoppingBag />}
            <span>{addedToCart ? "Added!" : "Add to Cart"}</span>
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

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowRight } from "react-icons/fi";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import {
  getCart,
  updateCartQty,
  removeFromCart,
  clearDirectCheckoutItem,
  subscribeToStorage
} from "../../lib/cartWishlist";
import "./Cart.css";

export default function Cart() {
  const [items, setItems] = useState([]);
  const nav = useNavigate();

  const refreshCart = () => {
    setItems(getCart());
  };

  useEffect(() => {
    refreshCart();
    return subscribeToStorage(refreshCart);
  }, []);

  const total = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.qty || 1),
    0
  );

  const handleQtyChange = (index, delta) => {
    const updated = updateCartQty(index, delta);
    setItems(updated);
  };

  const handleRemove = (index) => {
    const updated = removeFromCart(index);
    setItems(updated);
  };

  const handleProceedToCheckout = () => {
    clearDirectCheckoutItem();
    nav("/checkout");
  };

  return (
    <div>
      <SiteHeader />
      <main className="cart-page container">
        <div className="page-title">
          <span className="eyebrow">Your Bag</span>
          <h1>Shopping Cart</h1>
        </div>

        {items.length > 0 ? (
          <div className="cart-layout">
            <div className="cart-items-list">
              {items.map((p, i) => (
                <article className="cart-item" key={p.id || i}>
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="cart-item-img" />
                  ) : (
                    <div className="mini-jar">
                      <span>
                        Veda
                        <br />
                        Booti
                      </span>
                    </div>
                  )}

                  <div className="cart-info">
                    <Link to={`/product/${p.slug || "ashwagandha-powder"}`}>
                      <h3>{p.name}</h3>
                    </Link>
                    <p>{p.subtitle}</p>
                    <b>₹{p.price}</b>
                  </div>

                  <div className="cart-qty">
                    <button
                      type="button"
                      onClick={() => handleQtyChange(i, -1)}
                      aria-label="Decrease quantity"
                    >
                      <FiMinus />
                    </button>
                    <b>{p.qty || 1}</b>
                    <button
                      type="button"
                      onClick={() => handleQtyChange(i, 1)}
                      aria-label="Increase quantity"
                    >
                      <FiPlus />
                    </button>
                  </div>

                  <button
                    type="button"
                    className="icon-btn cart-remove-btn"
                    onClick={() => handleRemove(i)}
                    aria-label="Remove item"
                    title="Remove item"
                  >
                    <FiTrash2 />
                  </button>
                </article>
              ))}
            </div>

            <aside className="summary">
              <h2>Order Summary</h2>
              <div>
                <span>Subtotal ({items.reduce((s, x) => s + (x.qty || 1), 0)} items)</span>
                <b>₹{total}</b>
              </div>
              <div>
                <span>Shipping</span>
                <b>{total >= 499 ? "FREE" : "₹49"}</b>
              </div>
              <hr />
              <div className="grand">
                <span>Total</span>
                <b>₹{total + (total >= 499 ? 0 : 49)}</b>
              </div>
              <button
                type="button"
                className="btn checkout-btn"
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout
                <FiArrowRight />
              </button>
              <Link to="/shop" className="continue-shop">
                ← Continue Shopping
              </Link>
            </aside>
          </div>
        ) : (
          <div className="empty">
            <FiShoppingBag style={{ fontSize: "44px", color: "var(--gold2)", marginBottom: "15px" }} />
            <h2>Your cart is empty</h2>
            <p>Add authentic Ayurvedic remedies to your wellness routine.</p>
            <Link className="btn" to="/shop">
              Shop Products
            </Link>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
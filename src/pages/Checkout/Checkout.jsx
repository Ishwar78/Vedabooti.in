import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiLock, FiCheckCircle, FiTag, FiX, FiShield, FiTruck } from "react-icons/fi";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import {
  getCart,
  clearCart,
  getDirectCheckoutItem,
  clearDirectCheckoutItem
} from "../../lib/cartWishlist";
import "./Checkout.css";

const AVAILABLE_COUPONS = [
  {
    code: "VEDA10",
    title: "10% Flat Discount",
    desc: "10% off on all products",
    discountPercent: 10,
    minOrder: 0
  },
  {
    code: "AYURVEDA50",
    title: "Flat ₹50 OFF",
    desc: "Save ₹50 on orders above ₹499",
    flatDiscount: 50,
    minOrder: 499
  },
  {
    code: "FIRSTBUY",
    title: "15% Special Welcome",
    desc: "15% off for first-time wellness buyers",
    discountPercent: 15,
    minOrder: 0
  },
  {
    code: "GOLD500",
    title: "Flat ₹500 Mega Saving",
    desc: "Save ₹500 on orders above ₹2,000",
    flatDiscount: 500,
    minOrder: 2000
  }
];

export default function Checkout() {
  const nav = useNavigate();
  const location = useLocation();

  const [checkoutItems, setCheckoutItems] = useState([]);
  const [isDirect, setIsDirect] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pincode: "",
    address: "",
    city: "",
    state: "",
    paymentMethod: "cod"
  });

  // Coupon State
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  useEffect(() => {
    // 1. Check passed directItem from location state
    const directItem = location.state?.directItem || getDirectCheckoutItem();

    if (directItem) {
      setCheckoutItems([directItem]);
      setIsDirect(true);
    } else {
      // 2. Otherwise load full cart
      const cart = getCart();
      setCheckoutItems(cart);
      setIsDirect(false);
    }
  }, [location.state]);

  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.qty || 1),
    0
  );

  const shipping = subtotal >= 499 ? 0 : 49;

  // Calculate discount based on applied coupon
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountAmount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.flatDiscount) {
      discountAmount = Math.min(appliedCoupon.flatDiscount, subtotal);
    }
  }

  const grandTotal = Math.max(0, subtotal - discountAmount + shipping);

  const applyCouponCode = (codeToApply) => {
    const cleanCode = codeToApply.trim().toUpperCase();
    setCouponError("");
    setCouponSuccess("");

    if (!cleanCode) {
      setCouponError("Please enter a valid coupon code.");
      return;
    }

    const match = AVAILABLE_COUPONS.find((c) => c.code === cleanCode);
    if (!match) {
      setCouponError(`Coupon "${cleanCode}" is invalid.`);
      return;
    }

    if (subtotal < match.minOrder) {
      setCouponError(
        `Coupon "${match.code}" requires minimum order of ₹${match.minOrder}. (Your subtotal: ₹${subtotal})`
      );
      return;
    }

    setAppliedCoupon(match);
    setCouponInput(match.code);
    setCouponSuccess(`Coupon "${match.code}" applied successfully!`);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponSuccess("");
    setCouponError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (checkoutItems.length === 0) {
      alert("No items found to place order.");
      return;
    }

    // Save order in localStorage vb_orders
    const existingOrders = JSON.parse(localStorage.getItem("vb_orders") || "[]");
    const orderNumber = `VB-${Date.now().toString().slice(-6)}`;

    const newOrder = {
      orderId: orderNumber,
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }),
      status: "Confirmed",
      items: checkoutItems,
      subtotal,
      discount: discountAmount,
      shipping,
      grandTotal,
      coupon: appliedCoupon ? appliedCoupon.code : null,
      customer: formData
    };

    existingOrders.unshift(newOrder);
    localStorage.setItem("vb_orders", JSON.stringify(existingOrders));

    // Clear appropriate storage
    if (isDirect) {
      clearDirectCheckoutItem();
    } else {
      clearCart();
    }

    nav("/thank-you", { state: { order: newOrder } });
  };

  return (
    <div>
      <SiteHeader />
      <main className="checkout-page container">
        <div className="checkout-title">
          <span className="eyebrow">
            {isDirect ? "Direct Buy Now" : "Secure Checkout"}
          </span>
          <h1>Complete Your Order</h1>
          <p>
            <FiLock /> 256-bit encrypted checkout. Your information is safe & confidential.
          </p>
        </div>

        {checkoutItems.length > 0 ? (
          <div className="checkout-grid">
            {/* Delivery & Payment Form */}
            <form className="checkout-form" onSubmit={handlePlaceOrder}>
              <h2>Contact & Delivery Address</h2>
              <div className="form-grid">
                <input
                  className="input"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name *"
                  required
                />
                <input
                  className="input"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address *"
                  required
                />
                <input
                  className="input"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="10-digit Mobile Number *"
                  required
                />
                <input
                  className="input"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="Pincode *"
                  required
                />
                <input
                  className="input wide"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Flat, House no., Building, Street Address *"
                  required
                />
                <input
                  className="input"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City / District *"
                  required
                />
                <input
                  className="input"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="State *"
                  required
                />
              </div>

              <h2>Payment Method</h2>
              <div className="payment-options">
                <label className="payment">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleInputChange}
                  />
                  <span>Cash on Delivery (COD)</span>
                  <small>Pay with cash or UPI upon delivery</small>
                </label>

                <label className="payment">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === "online"}
                    onChange={handleInputChange}
                  />
                  <span>UPI / Cards / Net Banking</span>
                  <small>Instant & 100% secure payment</small>
                </label>
              </div>

              <button className="btn place-order-btn" type="submit">
                <FiLock /> Place Order (₹{grandTotal})
              </button>
            </form>

            {/* Order Summary & Coupon Section */}
            <aside className="checkout-summary">
              <h2>Order Summary ({checkoutItems.length} {checkoutItems.length === 1 ? "Product" : "Products"})</h2>

              {/* Product Items Breakdown */}
              <div className="checkout-items-list">
                {checkoutItems.map((item, idx) => (
                  <div className="checkout-item" key={item.id || idx}>
                    <img
                      src={item.image || "/assets/product1.jpeg"}
                      alt={item.name}
                      className="checkout-item-img"
                    />
                    <div className="checkout-item-details">
                      <h4>{item.name}</h4>
                      <small>{item.subtitle}</small>
                      <span className="checkout-item-qty">
                        Qty: <b>{item.qty || 1}</b>
                      </span>
                    </div>
                    <div className="checkout-item-price">
                      ₹{(Number(item.price) || 0) * (item.qty || 1)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Code Section */}
              <div className="coupon-section">
                <h3>
                  <FiTag /> Have a Coupon Code?
                </h3>

                <div className="coupon-input-wrap">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter Coupon (e.g. VEDA10)"
                    className="coupon-input"
                    disabled={!!appliedCoupon}
                  />
                  {appliedCoupon ? (
                    <button
                      type="button"
                      className="coupon-remove-btn"
                      onClick={removeCoupon}
                      title="Remove Coupon"
                    >
                      <FiX /> Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="coupon-apply-btn"
                      onClick={() => applyCouponCode(couponInput)}
                    >
                      Apply
                    </button>
                  )}
                </div>

                {couponError && <div className="coupon-error">{couponError}</div>}
                {couponSuccess && (
                  <div className="coupon-success">
                    <FiCheckCircle /> {couponSuccess}
                  </div>
                )}

                {/* Available Coupon Chips */}
                <div className="available-coupons">
                  <span className="available-title">Available Coupons:</span>
                  <div className="coupon-chips">
                    {AVAILABLE_COUPONS.map((c) => (
                      <div
                        key={c.code}
                        className={`coupon-chip ${
                          appliedCoupon?.code === c.code ? "applied" : ""
                        }`}
                        onClick={() => applyCouponCode(c.code)}
                        title={c.desc}
                      >
                        <b>{c.code}</b>
                        <small>{c.title}</small>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bill Details */}
              <div className="bill-details">
                <div className="bill-row">
                  <span>Subtotal</span>
                  <b>₹{subtotal}</b>
                </div>

                {appliedCoupon && (
                  <div className="bill-row discount-row">
                    <span>
                      Coupon Discount ({appliedCoupon.code})
                    </span>
                    <b>-₹{discountAmount}</b>
                  </div>
                )}

                <div className="bill-row">
                  <span>Shipping Fee</span>
                  <b>{shipping === 0 ? "FREE" : `₹${shipping}`}</b>
                </div>

                <hr className="summary-hr" />

                <div className="bill-row grand-total-row">
                  <span>Total Amount</span>
                  <b>₹{grandTotal}</b>
                </div>
              </div>

              <div className="trust-badge">
                <FiShield /> 100% Authentic Ayurvedic Herbal Products
              </div>
            </aside>
          </div>
        ) : (
          <div className="empty-checkout">
            <h2>No Items Selected For Checkout</h2>
            <p>Please select a product or add items to your cart before proceeding.</p>
            <Link className="btn" to="/shop">
              Browse Products
            </Link>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
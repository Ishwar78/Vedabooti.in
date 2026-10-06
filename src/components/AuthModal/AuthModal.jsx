import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiX,
  FiMail,
  FiUser,
  FiPhone,
  FiLock,
  FiArrowRight,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiShoppingBag
} from "react-icons/fi";
import api from "../../lib/api";
import {
  AUTH_MODAL_EVENT,
  AUTH_MODAL_CLOSE_EVENT,
  closeAuthModal
} from "../../lib/authModal";
import {
  setDirectCheckoutItem,
  mergeAndRestoreUserCart
} from "../../lib/cartWishlist";
import "./AuthModal.css";

export default function AuthModal() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [modalOptions, setModalOptions] = useState({});
  const [activeTab, setActiveTab] = useState("signup"); // "signup" or "login"

  // Signup form state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginOtp, setLoginOtp] = useState("");
  const [loginStep, setLoginStep] = useState(1); // 1 = enter email, 2 = enter otp

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Listen to open / close events
  useEffect(() => {
    const handleOpen = (e) => {
      const opts = e.detail || {};
      setModalOptions(opts);
      setError("");
      setSuccess("");
      setLoginStep(1);
      setLoginOtp("");
      setActiveTab("signup"); // default to fast signup for Buy Now customers
      setIsOpen(true);
    };

    const handleClose = () => {
      setIsOpen(false);
    };

    window.addEventListener(AUTH_MODAL_EVENT, handleOpen);
    window.addEventListener(AUTH_MODAL_CLOSE_EVENT, handleClose);

    return () => {
      window.removeEventListener(AUTH_MODAL_EVENT, handleOpen);
      window.removeEventListener(AUTH_MODAL_CLOSE_EVENT, handleClose);
    };
  }, []);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer = null;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  if (!isOpen) return null;

  const directItem = modalOptions.directItem;

  const handleModalClose = () => {
    setIsOpen(false);
    closeAuthModal();
  };

  const handleAuthSuccess = (res) => {
    // 1. Store session
    if (res.token) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("userToken", res.token);
    }
    if (res.user) {
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("isLoggedIn", "true");
    }

    if (res.cart) {
      mergeAndRestoreUserCart(res.cart);
    }

    // 2. Ensure direct item is saved if present
    if (directItem) {
      setDirectCheckoutItem(directItem);
    }

    // 3. Dispatch storage event so SiteHeader & Checkout update
    window.dispatchEvent(new Event("storage"));

    // 4. Callback
    if (typeof modalOptions.onSuccess === "function") {
      modalOptions.onSuccess(res.user);
    }

    // 5. Close modal & navigate to checkout
    handleModalClose();
    const destination = modalOptions.redirectTo || "/checkout";
    navigate(destination, { state: { directItem } });
  };

  // ================= DIRECT QUICK SIGNUP =================
  const handleQuickSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!signupName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!signupEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/auth/quick-signup", {
        name: signupName.trim(),
        email: signupEmail.trim().toLowerCase(),
        phone: signupPhone.trim(),
      });

      if (res.success && res.token) {
        setSuccess("Account created successfully! Proceeding to checkout...");
        setTimeout(() => {
          handleAuthSuccess(res);
        }, 600);
      }
    } catch (err) {
      // If email is already registered, suggest login
      if (err.alreadyRegistered || (err.message && err.message.toLowerCase().includes("already registered"))) {
        setError("This email is already registered. Please sign in below.");
        setLoginEmail(signupEmail.trim().toLowerCase());
        setActiveTab("login");
        setLoginStep(1);
      } else {
        setError(err.message || "Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ================= SEND LOGIN OTP =================
  const handleSendLoginOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!loginEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/auth/send-login-otp", {
        email: loginEmail.trim().toLowerCase(),
      });

      setSuccess(res.message || `Login verification code sent to ${loginEmail.trim()}.`);
      setLoginStep(2);
      setCountdown(60);
    } catch (err) {
      setError(err.message || "Failed to send login code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ================= VERIFY LOGIN OTP =================
  const handleVerifyLoginOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!loginOtp.trim() || loginOtp.trim().length !== 6) {
      setError("Please enter the 6-digit code sent to your email.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/auth/verify-login-otp", {
        email: loginEmail.trim().toLowerCase(),
        otp: loginOtp.trim(),
      });

      if (res.success && res.token) {
        setSuccess("Logged in successfully! Redirecting...");
        setTimeout(() => {
          handleAuthSuccess(res);
        }, 600);
      }
    } catch (err) {
      setError(err.message || "Invalid or expired OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={handleModalClose}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className="auth-modal-close"
          onClick={handleModalClose}
          aria-label="Close"
        >
          <FiX />
        </button>

        {/* Modal Header */}
        <div className="auth-modal-header">
          <span className="auth-modal-eyebrow">VEDA BOOTI AYURVEDA</span>
          <h2>Complete Your Purchase</h2>
          <p>
            {activeTab === "signup"
              ? "Create your account in seconds to proceed with your order"
              : "Sign in to access your saved address and complete your order"}
          </p>

          {/* Direct Buy Item Preview */}
          {directItem && (
            <div className="auth-modal-item-chip">
              <FiShoppingBag className="chip-icon" />
              <div className="chip-details">
                <span className="chip-name">{directItem.name}</span>
                <span className="chip-meta">
                  Qty: {directItem.qty || 1} &bull; ₹
                  {Number(directItem.price).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="auth-modal-tabs">
          <button
            type="button"
            className={`auth-modal-tab ${activeTab === "signup" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("signup");
              setError("");
              setSuccess("");
            }}
          >
            Create Account
          </button>
          <button
            type="button"
            className={`auth-modal-tab ${activeTab === "login" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("login");
              setError("");
              setSuccess("");
            }}
          >
            Sign In
          </button>
        </div>

        {/* Alert Notifications */}
        {error && (
          <div className="auth-modal-alert error">
            <FiAlertCircle />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="auth-modal-alert success">
            <FiCheckCircle />
            <span>{success}</span>
          </div>
        )}

        {/* TAB 1: QUICK SIGN UP */}
        {activeTab === "signup" && (
          <form className="auth-modal-form" onSubmit={handleQuickSignup}>
            <div className="modal-input-group">
              <label>Full Name *</label>
              <div className="modal-input-wrap">
                <FiUser className="input-icon" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="modal-input-group">
              <label>Email Address *</label>
              <div className="modal-input-wrap">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="modal-input-group">
              <label>Mobile Number (for delivery updates)</label>
              <div className="modal-input-wrap">
                <FiPhone className="input-icon" />
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-modal-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FiRefreshCw className="spin" /> Creating Account...
                </>
              ) : (
                <>
                  Create Account & Continue <FiArrowRight />
                </>
              )}
            </button>

            <p className="auth-modal-footer-text">
              Already have an account?{" "}
              <button
                type="button"
                className="link-btn"
                onClick={() => {
                  setActiveTab("login");
                  if (signupEmail) setLoginEmail(signupEmail);
                  setError("");
                }}
              >
                Sign In here
              </button>
            </p>
          </form>
        )}

        {/* TAB 2: SIGN IN / LOGIN */}
        {activeTab === "login" && (
          <div className="auth-modal-form">
            {loginStep === 1 ? (
              <form onSubmit={handleSendLoginOtp}>
                <div className="modal-input-group">
                  <label>Registered Email Address *</label>
                  <div className="modal-input-wrap">
                    <FiMail className="input-icon" />
                    <input
                      type="email"
                      placeholder="Enter your registered email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="auth-modal-submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FiRefreshCw className="spin" /> Sending Code...
                    </>
                  ) : (
                    <>
                      Send Login Code <FiArrowRight />
                    </>
                  )}
                </button>

                <p className="auth-modal-footer-text">
                  New to Veda Booti?{" "}
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => {
                      setActiveTab("signup");
                      setError("");
                    }}
                  >
                    Create an account
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleVerifyLoginOtp}>
                <div className="modal-input-group">
                  <div className="otp-step-info">
                    <span>Enter 6-digit code sent to:</span>
                    <strong>{loginEmail}</strong>
                    <button
                      type="button"
                      className="change-email-btn"
                      onClick={() => setLoginStep(1)}
                    >
                      Change
                    </button>
                  </div>
                  <div className="modal-input-wrap">
                    <FiLock className="input-icon" />
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit OTP"
                      value={loginOtp}
                      onChange={(e) => setLoginOtp(e.target.value.replace(/\D/g, ""))}
                      className="otp-field"
                      autoFocus
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="auth-modal-submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FiRefreshCw className="spin" /> Verifying...
                    </>
                  ) : (
                    <>
                      Verify & Proceed to Order <FiArrowRight />
                    </>
                  )}
                </button>

                <div className="resend-wrap">
                  {countdown > 0 ? (
                    <span className="resend-timer">
                      Resend code in <b>{countdown}s</b>
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="resend-btn"
                      onClick={handleSendLoginOtp}
                      disabled={loading}
                    >
                      Resend Code
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

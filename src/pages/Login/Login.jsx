import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiMail,
  FiArrowRight,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiEdit2,
} from "react-icons/fi";
import api from "../../lib/api";
import { mergeAndRestoreUserCart } from "../../lib/cartWishlist";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if redirect path was passed via state or query param
  const queryRedirect = new URLSearchParams(location.search).get("redirect");
  const redirectTo = location.state?.from || location.state?.redirectTo || queryRedirect || "/user";

  // Step 1: Enter Email | Step 2: Enter OTP
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for resend OTP
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

  // ================= STEP 1: SEND LOGIN OTP =================
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/auth/send-login-otp", {
        email: email.trim().toLowerCase(),
      });

      setSuccess(res.message || `Login code sent to ${email.trim()}.`);
      setStep(2);
      setCountdown(60);
    } catch (err) {
      setError(err.message || "Failed to send login code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ================= RESEND LOGIN OTP =================
  const handleResendOtp = async () => {
    if (countdown > 0 || loading) return;
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await api.post("/api/auth/send-login-otp", {
        email: email.trim().toLowerCase(),
      });

      setSuccess(res.message || "A fresh login code has been sent to your email.");
      setCountdown(60);
    } catch (err) {
      setError(err.message || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  // ================= STEP 2: VERIFY LOGIN OTP =================
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp.trim() || otp.trim().length !== 6) {
      setError("Please enter the complete 6-digit OTP code.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/auth/verify-login-otp", {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      });

      // Save user session
      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("userToken", res.token);
      }
      if (res.user) {
        localStorage.setItem("user", JSON.stringify(res.user));
        localStorage.setItem("isLoggedIn", "true");
      }

      // Restore saved user cart from database
      if (res.cart) {
        mergeAndRestoreUserCart(res.cart);
      }

      // Notify other components via storage event
      window.dispatchEvent(new Event("storage"));

      setSuccess("Login successful! Redirecting to your account...");
      setTimeout(() => {
        navigate(redirectTo);
      }, 1000);
    } catch (err) {
      setError(err.message || "Invalid OTP code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      {/* ================= LEFT ART ================= */}
      <div className="auth-art">
        <Link to="/" title="Go to Home">
          <img src="/assets/veda-booti-logo.png" alt="Veda Booti" />
        </Link>
        <span>Goodness from Nature.</span>
      </div>

      {/* ================= LOGIN CARD ================= */}
      <div className="auth-card">
        {/* Navigation Tabs */}
        <div className="auth-tabs">
          <button type="button" className="auth-tab active">
            Sign In
          </button>
          <Link to="/signup" className="auth-tab">
            Create Account
          </Link>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="auth-alert error">
            <FiAlertCircle size={18} style={{ flexShrink: 0 }} />
            <div>
              <span>{error}</span>
              {(error.toLowerCase().includes("not registered") || error.toLowerCase().includes("sign up")) && (
                <div style={{ marginTop: "4px" }}>
                  <Link
                    to="/signup"
                    style={{ color: "#ffd67a", fontWeight: "600", textDecoration: "underline" }}
                  >
                    Click here to Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="auth-alert success">
            <FiCheckCircle size={18} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        {/* ================= STEP 1: ENTER REGISTERED EMAIL ================= */}
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <span className="eyebrow">Welcome Back</span>
            <h1>Sign In</h1>
            <p>Access your orders, wishlist, and profile with secure email OTP login.</p>

            {/* EMAIL */}
            <label className="auth-field">
              <span>Registered Email Address *</span>
              <div className="auth-input-wrapper">
                <FiMail className="auth-input-icon" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  required
                />
              </div>
            </label>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="btn"
              disabled={loading}
              style={{ marginTop: "24px", display: "flex", alignItems: "center", gap: "8px" }}
            >
              {loading ? (
                <>
                  <FiRefreshCw className="spin" />
                  <span>Sending Login Code...</span>
                </>
              ) : (
                <>
                  <span>Send Login Code</span>
                  <FiArrowRight />
                </>
              )}
            </button>

            <small>
              New here? <Link to="/signup">Create an account</Link>
            </small>
          </form>
        )}

        {/* ================= STEP 2: ENTER OTP ================= */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <span className="eyebrow">Step 2 of 2</span>
            <h1>Enter Code</h1>
            <p>We've sent a 6-digit login verification code to your email.</p>

            {/* Email Chip with Change button */}
            <div className="email-chip">
              <div>
                <span>Email: </span>
                <strong>{email}</strong>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtp("");
                  setError("");
                  setSuccess("");
                }}
              >
                <FiEdit2 style={{ verticalAlign: "middle", marginRight: "3px" }} />
                Change
              </button>
            </div>

            {/* OTP INPUT */}
            <label className="auth-field">
              <span>Enter 6-Digit Code *</span>
              <div className="auth-input-wrapper otp-input-field">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="······"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  autoFocus
                  required
                />
              </div>
            </label>

            {/* Resend OTP Row */}
            <div className="otp-resend-row">
              <span>Didn't receive code?</span>
              <button
                type="button"
                className="resend-btn"
                onClick={handleResendOtp}
                disabled={countdown > 0 || loading}
              >
                {countdown > 0 ? (
                  `Resend in ${countdown}s`
                ) : (
                  <>
                    <FiRefreshCw /> Resend Code
                  </>
                )}
              </button>
            </div>

            {/* VERIFY BUTTON */}
            <button
              type="submit"
              className="btn"
              disabled={loading || otp.length !== 6}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                opacity: loading || otp.length !== 6 ? 0.7 : 1,
              }}
            >
              {loading ? (
                <>
                  <FiRefreshCw className="spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <FiCheckCircle />
                  <span>Verify & Sign In</span>
                </>
              )}
            </button>

            <small>
              New here? <Link to="/signup">Create an account</Link>
            </small>
          </form>
        )}
      </div>
    </main>
  );
}
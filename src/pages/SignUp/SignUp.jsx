import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMail,
  FiUser,
  FiPhone,
  FiKey,
  FiArrowRight,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiEdit2,
} from "react-icons/fi";
import api from "../../lib/api";
import { mergeAndRestoreUserCart } from "../../lib/cartWishlist";
import "../Login/Login.css";

export default function SignUp() {
  const navigate = useNavigate();

  // Step 1: Fill details | Step 2: Verify OTP
  const [step, setStep] = useState(1);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  // UI status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Countdown timer effect for resend OTP
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

  // ================= STEP 1: SEND SIGNUP OTP =================
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/auth/send-signup-otp", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
      });

      setSuccess(res.message || `OTP sent to ${email.trim()}.`);
      setStep(2);
      setCountdown(60);
    } catch (err) {
      setError(err.message || "Failed to send verification OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ================= RESEND OTP =================
  const handleResendOtp = async () => {
    if (countdown > 0 || loading) return;
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await api.post("/api/auth/send-signup-otp", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
      });

      setSuccess(res.message || "A new OTP has been sent to your email.");
      setCountdown(60);
    } catch (err) {
      setError(err.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ================= STEP 2: VERIFY OTP & REGISTER =================
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp.trim() || otp.trim().length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/auth/verify-signup-otp", {
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

      // Restore saved user cart if any exists
      if (res.cart) {
        mergeAndRestoreUserCart(res.cart);
      }

      // Notify other components (Header, Shell) via storage event
      window.dispatchEvent(new Event("storage"));

      setSuccess("Account verified successfully! Redirecting...");
      setTimeout(() => {
        navigate("/user");
      }, 1200);
    } catch (err) {
      setError(err.message || "Verification failed. Please try again.");
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

      {/* ================= SIGN UP CARD ================= */}
      <div className="auth-card">
        {/* Navigation Tabs */}
        <div className="auth-tabs">
          <Link to="/login" className="auth-tab">
            Sign In
          </Link>
          <button type="button" className="auth-tab active">
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="auth-alert error">
            <FiAlertCircle size={18} style={{ flexShrink: 0 }} />
            <div>
              <span>{error}</span>
              {error.toLowerCase().includes("already registered") && (
                <div style={{ marginTop: "4px" }}>
                  <Link
                    to="/login"
                    style={{ color: "#ffd67a", fontWeight: "600", textDecoration: "underline" }}
                  >
                    Click here to Login
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

        {/* ================= STEP 1: USER DETAILS FORM ================= */}
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <span className="eyebrow">Join Veda Booti</span>
            <h1>Register</h1>
            <p>Enter your details to receive an OTP verification code on your email.</p>

            {/* FULL NAME */}
            <label className="auth-field">
              <span>Full Name *</span>
              <div className="auth-input-wrapper">
                <FiUser className="auth-input-icon" />
                <input
                  type="text"
                  placeholder="e.g. Rohit Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </label>

            {/* EMAIL */}
            <label className="auth-field">
              <span>Email Address *</span>
              <div className="auth-input-wrapper">
                <FiMail className="auth-input-icon" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </label>

            {/* PHONE (OPTIONAL) */}
            <label className="auth-field">
              <span>Phone Number (Optional)</span>
              <div className="auth-input-wrapper">
                <FiPhone className="auth-input-icon" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
                  <span>Sending OTP...</span>
                </>
              ) : (
                <>
                  <span>Get Verification OTP</span>
                  <FiArrowRight />
                </>
              )}
            </button>

            <small>
              Already have an account? <Link to="/login">Sign In</Link>
            </small>
          </form>
        )}

        {/* ================= STEP 2: VERIFY OTP FORM ================= */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <span className="eyebrow">Step 2 of 2</span>
            <h1>Verify OTP</h1>
            <p>Enter the 6-digit code sent to your registered email address.</p>

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
              <span>Didn't receive the code?</span>
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
                    <FiRefreshCw /> Resend OTP
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
                  <span>Verify & Create Account</span>
                </>
              )}
            </button>

            <small>
              Need help? <Link to="/support">Contact Customer Support</Link>
            </small>
          </form>
        )}
      </div>
    </main>
  );
}

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff
} from "react-icons/fi";
import "./Login.css";

export default function Login() {
  const nav = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    nav("/user");
  };

  return (
    <main className="auth-page">

      {/* ================= LEFT ART ================= */}
      <div className="auth-art">
        <img
          src="/assets/veda-booti-logo.png"
          alt="Veda Booti"
        />
        <span>Goodness from Nature.</span>
      </div>

      {/* ================= LOGIN CARD ================= */}
      <form
        className="auth-card"
        onSubmit={handleSubmit}
      >
        <span className="eyebrow">
          Welcome Back
        </span>

        <h1>Sign In</h1>

        <p>
          Access your orders, wishlist and account.
        </p>

        {/* ================= EMAIL ================= */}
        <label className="auth-field">
          <span>Email</span>

          <div className="auth-input-wrapper">
            <FiMail className="auth-input-icon" />

            <input
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
        </label>

        {/* ================= PASSWORD ================= */}
        <label className="auth-field">
          <span>Password</span>

          <div className="auth-input-wrapper password-input-wrapper">
            <FiLock className="auth-input-icon" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
            />

            {/* Eye Button */}
            <button
              type="button"
              className="password-eye-btn"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <FiEyeOff />
              ) : (
                <FiEye />
              )}
            </button>
          </div>
        </label>

        {/* ================= REMEMBER / FORGOT ================= */}
        <div className="auth-row">

          <label className="remember-option">
            <input type="checkbox" />
            <span>Remember me</span>
          </label>

          <Link to="/support">
            Forgot password?
          </Link>

        </div>

        {/* ================= BUTTON ================= */}
        <button
          type="submit"
          className="btn"
        >
          Sign In
        </button>

        {/* ================= REGISTER ================= */}
        <small>
          New here?{" "}
          <Link to="/login">
            Create an account
          </Link>
        </small>

      </form>
    </main>
  );
}
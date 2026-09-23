import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiLock,
    FiMail,
    FiEye,
    FiEyeOff,
    FiAlertCircle,
} from "react-icons/fi";
import api from "../../lib/api";
import "./AdminLogin.css";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const nav = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await api.post("/api/admin/login", {
                email: email.trim(),
                password,
            });

            if (res && res.success) {
                if (res.token) {
                    localStorage.setItem("admin_token", res.token);
                }
                if (res.admin) {
                    localStorage.setItem("admin_user", JSON.stringify(res.admin));
                }
                nav("/admin");
            } else {
                setError(res?.message || "Invalid login credentials.");
            }
        } catch (err) {
            setError(err.message || "Failed to sign in. Please verify your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="admin-login">

            {/* Left Branding */}
            <div className="admin-login-art">

                <img
                    src="/assets/veda-booti-logo.png"
                    alt="Veda Booti"
                />

                <span>
                    Admin Control Center
                </span>

            </div>


            {/* Login Card */}
            <form
                className="admin-card"
                onSubmit={handleSubmit}
            >

                <span className="eyebrow">
                    Secure Access
                </span>

                <h1>
                    Admin Login
                </h1>

                <p>
                    Manage products, categories, orders
                    and support.
                </p>

                {/* Error Banner */}
                {error && (
                    <div className="admin-login-error">
                        <FiAlertCircle style={{ flexShrink: 0 }} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Email */}
                <label className="admin-field">

                    <span className="field-label">
                        Email
                    </span>

                    <div className="input-wrapper">

                        <FiMail className="input-icon" />

                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Vedabooti@admingmail.com"
                            autoComplete="email"
                        />

                    </div>

                </label>


                {/* Password */}
                <label className="admin-field">

                    <span className="field-label">
                        Password
                    </span>

                    <div className="input-wrapper password-wrapper">

                        <FiLock className="input-icon" />

                        <input
                            type={show ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            autoComplete="current-password"
                        />

                        {/* Eye Button */}
                        <button
                            type="button"
                            className="password-eye"
                            onClick={() => setShow(!show)}
                            aria-label={
                                show
                                    ? "Hide password"
                                    : "Show password"
                            }
                        >
                            {show ? (
                                <FiEyeOff />
                            ) : (
                                <FiEye />
                            )}
                        </button>

                    </div>

                </label>


                {/* Sign In */}
                <button
                    type="submit"
                    className="btn"
                    disabled={loading}
                >
                    {loading ? "Signing In..." : "Sign In"}
                </button>

            </form>

        </main>
    );
}
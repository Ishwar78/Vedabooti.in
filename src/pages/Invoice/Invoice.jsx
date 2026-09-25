import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiPrinter, FiRefreshCw, FiAlertCircle } from "react-icons/fi";
import api from "../../lib/api";
import InvoiceModal from "../../components/InvoiceModal";
import "./Invoice.css";

export default function Invoice() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/api/orders/${orderId}`);
        if (res?.success && res.order) {
          setOrder(res.order);
        } else {
          setError(res?.message || "Order not found");
        }
      } catch (err) {
        // Fallback: check localStorage
        const stored = JSON.parse(localStorage.getItem("vb_orders") || "[]");
        const found = stored.find(
          (o) => o.orderId === orderId || o._id === orderId
        );
        if (found) {
          setOrder(found);
        } else {
          setError(err.message || "Could not load order invoice.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="standalone-invoice-loading">
        <FiRefreshCw className="spin" size={32} />
        <p>Loading invoice for order #{orderId}...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="standalone-invoice-error">
        <FiAlertCircle size={40} />
        <h2>Unable to load Invoice</h2>
        <p>{error || "Order not found."}</p>
        <button
          type="button"
          className="btn"
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="standalone-invoice-wrapper">
      <InvoiceModal order={order} onClose={() => navigate(-1)} />
    </div>
  );
}

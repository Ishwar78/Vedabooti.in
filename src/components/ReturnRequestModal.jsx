import React, { useState } from "react";
import {
  FiRotateCcw,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiPackage,
  FiUser,
  FiCreditCard,
  FiSmartphone,
  FiHelpCircle,
  FiRefreshCw,
} from "react-icons/fi";
import api, { getProductImageUrl } from "../lib/api";
import "./ReturnRequestModal.css";

const RETURN_REASONS = [
  "Damaged / Defective Product",
  "Wrong Item Delivered",
  "Quality Not Satisfactory",
  "Packaging Opened / Torn",
  // "Arrived Late",
  "Other",
];

export default function ReturnRequestModal({ order, onClose, onSuccess }) {
  const customer = order.customer || {};
  const items = Array.isArray(order.items) ? order.items : [];

  const [returnReason, setReturnReason] = useState("Damaged / Defective Product");
  const [comments, setComments] = useState("");
  const [refundMethod, setRefundMethod] = useState("upi"); // "upi" | "bank"

  // UPI State
  const [upiId, setUpiId] = useState("");

  // Bank State
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: customer.name || "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    bankName: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successData, setSuccessData] = useState(null);

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setBankDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Validations
    if (refundMethod === "upi") {
      if (!upiId.trim() || !upiId.includes("@")) {
        setErrorMsg("Please enter a valid UPI ID (e.g. name@okhdfcbank or 9876543210@paytm).");
        return;
      }
    } else {
      if (!bankDetails.accountHolderName.trim()) {
        setErrorMsg("Please enter the Account Holder Name.");
        return;
      }
      if (!bankDetails.accountNumber.trim()) {
        setErrorMsg("Please enter your Bank Account Number.");
        return;
      }
      if (bankDetails.accountNumber.trim() !== bankDetails.confirmAccountNumber.trim()) {
        setErrorMsg("Bank Account Number and Confirm Account Number do not match.");
        return;
      }
      if (!bankDetails.ifscCode.trim()) {
        setErrorMsg("Please enter a valid IFSC Code.");
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        orderId: order.orderId,
        customer: {
          name: customer.name || "",
          email: customer.email || "",
          phone: customer.phone || "",
          address: `${customer.address || ""}, ${customer.city || ""} ${customer.state || ""} ${customer.pincode || ""}`.trim(),
        },
        items: items.map((it) => ({
          id: it.id || it._id,
          name: it.name,
          price: Number(it.price) || 0,
          qty: Number(it.qty) || 1,
          image: it.image || "",
        })),
        returnReason,
        comments: comments.trim(),
        refundMethod,
        refundDetails:
          refundMethod === "upi"
            ? { upiId: upiId.trim() }
            : {
                accountHolderName: bankDetails.accountHolderName.trim(),
                accountNumber: bankDetails.accountNumber.trim(),
                ifscCode: bankDetails.ifscCode.trim().toUpperCase(),
                bankName: bankDetails.bankName.trim(),
              },
        refundAmount: Number(order.grandTotal) || 0,
      };

      const res = await api.post("/api/returns", payload);
      if (res?.success) {
        setSuccessData(res.request);
        if (onSuccess) onSuccess(res.request);
      } else {
        setErrorMsg(res?.message || "Failed to submit return request.");
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to submit return request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="return-modal-backdrop" onClick={onClose}>
      <div className="return-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="return-modal-header">
          <div>
            <span className="modal-kicker">
              <FiRotateCcw /> Return & Refund Request
            </span>
            <h2>Return Order #{order.orderId}</h2>
            <p>
              Please verify your pre-filled details, choose a return reason, and submit your
              refund account info.
            </p>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="return-modal-body">
          {successData ? (
            <div className="return-success-box">
              <FiCheckCircle className="success-icon" />
              <h3>Return Request Submitted!</h3>
              <p>
                Your return request has been submitted with ID{" "}
                <strong className="return-req-badge">#{successData.requestId}</strong>.
              </p>
              <p className="success-sub">
                Our support executive will review your request within 24–48 hours. Once approved, the
                item will be picked up and your refund of{" "}
                <b style={{ color: "#d8b56a" }}>₹{order.grandTotal}</b> will be initiated to your
                selected {refundMethod === "upi" ? "UPI ID" : "Bank Account"}.
              </p>
              <button type="button" className="btn-close-success" onClick={onClose}>
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="return-form">
              {errorMsg && (
                <div className="return-error-banner">
                  <FiAlertCircle />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* 1. Pre-filled Customer Details */}
              <div className="return-section">
                <h4>
                  <FiUser /> Customer Information (Auto-filled)
                </h4>
                <div className="info-grid">
                  <div className="info-field">
                    <span>Customer Name:</span>
                    <strong>{customer.name || "Customer"}</strong>
                  </div>
                  <div className="info-field">
                    <span>Phone Number:</span>
                    <strong>{customer.phone || "Not provided"}</strong>
                  </div>
                  <div className="info-field">
                    <span>Email Address:</span>
                    <strong>{customer.email || "Not provided"}</strong>
                  </div>
                  <div className="info-field">
                    <span>Order Amount:</span>
                    <strong style={{ color: "#d8b56a" }}>₹{order.grandTotal}</strong>
                  </div>
                </div>
                {customer.address && (
                  <div className="pickup-address-strip">
                    <small>Pickup Address:</small>
                    <p>
                      {customer.address}, {customer.city} {customer.state} - {customer.pincode}
                    </p>
                  </div>
                )}
              </div>

              {/* 2. Items in Return */}
              <div className="return-section">
                <h4>
                  <FiPackage /> Ordered Product ({items.length})
                </h4>
                <div className="return-items-list">
                  {items.map((it, idx) => (
                    <div className="return-item-row" key={idx}>
                      <img
                        src={getProductImageUrl(it.image)}
                        alt={it.name}
                        onError={(e) => {
                          e.target.src = "/assets/product1.jpeg";
                        }}
                      />
                      <div className="return-item-info">
                        <strong>{it.name}</strong>
                        <small>Qty: {it.qty || 1} | Price: ₹{it.price}</small>
                      </div>
                      <b className="return-item-price">
                        ₹{(Number(it.price) || 0) * (it.qty || 1)}
                      </b>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Reason & Comments */}
              <div className="return-section">
                <label className="field-label">Reason for Return *</label>
                <select
                  className="return-select"
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  required
                >
                  {RETURN_REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>

                <label className="field-label" style={{ marginTop: "12px" }}>
                  Additional Comments / Description
                </label>
                <textarea
                  className="return-textarea"
                  rows="3"
                  placeholder="Tell us what went wrong with the product or package..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>

              {/* 4. Refund Destination (UPI vs Bank) */}
              <div className="return-section refund-destination-box">
                <h4>Choose Where You Want Your Refund</h4>
                <p className="refund-hint">
                  Select your preferred payout method to receive the refund of ₹{order.grandTotal}.
                </p>

                <div className="refund-method-tabs">
                  <button
                    type="button"
                    className={`method-tab-btn ${refundMethod === "upi" ? "active" : ""}`}
                    onClick={() => setRefundMethod("upi")}
                  >
                    <FiSmartphone />
                    <div>
                      <strong>UPI ID (Recommended)</strong>
                      <small>Instant & direct payout</small>
                    </div>
                  </button>

                  <button
                    type="button"
                    className={`method-tab-btn ${refundMethod === "bank" ? "active" : ""}`}
                    onClick={() => setRefundMethod("bank")}
                  >
                    <FiCreditCard />
                    <div>
                      <strong>Bank Account Transfer</strong>
                      <small>NEFT / IMPS transfer</small>
                    </div>
                  </button>
                </div>

                {refundMethod === "upi" ? (
                  <div className="refund-inputs-wrap">
                    <label className="field-label">Enter Your UPI ID *</label>
                    <input
                      type="text"
                      className="return-input"
                      placeholder="e.g. mobile@paytm or username@okhdfcbank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      required
                    />
                    <small className="help-sub">
                      Your refund will be credited directly to this UPI handle once return is verified.
                    </small>
                  </div>
                ) : (
                  <div className="bank-inputs-grid">
                    <div className="bank-input-field">
                      <label className="field-label">Account Holder Name *</label>
                      <input
                        type="text"
                        name="accountHolderName"
                        className="return-input"
                        placeholder="Name as per bank passbook"
                        value={bankDetails.accountHolderName}
                        onChange={handleBankChange}
                        required
                      />
                    </div>

                    <div className="bank-input-field">
                      <label className="field-label">Bank Name</label>
                      <input
                        type="text"
                        name="bankName"
                        className="return-input"
                        placeholder="e.g. State Bank of India, HDFC"
                        value={bankDetails.bankName}
                        onChange={handleBankChange}
                      />
                    </div>

                    <div className="bank-input-field">
                      <label className="field-label">Bank Account Number *</label>
                      <input
                        type="text"
                        name="accountNumber"
                        className="return-input"
                        placeholder="Enter bank account number"
                        value={bankDetails.accountNumber}
                        onChange={handleBankChange}
                        required
                      />
                    </div>

                    <div className="bank-input-field">
                      <label className="field-label">Confirm Account Number *</label>
                      <input
                        type="text"
                        name="confirmAccountNumber"
                        className="return-input"
                        placeholder="Re-enter bank account number"
                        value={bankDetails.confirmAccountNumber}
                        onChange={handleBankChange}
                        required
                      />
                    </div>

                    <div className="bank-input-field full">
                      <label className="field-label">IFSC Code *</label>
                      <input
                        type="text"
                        name="ifscCode"
                        className="return-input"
                        placeholder="e.g. SBIN0001234"
                        value={bankDetails.ifscCode}
                        onChange={handleBankChange}
                        style={{ textTransform: "uppercase" }}
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Form Action */}
              <div className="return-modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={onClose}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit-return"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <FiRefreshCw className="spin" /> Submitting Request...
                    </>
                  ) : (
                    <>
                      <FiRotateCcw /> Submit Return Request
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

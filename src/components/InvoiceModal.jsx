import React, { useRef } from "react";
import {
  FiPrinter,
  FiX,
  FiDownload,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiPhone,
  FiMail,
  FiPackage,
} from "react-icons/fi";
import { getProductImageUrl } from "../lib/api";
import "./InvoiceModal.css";

// Helper function: Convert number to English currency words
const numberToWords = (num) => {
  const a = [
    "", "One ", "Two ", "Three ", "Four ", "Five ", "Six ", "Seven ", "Eight ", "Nine ",
    "Ten ", "Eleven ", "Twelve ", "Thirteen ", "Fourteen ", "Fifteen ", "Sixteen ",
    "Seventeen ", "Eighteen ", "Nineteen ",
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const inWords = (n) => {
    let str = "";
    if (n >= 10000000) {
      str += inWords(Math.floor(n / 10000000)) + "Crore ";
      n %= 10000000;
    }
    if (n >= 100000) {
      str += inWords(Math.floor(n / 100000)) + "Lakh ";
      n %= 100000;
    }
    if (n >= 1000) {
      str += inWords(Math.floor(n / 1000)) + "Thousand ";
      n %= 1000;
    }
    if (n >= 100) {
      str += inWords(Math.floor(n / 100)) + "Hundred ";
      n %= 100;
    }
    if (n > 0) {
      if (n < 20) str += a[n];
      else {
        str += b[Math.floor(n / 10)];
        if (n % 10 > 0) str += " " + a[n % 10];
        else str += " ";
      }
    }
    return str;
  };

  const amount = Math.round(Number(num) || 0);
  if (amount === 0) return "Zero Rupees Only";
  return inWords(amount).trim() + " Rupees Only";
};

export default function InvoiceModal({ order, onClose }) {
  const invoiceRef = useRef(null);

  if (!order) return null;

  const invoiceNo = `INV-${order.orderId || "VB-000000"}`;
  const invoiceDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : order.date || new Date().toLocaleDateString("en-IN");

  const customer = order.customer || {};
  const items = Array.isArray(order.items) ? order.items : [];
  const paymentMethod =
    order.paymentMethod === "online" ? "Online Pre-paid (Razorpay)" : "Cash on Delivery (COD)";
  const paymentStatus =
    order.paymentStatus === "Paid"
      ? "PAID"
      : order.paymentMethod === "online"
      ? "PAID"
      : "PAYABLE ON DELIVERY";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="invoice-modal-backdrop" onClick={onClose}>
      <div
        className="invoice-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating actions (hidden in print) */}
        <div className="invoice-top-actions no-print">
          <div className="invoice-actions-left">
            <span className="invoice-label-tag">Tax Invoice Preview</span>
            <span className="invoice-order-badge">#{order.orderId}</span>
          </div>

          <div className="invoice-actions-right">
            <button
              type="button"
              className="btn-invoice-action print-btn"
              onClick={handlePrint}
              title="Print or Save as PDF"
            >
              <FiPrinter /> Print / Save PDF
            </button>
            <button
              type="button"
              className="btn-invoice-action close-btn"
              onClick={onClose}
              title="Close Invoice"
            >
              <FiX />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="invoice-printable-sheet" ref={invoiceRef} id="printable-invoice">
          {/* Top Brand Bar */}
          <div className="inv-sheet-header">
            <div className="inv-company-left">
              <img
                src="/assets/veda-booti-logo.png"
                alt="Veda Booti"
                className="inv-logo"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <div className="inv-brand-titles">
                <h1 className="inv-company-name">VEDA BOOTI HEALTH CARE</h1>
                <p className="inv-tagline">100% Pure & Authentic Ayurvedic Formulations</p>
                <p className="inv-address-line">
                  Registered Office: Veda Booti Wellness Centre, Opp. Green Enclave, New Delhi - 110001
                </p>
                <p className="inv-contact-line">
                  <span>Helpline: +91 99999 99999</span> | <span>Email: support@vedabooti.com</span> |{" "}
                  <span>Web: www.vedabooti.in</span>
                </p>
                <p className="inv-tax-details">
                  <b>GSTIN:</b> 07AAECV2026B1Z5 &nbsp;|&nbsp; <b>FSSAI Lic No:</b> 10022011000492
                </p>
              </div>
            </div>

            <div className="inv-title-right">
              <div className="inv-badge-tax">TAX INVOICE / BILL OF SUPPLY</div>
              <div className="inv-meta-grid">
                <div className="meta-pair">
                  <span>Invoice No:</span>
                  <strong>{invoiceNo}</strong>
                </div>
                <div className="meta-pair">
                  <span>Invoice Date:</span>
                  <strong>{invoiceDate}</strong>
                </div>
                <div className="meta-pair">
                  <span>Order ID:</span>
                  <strong>{order.orderId}</strong>
                </div>
                <div className="meta-pair">
                  <span>Payment Mode:</span>
                  <strong>{order.paymentMethod === "online" ? "Online Pre-paid" : "COD"}</strong>
                </div>
                <div className="meta-pair">
                  <span>Payment Status:</span>
                  <strong className={paymentStatus === "PAID" ? "status-paid" : "status-cod"}>
                    {paymentStatus}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          <div className="inv-divider" />

          {/* Customer / Billing & Shipping Section */}
          <div className="inv-addresses-row">
            <div className="inv-address-box">
              <div className="inv-box-title">
                <FiMapPin /> Billed & Delivered To (Customer):
              </div>
              <div className="inv-box-body">
                <h3 className="customer-name">{customer.name || "Valued Customer"}</h3>
                <p className="customer-address">
                  {customer.address ? customer.address : "Address details on file"}
                  {customer.city ? `, ${customer.city}` : ""}
                  {customer.state ? `, ${customer.state}` : ""}
                  {customer.pincode ? ` - ${customer.pincode}` : ""}
                </p>
                <p className="customer-contact">
                  {customer.phone && (
                    <span>
                      <strong>Phone:</strong> {customer.phone}
                    </span>
                  )}
                  {customer.email && (
                    <span>
                      &nbsp;|&nbsp; <strong>Email:</strong> {customer.email}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="inv-address-box order-summary-box">
              <div className="inv-box-title">
                <FiPackage /> Logistics & Dispatch Details:
              </div>
              <div className="inv-box-body">
                <p>
                  <b>Shipping Carrier:</b> Veda Booti Express Herbal Logistics
                </p>
                <p>
                  <b>Dispatch Hub:</b> Delhi Central Warehouse
                </p>
                <p>
                  <b>Current Order Status:</b>{" "}
                  <span className="order-live-status">{order.status || "Confirmed"}</span>
                </p>
                {order.razorpayPaymentId && (
                  <p>
                    <b>Transaction Ref:</b> {order.razorpayPaymentId}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Product Items Table */}
          <table className="inv-table">
            <thead>
              <tr>
                <th style={{ width: "40px", textAlign: "center" }}>#</th>
                <th style={{ width: "65px", textAlign: "center" }}>Image</th>
                <th>Item Description / Product</th>
                <th style={{ width: "90px", textAlign: "right" }}>Unit Price</th>
                <th style={{ width: "70px", textAlign: "center" }}>Qty</th>
                <th style={{ width: "110px", textAlign: "right" }}>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item, index) => {
                  const unitPrice = Number(item.price) || 0;
                  const qty = Number(item.qty) || 1;
                  const lineTotal = unitPrice * qty;
                  const itemImg = getProductImageUrl(item.image);

                  return (
                    <tr key={index}>
                      <td style={{ textAlign: "center", color: "#666" }}>{index + 1}</td>
                      <td style={{ textAlign: "center" }}>
                        <div className="inv-thumb-wrap">
                          <img
                            src={itemImg}
                            alt={item.name}
                            className="inv-item-thumb"
                            onError={(e) => {
                              e.target.src = "/assets/product1.jpeg";
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <strong className="inv-item-name">{item.name || "Ayurvedic Product"}</strong>
                        <span className="inv-item-desc">
                          100% Herbal & Pure Ayurvedic Natural Formulation
                        </span>
                      </td>
                      <td style={{ textAlign: "right", fontFamily: "monospace", fontSize: "13px" }}>
                        ₹{unitPrice.toLocaleString("en-IN")}
                      </td>
                      <td style={{ textAlign: "center", fontWeight: "600" }}>{qty}</td>
                      <td
                        style={{
                          textAlign: "right",
                          fontFamily: "monospace",
                          fontWeight: "700",
                          fontSize: "13.5px",
                        }}
                      >
                        ₹{lineTotal.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "20px", color: "#777" }}>
                    Ayurvedic Wellness Pack
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Totals and Amount in Words */}
          <div className="inv-calculation-grid">
            <div className="inv-words-side">
              <div className="amount-in-words-box">
                <span className="words-label">Amount Chargeable (in words):</span>
                <strong className="words-text">{numberToWords(order.grandTotal)}</strong>
              </div>

              <div className="inv-terms-note">
                <strong>Terms & Conditions / Return Policy:</strong>
                <ol>
                  <li>Goods once sold are covered under our 7-day herbal quality guarantee.</li>
                  <li>Store products in a cool, dry place away from direct sunlight.</li>
                  <li>For support or queries, contact us at <b>support@vedabooti.com</b>.</li>
                </ol>
              </div>
            </div>

            <div className="inv-breakdown-side">
              <div className="calc-row">
                <span>Subtotal:</span>
                <b>₹{(Number(order.subtotal) || 0).toLocaleString("en-IN")}</b>
              </div>

              {Number(order.discount) > 0 && (
                <div className="calc-row discount-row">
                  <span>Coupon Discount {order.coupon ? `(${order.coupon})` : ""}:</span>
                  <b>-₹{(Number(order.discount) || 0).toLocaleString("en-IN")}</b>
                </div>
              )}

              <div className="calc-row">
                <span>Shipping & Handling:</span>
                <b>
                  {order.shipping === 0 || !order.shipping
                    ? "FREE"
                    : `₹${Number(order.shipping).toLocaleString("en-IN")}`}
                </b>
              </div>

              <div className="calc-row grand-total-row">
                <span>Grand Total:</span>
                <strong>₹{(Number(order.grandTotal) || 0).toLocaleString("en-IN")}</strong>
              </div>
            </div>
          </div>

          {/* Footer & Signature */}
          <div className="inv-sheet-footer">
            <div className="inv-footer-msg">
              <p className="thank-you-brand">
                Thank you for choosing <b>Veda Booti</b> for your Natural Healthcare Journey! 🌿
              </p>
              <small className="computer-gen">
                This is a computer-generated tax invoice. No physical signature is required.
              </small>
            </div>

            <div className="inv-signature-block">
              <div className="signature-seal">
                <div className="seal-circle">
                  <span>VEDA BOOTI</span>
                  <small>VERIFIED</small>
                </div>
              </div>
              <div className="sign-line" />
              <strong>For VEDA BOOTI HEALTH CARE</strong>
              <small>Authorized Signatory</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

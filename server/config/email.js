import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", ".env") });

/**
 * Configure Nodemailer Transporter using environment variables
 */
const createTransporter = () => {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.warn("[Mailer Warning]: SMTP_USER or SMTP_PASS is missing in environment variables.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587 / other
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

/**
 * Send 6-digit OTP email with high-quality Veda Booti branding
 */
export const sendOtpEmail = async ({ email, otp, purpose = "signup", name = "" }) => {
  const transporter = createTransporter();

  const isSignUp = purpose === "signup";
  const actionTitle = isSignUp ? "Sign Up & Register" : "Login & Sign In";
  const greeting = name ? `Namaste <b>${name}</b>,` : "Namaste,";

  const subject = isSignUp
    ? `${otp} is your Veda Booti Registration OTP`
    : `${otp} is your Veda Booti Login Verification Code`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #05140d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2ede6;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #05140d; padding: 40px 15px;">
          <tr>
            <td align="center">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; background-color: #092116; border: 1px solid #1c4731; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.45);">
                <!-- Header -->
                <tr>
                  <td align="center" style="padding: 30px 20px 20px; background: linear-gradient(180deg, #0f3523 0%, #092116 100%); border-bottom: 1px solid #173d2b;">
                    <h1 style="margin: 0; font-size: 26px; color: #e5c57b; letter-spacing: 2px; text-transform: uppercase; font-family: Georgia, serif;">VEDA BOOTI</h1>
                    <p style="margin: 6px 0 0; font-size: 12px; color: #94ad9f; letter-spacing: 1.5px; text-transform: uppercase;">Pure Ayurvedic Wellness</p>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding: 35px 35px 25px;">
                    <p style="margin: 0 0 16px; font-size: 16px; color: #d6e4dc; line-height: 1.6;">${greeting}</p>
                    <p style="margin: 0 0 24px; font-size: 14px; color: #9bb2a5; line-height: 1.6;">
                      Use the One-Time Password (OTP) below to complete your <b>${actionTitle}</b> on Veda Booti.
                    </p>

                    <!-- OTP Box -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 25px 0;">
                      <tr>
                        <td align="center" style="background: #04120b; border: 2px dashed #d8b56a; border-radius: 12px; padding: 22px 15px;">
                          <div style="font-size: 34px; font-weight: 700; letter-spacing: 10px; color: #ffd67a; font-family: 'Courier New', Courier, monospace;">
                            ${otp}
                          </div>
                          <div style="margin-top: 8px; font-size: 11px; color: #789283; letter-spacing: 0.5px;">
                            Valid for <b>10 minutes</b>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 0 0 10px; font-size: 13px; color: #e7948a; line-height: 1.5;">
                      ⚠️ <b>Security Notice:</b> Never share this OTP with anyone. Veda Booti will never call or message to ask for your verification code.
                    </p>
                    <p style="margin: 0; font-size: 12px; color: #6a8275; line-height: 1.5;">
                      If you did not request this OTP, you can safely ignore this email.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td align="center" style="padding: 20px 30px 25px; background-color: #061910; border-top: 1px solid #143524;">
                    <p style="margin: 0 0 6px; font-size: 12px; color: #758c80;">
                      © ${new Date().getFullYear()} Veda Booti. All rights reserved.
                    </p>
                    <p style="margin: 0; font-size: 11px; color: #4e6559;">
                      Goodness from Nature · 100% Herbal & Authentic Ayurveda
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const info = await transporter.sendMail({
    from: `"Veda Booti" <${process.env.SMTP_USER}>`,
    to: email,
    subject,
    html,
  });

  return info;
};

/**
 * Helper to safely format currency
 */
const formatINR = (val) => {
  const num = Number(val) || 0;
  return "₹" + num.toLocaleString("en-IN");
};

/**
 * Send Order Confirmation Email to customer
 */
export const sendOrderConfirmationEmail = async (orderData) => {
  try {
    const order = orderData?.order || orderData;
    if (!order) {
      console.warn("[Mailer Warning]: sendOrderConfirmationEmail called with no order data.");
      return null;
    }

    const email = order.customer?.email || order.email || order.userEmail;
    if (!email || !email.includes("@")) {
      console.warn(`[Mailer Warning]: Order confirmation email skipped. No valid email for order ${order.orderId || order._id}`);
      return null;
    }

    const transporter = createTransporter();
    const customerName = order.customer?.name || order.customerName || "Valued Customer";
    const orderId = order.orderId || order._id || "VB-ORDER";
    const items = Array.isArray(order.items) ? order.items : [];
    const paymentMethodText =
      order.paymentMethod === "online"
        ? "Online / Prepaid (Razorpay)"
        : "Cash on Delivery (COD)";
    const paymentStatus = order.paymentStatus || (order.paymentMethod === "online" ? "Paid" : "Pending");
    const subtotal = order.subtotal || 0;
    const discount = order.discount || 0;
    const shipping = order.shipping || 0;
    const grandTotal = order.grandTotal || 0;
    const coupon = order.coupon || null;

    const fullAddress = [
      order.customer?.address,
      order.customer?.city,
      order.customer?.state,
      order.customer?.pincode,
    ]
      .filter(Boolean)
      .join(", ");

    const orderDate = order.createdAt
      ? new Date(order.createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });

    const itemsRows = items
      .map((item) => {
        const itemPrice = Number(item.price) || 0;
        const itemQty = Number(item.qty) || 1;
        const lineTotal = itemPrice * itemQty;
        return `
          <tr>
            <td style="padding: 12px 10px; border-bottom: 1px solid #173d2b; vertical-align: top;">
              <div style="font-weight: 600; color: #ffffff; font-size: 14px; line-height: 1.4;">
                ${item.name || "Ayurvedic Herbal Product"}
              </div>
              <div style="font-size: 12px; color: #9bb2a5; margin-top: 4px;">
                Qty: <b style="color: #d6e4dc;">${itemQty}</b> &nbsp;|&nbsp; Price: ${formatINR(itemPrice)} each
              </div>
            </td>
            <td align="right" style="padding: 12px 10px; border-bottom: 1px solid #173d2b; font-weight: 600; color: #e5c57b; font-size: 14px; vertical-align: top; white-space: nowrap;">
              ${formatINR(lineTotal)}
            </td>
          </tr>
        `;
      })
      .join("");

    const subject = `Order Confirmed: #${orderId} - Veda Booti`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${subject}</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #05140d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2ede6;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #05140d; padding: 35px 15px;">
            <tr>
              <td align="center">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #092116; border: 1px solid #1c4731; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                  
                  <!-- Brand Header -->
                  <tr>
                    <td align="center" style="padding: 30px 20px 22px; background: linear-gradient(180deg, #0f3523 0%, #092116 100%); border-bottom: 1px solid #173d2b;">
                      <h1 style="margin: 0; font-size: 26px; color: #e5c57b; letter-spacing: 2px; text-transform: uppercase; font-family: Georgia, serif;">VEDA BOOTI</h1>
                      <p style="margin: 6px 0 0; font-size: 12px; color: #94ad9f; letter-spacing: 1.5px; text-transform: uppercase;">Pure Ayurvedic Wellness</p>
                    </td>
                  </tr>

                  <!-- Confirmation Badge & Greeting -->
                  <tr>
                    <td style="padding: 30px 30px 20px;">
                      <div style="text-align: center; margin-bottom: 22px;">
                        <span style="display: inline-block; background: rgba(74, 222, 128, 0.12); border: 1px solid #22c55e; color: #4ade80; padding: 6px 18px; border-radius: 20px; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">
                          ✓ Order Confirmed
                        </span>
                      </div>

                      <p style="margin: 0 0 14px; font-size: 17px; color: #d6e4dc; line-height: 1.5;">
                        Namaste <b>${customerName}</b>,
                      </p>
                      <p style="margin: 0 0 24px; font-size: 14px; color: #9bb2a5; line-height: 1.6;">
                        Thank you for shopping with <b>Veda Booti</b>! Your order has been placed successfully and is being prepared with highest quality Ayurvedic standards. Below are your order details:
                      </p>

                      <!-- Order Meta Box -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: #04120b; border: 1px solid #173d2b; border-radius: 10px; padding: 14px 18px; margin-bottom: 24px;">
                        <tr>
                          <td style="padding: 6px 0; font-size: 13px; color: #9bb2a5;">
                            <b>Order ID:</b> <span style="color: #ffd67a; font-weight: 700;">#${orderId}</span>
                          </td>
                          <td align="right" style="padding: 6px 0; font-size: 13px; color: #9bb2a5;">
                            <b>Date:</b> <span style="color: #d6e4dc;">${orderDate}</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 6px 0; font-size: 13px; color: #9bb2a5;">
                            <b>Payment Mode:</b> <span style="color: #d6e4dc;">${paymentMethodText}</span>
                          </td>
                          <td align="right" style="padding: 6px 0; font-size: 13px; color: #9bb2a5;">
                            <b>Payment Status:</b> <span style="color: ${paymentStatus === 'Paid' ? '#4ade80' : '#f59e0b'}; font-weight: 600;">${paymentStatus}</span>
                          </td>
                        </tr>
                      </table>

                      <!-- Items Section Header -->
                      <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #e5c57b; margin-bottom: 10px;">
                        Items Ordered
                      </div>

                      <!-- Items Table -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                        ${itemsRows}
                      </table>

                      <!-- Price Summary Table -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: #061910; border: 1px solid #173d2b; border-radius: 10px; padding: 14px 18px; margin-bottom: 24px;">
                        <tr>
                          <td style="padding: 5px 0; font-size: 13px; color: #9bb2a5;">Subtotal</td>
                          <td align="right" style="padding: 5px 0; font-size: 13px; color: #d6e4dc;">${formatINR(subtotal)}</td>
                        </tr>
                        ${
                          discount > 0
                            ? `
                        <tr>
                          <td style="padding: 5px 0; font-size: 13px; color: #5eead4;">
                            Discount ${coupon ? `(${coupon})` : ""}
                          </td>
                          <td align="right" style="padding: 5px 0; font-size: 13px; color: #5eead4; font-weight: 600;">
                            -${formatINR(discount)}
                          </td>
                        </tr>`
                            : ""
                        }
                        <tr>
                          <td style="padding: 5px 0; font-size: 13px; color: #9bb2a5;">Shipping Charges</td>
                          <td align="right" style="padding: 5px 0; font-size: 13px; color: #d6e4dc;">
                            ${shipping > 0 ? formatINR(shipping) : '<span style="color: #4ade80; font-weight: 600;">FREE</span>'}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0 4px; font-size: 15px; font-weight: 700; color: #e5c57b; border-top: 1px solid #1c4731;">
                            Total Amount
                          </td>
                          <td align="right" style="padding: 12px 0 4px; font-size: 17px; font-weight: 700; color: #ffd67a; border-top: 1px solid #1c4731;">
                            ${formatINR(grandTotal)}
                          </td>
                        </tr>
                      </table>

                      <!-- Shipping Address Box -->
                      <div style="background: #04120b; border: 1px solid #173d2b; border-radius: 10px; padding: 16px 18px; margin-bottom: 20px;">
                        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #e5c57b; font-weight: 700; margin-bottom: 8px;">
                          📍 Shipping Address
                        </div>
                        <div style="font-size: 14px; font-weight: 600; color: #ffffff;">
                          ${customerName}
                        </div>
                        ${
                          order.customer?.phone
                            ? `<div style="font-size: 13px; color: #9bb2a5; margin-top: 3px;">Phone: ${order.customer.phone}</div>`
                            : ""
                        }
                        <div style="font-size: 13px; color: #9bb2a5; margin-top: 5px; line-height: 1.5;">
                          ${fullAddress || "Address provided during checkout"}
                        </div>
                      </div>

                      <!-- Help / Support Notice -->
                      <p style="margin: 0; font-size: 12px; color: #758c80; line-height: 1.6; text-align: center;">
                        Need help or have questions about your order? Email us at <a href="mailto:vedabooti1@gmail.com" style="color: #e5c57b; text-decoration: none;">vedabooti1@gmail.com</a>.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td align="center" style="padding: 20px 30px 25px; background-color: #061910; border-top: 1px solid #143524;">
                      <p style="margin: 0 0 6px; font-size: 12px; color: #758c80;">
                        © ${new Date().getFullYear()} Veda Booti. All rights reserved.
                      </p>
                      <p style="margin: 0; font-size: 11px; color: #4e6559;">
                        Goodness from Nature · 100% Herbal & Authentic Ayurveda
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: `"Veda Booti" <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html,
    });

    console.log(`[Mailer] Order confirmation email sent to ${email} for order #${orderId}`);
    return info;
  } catch (error) {
    console.error("[Mailer Error] Failed to send order confirmation email:", error.message);
    return null;
  }
};

/**
 * Send Order Delivered Email to customer
 */
export const sendOrderDeliveredEmail = async (orderData) => {
  try {
    const order = orderData?.order || orderData;
    if (!order) {
      console.warn("[Mailer Warning]: sendOrderDeliveredEmail called with no order data.");
      return null;
    }

    const email = order.customer?.email || order.email || order.userEmail;
    if (!email || !email.includes("@")) {
      console.warn(`[Mailer Warning]: Order delivered email skipped. No valid email for order ${order.orderId || order._id}`);
      return null;
    }

    const transporter = createTransporter();
    const customerName = order.customer?.name || order.customerName || "Valued Customer";
    const orderId = order.orderId || order._id || "VB-ORDER";
    const items = Array.isArray(order.items) ? order.items : [];
    const grandTotal = order.grandTotal || 0;

    const fullAddress = [
      order.customer?.address,
      order.customer?.city,
      order.customer?.state,
      order.customer?.pincode,
    ]
      .filter(Boolean)
      .join(", ");

    const deliveredDate = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const itemsSummaryHtml = items
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px 8px; border-bottom: 1px solid #173d2b; color: #ffffff; font-size: 13px;">
            <b>${item.name || "Ayurvedic Product"}</b>
            <span style="color: #9bb2a5; font-size: 12px; margin-left: 6px;">(Qty: ${item.qty || 1})</span>
          </td>
          <td align="right" style="padding: 10px 8px; border-bottom: 1px solid #173d2b; color: #e5c57b; font-size: 13px; font-weight: 600;">
            ${formatINR((Number(item.price) || 0) * (Number(item.qty) || 1))}
          </td>
        </tr>
      `
      )
      .join("");

    const subject = `Delivered! Your Veda Booti Order #${orderId} has arrived 🌿`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${subject}</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #05140d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e2ede6;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #05140d; padding: 35px 15px;">
            <tr>
              <td align="center">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #092116; border: 1px solid #1c4731; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                  
                  <!-- Brand Header -->
                  <tr>
                    <td align="center" style="padding: 30px 20px 22px; background: linear-gradient(180deg, #0f3523 0%, #092116 100%); border-bottom: 1px solid #173d2b;">
                      <h1 style="margin: 0; font-size: 26px; color: #e5c57b; letter-spacing: 2px; text-transform: uppercase; font-family: Georgia, serif;">VEDA BOOTI</h1>
                      <p style="margin: 6px 0 0; font-size: 12px; color: #94ad9f; letter-spacing: 1.5px; text-transform: uppercase;">Pure Ayurvedic Wellness</p>
                    </td>
                  </tr>

                  <!-- Delivered Badge & Content -->
                  <tr>
                    <td style="padding: 30px 30px 20px;">
                      
                      <!-- Delivery Celebration Badge -->
                      <div style="text-align: center; margin-bottom: 22px;">
                        <span style="display: inline-block; background: rgba(74, 222, 128, 0.15); border: 1px solid #22c55e; color: #4ade80; padding: 8px 22px; border-radius: 24px; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">
                          🎉 Package Delivered Successfully
                        </span>
                      </div>

                      <p style="margin: 0 0 14px; font-size: 17px; color: #d6e4dc; line-height: 1.5;">
                        Namaste <b>${customerName}</b>,
                      </p>
                      <p style="margin: 0 0 20px; font-size: 14px; color: #9bb2a5; line-height: 1.6;">
                        Great news! Your Veda Booti package for order <b>#${orderId}</b> was delivered on <b>${deliveredDate}</b>. We hope our authentic Ayurvedic remedies bring vitality, wellness, and balance into your daily life.
                      </p>

                      <!-- Delivery Overview Card -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: #04120b; border: 1px solid #173d2b; border-radius: 10px; padding: 14px 18px; margin-bottom: 22px;">
                        <tr>
                          <td style="padding: 6px 0; font-size: 13px; color: #9bb2a5;">
                            <b>Order ID:</b> <span style="color: #ffd67a; font-weight: 700;">#${orderId}</span>
                          </td>
                          <td align="right" style="padding: 6px 0; font-size: 13px; color: #9bb2a5;">
                            <b>Delivered On:</b> <span style="color: #4ade80; font-weight: 600;">${deliveredDate}</span>
                          </td>
                        </tr>
                        <tr>
                          <td colspan="2" style="padding: 6px 0 2px; font-size: 13px; color: #9bb2a5;">
                            <b>Delivered To:</b> <span style="color: #d6e4dc;">${fullAddress || customerName}</span>
                          </td>
                        </tr>
                      </table>

                      <!-- Delivered Items Summary -->
                      ${
                        items.length > 0
                          ? `
                      <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #e5c57b; margin-bottom: 8px;">
                        Delivered Products
                      </div>
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: #061910; border: 1px solid #173d2b; border-radius: 10px; padding: 8px 14px; margin-bottom: 24px;">
                        ${itemsSummaryHtml}
                        <tr>
                          <td style="padding: 10px 8px 4px; font-size: 14px; font-weight: 700; color: #e5c57b;">Total Amount</td>
                          <td align="right" style="padding: 10px 8px 4px; font-size: 15px; font-weight: 700; color: #ffd67a;">${formatINR(grandTotal)}</td>
                        </tr>
                      </table>`
                          : ""
                      }

                      <!-- Feedback & Review Invitation -->
                      <div style="background: linear-gradient(180deg, #0f3523 0%, #061910 100%); border: 1px solid #22c55e; border-radius: 12px; padding: 22px 18px; text-align: center; margin-bottom: 24px;">
                        <div style="font-size: 18px; margin-bottom: 6px;">⭐ ⭐ ⭐ ⭐ ⭐</div>
                        <h3 style="margin: 0 0 8px; font-size: 16px; color: #ffd67a;">How was your experience?</h3>
                        <p style="margin: 0 0 16px; font-size: 13px; color: #9bb2a5; line-height: 1.5;">
                          Your feedback helps fellow Ayurveda enthusiasts make natural wellness choices. Share your thoughts with us!
                        </p>
                        <a href="https://vedabooti.in/orders" style="display: inline-block; background: linear-gradient(135deg, #e5c57b 0%, #c49d47 100%); color: #04120b; font-weight: 700; font-size: 13px; padding: 11px 26px; border-radius: 8px; text-decoration: none; letter-spacing: 0.5px;">
                          Write a Product Review
                        </a>
                      </div>

                      <!-- Support Note -->
                      <p style="margin: 0; font-size: 12px; color: #758c80; line-height: 1.6; text-align: center;">
                        Didn't receive this package or need assistance? Contact our team within 7 days at <a href="mailto:vedabooti1@gmail.com" style="color: #e5c57b; text-decoration: none;">vedabooti1@gmail.com</a>.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td align="center" style="padding: 20px 30px 25px; background-color: #061910; border-top: 1px solid #143524;">
                      <p style="margin: 0 0 6px; font-size: 12px; color: #758c80;">
                        © ${new Date().getFullYear()} Veda Booti. All rights reserved.
                      </p>
                      <p style="margin: 0; font-size: 11px; color: #4e6559;">
                        Goodness from Nature · 100% Herbal & Authentic Ayurveda
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    const info = await transporter.sendMail({
      from: `"Veda Booti" <${process.env.SMTP_USER}>`,
      to: email,
      subject,
      html,
    });

    console.log(`[Mailer] Order delivered email sent to ${email} for order #${orderId}`);
    return info;
  } catch (error) {
    console.error("[Mailer Error] Failed to send order delivered email:", error.message);
    return null;
  }
};

export default {
  sendOtpEmail,
  sendOrderConfirmationEmail,
  sendOrderDeliveredEmail,
};


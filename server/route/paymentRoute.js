import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

const router = express.Router();

const getRazorpayInstance = () => {
  const key_id = (process.env.RAZORPAY_KEY_ID || "rzp_test_Sp7kyr6OgNH35p").trim();
  const key_secret = (process.env.RAZORPAY_KEY_SECRET || "DNBEsZ2TCXHRrNe3ZLN66NCs").trim();
  return new Razorpay({ key_id, key_secret });
};

/* =========================================================
   1. GET RAZORPAY PUBLIC KEY ID
========================================================= */
router.get("/razorpay-key", (req, res) => {
  return res.status(200).json({
    success: true,
    keyId: process.env.RAZORPAY_KEY_ID || "",
  });
});

/* =========================================================
   2. CREATE RAZORPAY ORDER (Initiate checkout)
========================================================= */
router.post("/create-order", async (req, res) => {
  try {
    const { amount, receipt } = req.body;
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount.",
      });
    }

    const instance = getRazorpayInstance();
    const options = {
      amount: Math.round(Number(amount) * 100), // in paise
      currency: process.env.RAZORPAY_CURRENCY || "INR",
      receipt: receipt || `rcpt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("[Razorpay API] Create order error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create Razorpay order.",
    });
  }
});

/* =========================================================
   3. VERIFY RAZORPAY PAYMENT SIGNATURE
========================================================= */
router.post("/verify", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification parameters.",
      });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (isValid) {
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully.",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed. Invalid signature.",
      });
    }
  } catch (error) {
    console.error("[Razorpay API] Verification error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Payment verification failed.",
    });
  }
});

export default router;

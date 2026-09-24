import express from "express";
import jwt from "jsonwebtoken";
import Order from "../module/Order.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "vedabooti_user_jwt_secret_token_2026";

// Optional/Flexible auth helper
const extractUser = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  try {
    const token = authHeader.split(" ")[1];
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

/* =========================================================
   1. CREATE NEW ORDER (Checkout)
========================================================= */
router.post("/", async (req, res) => {
  try {
    const {
      orderId,
      customer,
      items,
      subtotal,
      discount,
      shipping,
      grandTotal,
      coupon,
      paymentMethod,
    } = req.body;

    const authUser = extractUser(req);
    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: "Please login to your account to place an order.",
      });
    }

    const generatedId = orderId || `VB-${Date.now().toString().slice(-6)}`;

    const newOrder = new Order({
      orderId: generatedId,
      user: authUser.id,
      customer: {
        name: customer?.name || "Customer",
        email: customer?.email || authUser.email,
        phone: customer?.phone || "",
        address: customer?.address || "",
        city: customer?.city || "",
        state: customer?.state || "",
        pincode: customer?.pincode || "",
      },
      items: Array.isArray(items) ? items : [],
      subtotal: Number(subtotal) || 0,
      discount: Number(discount) || 0,
      shipping: Number(shipping) || 0,
      grandTotal: Number(grandTotal) || 0,
      coupon: coupon || null,
      status: "Confirmed",
      paymentMethod: paymentMethod || "cod",
      paymentStatus: req.body.paymentStatus || (paymentMethod === "online" ? "Paid" : "Pending"),
      razorpayOrderId: req.body.razorpayOrderId || null,
      razorpayPaymentId: req.body.razorpayPaymentId || null,
    });

    const saved = await newOrder.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order: saved,
    });
  } catch (error) {
    console.error("[Order API] Create order error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create order.",
      error: error.message,
    });
  }
});

/* =========================================================
   2. GET LOGGED-IN USER'S ORDERS
========================================================= */
router.get("/my-orders", async (req, res) => {
  try {
    const authUser = extractUser(req);
    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: "Authentication required to view purchase history.",
      });
    }

    const orders = await Order.find({
      $or: [
        { user: authUser.id },
        { "customer.email": authUser.email.toLowerCase() },
      ],
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("[Order API] Fetch user orders error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user orders.",
      error: error.message,
    });
  }
});

/* =========================================================
   3. ADMIN: GET ALL ORDERS
========================================================= */
router.get("/", async (req, res) => {
  try {
    const { search, status } = req.query;
    const filter = {};

    if (status && status !== "All Status" && status !== "All") {
      filter.status = status;
    }

    if (search && search.trim()) {
      const term = search.trim();
      filter.$or = [
        { orderId: new RegExp(term, "i") },
        { "customer.name": new RegExp(term, "i") },
        { "customer.email": new RegExp(term, "i") },
        { "customer.phone": new RegExp(term, "i") },
      ];
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("[Order API] Fetch all orders error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders.",
      error: error.message,
    });
  }
});

/* =========================================================
   4. ADMIN: UPDATE ORDER STATUS
========================================================= */
const updateOrderStatusHandler = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    if (status) order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status}.`,
      order,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

router.patch("/:id/status", updateOrderStatusHandler);
router.put("/:id/status", updateOrderStatusHandler);
router.post("/:id/status", updateOrderStatusHandler);

export default router;

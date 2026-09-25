import express from "express";
import jwt from "jsonwebtoken";
import ReturnRequest from "../module/ReturnRequest.js";
import Order from "../module/Order.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "vedabooti_user_jwt_secret_token_2026";

// Auth helper
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
   1. CREATE RETURN REQUEST (User)
========================================================= */
router.post("/", async (req, res) => {
  try {
    const {
      orderId,
      customer,
      items,
      returnReason,
      comments,
      refundMethod,
      refundDetails,
      refundAmount,
    } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required to process return.",
      });
    }

    if (!refundMethod || !["upi", "bank"].includes(refundMethod)) {
      return res.status(400).json({
        success: false,
        message: "Valid refund method (UPI or Bank) is required.",
      });
    }

    if (refundMethod === "upi" && (!refundDetails?.upiId || !refundDetails.upiId.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter your UPI ID for refund.",
      });
    }

    if (refundMethod === "bank") {
      if (
        !refundDetails?.accountNumber?.trim() ||
        !refundDetails?.ifscCode?.trim() ||
        !refundDetails?.accountHolderName?.trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Please enter complete bank account details (Holder name, Account number, IFSC code).",
        });
      }
    }

    // Check if duplicate pending return exists
    const existing = await ReturnRequest.findOne({
      orderId,
      status: { $in: ["Pending", "Approved"] },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A return request (#${existing.requestId}) has already been submitted for order ${orderId} and is currently ${existing.status}.`,
        request: existing,
      });
    }

    const authUser = extractUser(req);
    const linkedOrder = await Order.findOne({ orderId });

    // Generate unique Request ID
    const requestId = `RET-${Math.floor(100000 + Math.random() * 900000)}`;

    const newReturn = new ReturnRequest({
      requestId,
      order: linkedOrder?._id || null,
      orderId,
      user: authUser?.id || linkedOrder?.user || null,
      customer: {
        name: customer?.name || linkedOrder?.customer?.name || authUser?.name || "Customer",
        email: customer?.email || linkedOrder?.customer?.email || authUser?.email || "",
        phone: customer?.phone || linkedOrder?.customer?.phone || authUser?.phone || "",
        address: customer?.address || linkedOrder?.customer?.address || "",
      },
      items: Array.isArray(items) && items.length > 0 ? items : (linkedOrder?.items || []),
      returnReason: returnReason || "Damaged / Defective Product",
      comments: comments ? comments.trim() : "",
      refundMethod,
      refundDetails: {
        upiId: refundDetails?.upiId?.trim() || "",
        accountHolderName: refundDetails?.accountHolderName?.trim() || "",
        accountNumber: refundDetails?.accountNumber?.trim() || "",
        ifscCode: refundDetails?.ifscCode?.trim() || "",
        bankName: refundDetails?.bankName?.trim() || "",
      },
      refundAmount: Number(refundAmount) || linkedOrder?.grandTotal || 0,
      status: "Pending",
    });

    await newReturn.save();

    return res.status(201).json({
      success: true,
      message: `Return request #${requestId} submitted successfully. Our team will verify and process your return.`,
      request: newReturn,
    });
  } catch (error) {
    console.error("[Return API] Create error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit return request.",
      error: error.message,
    });
  }
});

/* =========================================================
   2. USER: GET MY RETURN REQUESTS
========================================================= */
router.get("/my-returns", async (req, res) => {
  try {
    const authUser = extractUser(req);
    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: "Authentication required to view your return requests.",
      });
    }

    const returns = await ReturnRequest.find({
      $or: [
        { user: authUser.id },
        { "customer.email": authUser.email.toLowerCase() },
      ],
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: returns.length,
      returns,
    });
  } catch (error) {
    console.error("[Return API] Fetch user returns error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch return requests.",
      error: error.message,
    });
  }
});

/* =========================================================
   3. ADMIN: GET ALL RETURN REQUESTS
========================================================= */
router.get("/", async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== "All") {
      filter.status = status;
    }

    if (search && search.trim()) {
      const term = search.trim();
      filter.$or = [
        { requestId: new RegExp(term, "i") },
        { orderId: new RegExp(term, "i") },
        { "customer.name": new RegExp(term, "i") },
        { "customer.email": new RegExp(term, "i") },
        { "customer.phone": new RegExp(term, "i") },
        { "refundDetails.upiId": new RegExp(term, "i") },
        { "refundDetails.accountNumber": new RegExp(term, "i") },
      ];
    }

    const requests = await ReturnRequest.find(filter).sort({ createdAt: -1 });

    const total = await ReturnRequest.countDocuments();
    const pending = await ReturnRequest.countDocuments({ status: "Pending" });
    const approved = await ReturnRequest.countDocuments({ status: "Approved" });
    const refunded = await ReturnRequest.countDocuments({ status: "Refunded" });
    const rejected = await ReturnRequest.countDocuments({ status: "Rejected" });

    return res.status(200).json({
      success: true,
      count: requests.length,
      stats: { total, pending, approved, refunded, rejected },
      requests,
      returns: requests,
    });
  } catch (error) {
    console.error("[Return API] Admin fetch returns error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch return requests.",
      error: error.message,
    });
  }
});

/* =========================================================
   4. ADMIN: UPDATE STATUS & ADMIN NOTES
========================================================= */
const updateReturnStatusHandler = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const returnReq = await ReturnRequest.findById(req.params.id);

    if (!returnReq) {
      return res.status(404).json({ success: false, message: "Return request not found." });
    }

    if (status) returnReq.status = status;
    if (adminNotes !== undefined) returnReq.adminNotes = adminNotes;

    await returnReq.save();

    return res.status(200).json({
      success: true,
      message: `Return request #${returnReq.requestId} status updated to ${status}.`,
      request: returnReq,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

router.patch("/:id/status", updateReturnStatusHandler);
router.put("/:id/status", updateReturnStatusHandler);
router.post("/:id/status", updateReturnStatusHandler);

/* =========================================================
   5. ADMIN: DELETE RETURN REQUEST
========================================================= */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await ReturnRequest.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Return request not found." });
    }

    return res.status(200).json({
      success: true,
      message: `Return request #${deleted.requestId} deleted successfully.`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

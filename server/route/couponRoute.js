import express from "express";
import Coupon from "../module/Coupon.js";

const router = express.Router();

/* =========================================================
   1. GET ALL COUPONS (Optional: ?active=true, ?search=...)
========================================================= */
router.get("/", async (req, res) => {
  try {

    const { active, search, status } = req.query;
    const filter = {};

    if (active === "true") {
      filter.status = "Active";
    } else if (status && status !== "All") {
      filter.status = status;
    }

    if (search && search.trim()) {
      const term = search.trim();
      filter.$or = [
        { code: new RegExp(term, "i") },
        { title: new RegExp(term, "i") },
        { description: new RegExp(term, "i") },
      ];
    }

    const coupons = await Coupon.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: coupons.length,
      coupons,
    });
  } catch (error) {
    console.error("[Coupon API] Error fetching coupons:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch coupons",
      error: error.message,
    });
  }
});

/* =========================================================
   2. CREATE NEW COUPON (Admin)
========================================================= */
router.post("/", async (req, res) => {
  try {
    const { code, title, description, discountType, discountValue, minOrder, status } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ success: false, message: "Coupon code is required." });
    }

    if (discountValue === undefined || discountValue === null || Number(discountValue) <= 0) {
      return res.status(400).json({ success: false, message: "Valid discount value is required." });
    }

    const cleanCode = code.trim().toUpperCase();

    const existing = await Coupon.findOne({ code: cleanCode });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Coupon with code "${cleanCode}" already exists.`,
      });
    }

    const newCoupon = new Coupon({
      code: cleanCode,
      title: title ? title.trim() : "",
      description: description ? description.trim() : "",
      discountType: discountType === "Fixed Amount" ? "Fixed Amount" : "Percentage",
      discountValue: Number(discountValue),
      minOrder: Number(minOrder) || 0,
      status: status === "Inactive" ? "Inactive" : "Active",
    });

    const saved = await newCoupon.save();

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully!",
      coupon: saved,
    });
  } catch (error) {
    console.error("[Coupon API] Error creating coupon:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create coupon.",
      error: error.message,
    });
  }
});

/* =========================================================
   3. UPDATE COUPON (Admin)
========================================================= */
router.put("/:id", async (req, res) => {
  try {
    const { code, title, description, discountType, discountValue, minOrder, status } = req.body;

    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found." });
    }

    if (code && code.trim()) {
      const cleanCode = code.trim().toUpperCase();
      const duplicate = await Coupon.findOne({ code: cleanCode, _id: { $ne: coupon._id } });
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: `Coupon with code "${cleanCode}" already exists.`,
        });
      }
      coupon.code = cleanCode;
    }

    if (title !== undefined) coupon.title = title.trim();
    if (description !== undefined) coupon.description = description.trim();
    if (discountType !== undefined) coupon.discountType = discountType;
    if (discountValue !== undefined) coupon.discountValue = Number(discountValue);
    if (minOrder !== undefined) coupon.minOrder = Number(minOrder);
    if (status !== undefined) coupon.status = status;

    const updated = await coupon.save();

    return res.status(200).json({
      success: true,
      message: "Coupon updated successfully!",
      coupon: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/* =========================================================
   4. TOGGLE COUPON STATUS (Active / Inactive)
========================================================= */
router.patch("/:id/status", async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found." });
    }

    coupon.status = coupon.status === "Active" ? "Inactive" : "Active";
    await coupon.save();

    return res.status(200).json({
      success: true,
      message: `Coupon is now ${coupon.status}.`,
      status: coupon.status,
      coupon,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/* =========================================================
   5. DELETE COUPON (Admin)
========================================================= */
router.delete("/:id", async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found." });
    }

    await Coupon.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Coupon deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

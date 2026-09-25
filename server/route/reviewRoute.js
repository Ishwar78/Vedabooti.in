import express from "express";
import jwt from "jsonwebtoken";
import Review from "../module/Review.js";
import Order from "../module/Order.js";
import Product from "../module/Product.js";

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
   1. GET APPROVED REVIEWS FOR A PRODUCT
========================================================= */
router.get("/product/:identifier", async (req, res) => {
  try {
    const { identifier } = req.params;
    const { slug, id, name } = req.query;

    const identifiers = [identifier, slug, id].filter(Boolean);
    const orConditions = [
      { productId: { $in: identifiers } },
      { productSlug: { $in: identifiers } },
    ];
    if (name && name.trim()) {
      orConditions.push({ productName: new RegExp(`^${name.trim()}$`, "i") });
    }

    const reviews = await Review.find({
      $or: orConditions,
      status: "Approved",
    }).sort({ createdAt: -1 });

    const total = reviews.length;
    const avgRating = total > 0
      ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / total).toFixed(1)
      : "5.0";

    return res.status(200).json({
      success: true,
      count: total,
      averageRating: avgRating,
      reviews,
    });
  } catch (error) {
    console.error("[Review API] Get product reviews error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product reviews.",
      error: error.message,
    });
  }
});

/* =========================================================
   2. CHECK IF LOGGED-IN USER CAN REVIEW (VERIFIED BUYER CHECK)
========================================================= */
router.get("/can-review/:identifier", async (req, res) => {
  try {
    const authUser = extractUser(req);
    if (!authUser) {
      return res.status(200).json({
        canReview: false,
        reason: "login_required",
        message: "You must be logged in to leave a verified review.",
      });
    }

    const { identifier } = req.params;
    const { slug, id, name } = req.query;
    const itemMatchConditions = [];

    if (identifier) {
      itemMatchConditions.push(
        { "items.id": identifier },
        { "items.slug": identifier },
        { "items._id": identifier }
      );
    }
    if (slug) {
      itemMatchConditions.push({ "items.slug": slug });
    }
    if (id) {
      itemMatchConditions.push({ "items.id": id }, { "items._id": id });
    }
    if (name) {
      itemMatchConditions.push({ "items.name": new RegExp(`^${name}$`, "i") });
    }

    // Check if user has an order with this product
    const orderQuery = {
      status: { $ne: "Cancelled" },
      $and: [
        {
          $or: [
            { user: authUser.id },
            { "customer.email": authUser.email.toLowerCase() },
          ],
        },
        {
          $or: itemMatchConditions.length > 0 ? itemMatchConditions : [{ "items.id": identifier }],
        },
      ],
    };

    const hasPurchased = await Order.findOne(orderQuery);

    if (!hasPurchased) {
      return res.status(200).json({
        canReview: false,
        reason: "not_purchased",
        message: "Only verified buyers who have purchased this product can leave a review.",
      });
    }

    // Check if user has already submitted a review
    const allIdentifiers = [identifier, slug, id].filter(Boolean);
    const existingReview = await Review.findOne({
      user: authUser.id,
      $or: [
        { productId: { $in: allIdentifiers } },
        { productSlug: { $in: allIdentifiers } },
      ],
    });

    return res.status(200).json({
      canReview: true,
      alreadyReviewed: !!existingReview,
      existingReview: existingReview || null,
      user: {
        id: authUser.id,
        name: authUser.name,
        email: authUser.email,
      },
    });
  } catch (error) {
    console.error("[Review API] Check can-review error:", error);
    return res.status(500).json({
      success: false,
      canReview: false,
      message: "Failed to verify review eligibility.",
      error: error.message,
    });
  }
});

/* =========================================================
   3. SUBMIT REVIEW (ONLY VERIFIED BUYERS)
========================================================= */
router.post("/", async (req, res) => {
  try {
    const authUser = extractUser(req);
    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: "Please log in to submit a review.",
      });
    }

    const {
      productId,
      productSlug,
      productName,
      productImage,
      rating,
      comment,
      name,
    } = req.body;

    if (!productId && !productSlug) {
      return res.status(400).json({
        success: false,
        message: "Product identifier is required.",
      });
    }

    if (!rating || !comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: "Rating and review comment are required.",
      });
    }

    // Purchase validation
    const itemMatchConditions = [];
    if (productId) {
      itemMatchConditions.push(
        { "items.id": productId },
        { "items.slug": productId },
        { "items._id": productId }
      );
    }
    if (productSlug) {
      itemMatchConditions.push({ "items.slug": productSlug });
    }
    if (productName) {
      itemMatchConditions.push({ "items.name": new RegExp(`^${productName}$`, "i") });
    }

    const hasPurchased = await Order.findOne({
      status: { $ne: "Cancelled" },
      $and: [
        {
          $or: [
            { user: authUser.id },
            { "customer.email": authUser.email.toLowerCase() },
          ],
        },
        {
          $or: itemMatchConditions.length > 0 ? itemMatchConditions : [{ "items.id": productId }],
        },
      ],
    });

    if (!hasPurchased) {
      return res.status(403).json({
        success: false,
        message: "Only verified buyers who have purchased this product can leave a review.",
      });
    }

    const newReview = new Review({
      productId: productId || productSlug,
      productSlug: productSlug || "",
      productName: productName || "Veda Booti Product",
      productImage: productImage || "",
      user: authUser.id,
      userName: (name || authUser.name || "Customer").trim(),
      userEmail: authUser.email.toLowerCase(),
      rating: Number(rating),
      comment: comment.trim(),
      isVerifiedBuyer: true,
      status: "Approved", // Instant display for verified buyers
    });

    await newReview.save();

    return res.status(201).json({
      success: true,
      message: "Thank you! Your verified review has been submitted successfully.",
      review: newReview,
    });
  } catch (error) {
    console.error("[Review API] Submit review error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit review.",
      error: error.message,
    });
  }
});

/* =========================================================
   4. ADMIN: CREATE REVIEW (Admin can add any number of reviews to any product)
========================================================= */
router.post("/admin", async (req, res) => {
  try {
    const {
      productId,
      productSlug,
      productName,
      productImage,
      userName,
      userEmail,
      rating,
      comment,
      isVerifiedBuyer = true,
      status = "Approved",
      createdAt,
    } = req.body;

    if (!productId && !productSlug && !productName) {
      return res.status(400).json({
        success: false,
        message: "Please select a product for this review.",
      });
    }

    if (!userName || !userName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required.",
      });
    }

    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid rating between 1 and 5.",
      });
    }

    if (!comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: "Review comment is required.",
      });
    }

    // Try to resolve product details from DB
    let resolvedProduct = null;
    if (productId) {
      resolvedProduct = await Product.findById(productId).catch(() => null);
    }
    if (!resolvedProduct && productSlug) {
      resolvedProduct = await Product.findOne({ slug: productSlug }).catch(() => null);
    }
    if (!resolvedProduct && productName) {
      resolvedProduct = await Product.findOne({ name: new RegExp(`^${productName.trim()}$`, "i") }).catch(() => null);
    }

    const finalProductId = resolvedProduct ? String(resolvedProduct._id) : (productId || productSlug || "");
    const finalProductSlug = resolvedProduct ? (resolvedProduct.slug || "") : (productSlug || "");
    const finalProductName = resolvedProduct ? resolvedProduct.name : (productName || "Ayurvedic Product");
    const finalProductImage = resolvedProduct
      ? ((resolvedProduct.images && resolvedProduct.images[0]) || resolvedProduct.image || "")
      : (productImage || "");

    const newReview = new Review({
      productId: finalProductId,
      productSlug: finalProductSlug,
      productName: finalProductName,
      productImage: finalProductImage,
      userName: userName.trim(),
      userEmail: userEmail ? userEmail.trim().toLowerCase() : "",
      rating: Number(rating),
      comment: comment.trim(),
      isVerifiedBuyer: isVerifiedBuyer !== false,
      status: status || "Approved",
      createdBy: "Admin",
      ...(createdAt ? { createdAt: new Date(createdAt) } : {}),
    });

    await newReview.save();

    return res.status(201).json({
      success: true,
      message: "Review created and published successfully by Admin.",
      review: newReview,
    });
  } catch (error) {
    console.error("[Review API] Admin create review error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create review.",
      error: error.message,
    });
  }
});

/* =========================================================
   5. ADMIN: GET ALL REVIEWS
========================================================= */
router.get("/admin", async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== "All") {
      filter.status = status;
    }

    if (search && search.trim()) {
      const term = search.trim();
      filter.$or = [
        { productName: new RegExp(term, "i") },
        { userName: new RegExp(term, "i") },
        { userEmail: new RegExp(term, "i") },
        { comment: new RegExp(term, "i") },
      ];
    }

    const reviews = await Review.find(filter).sort({ createdAt: -1 });

    const total = await Review.countDocuments();
    const approved = await Review.countDocuments({ status: "Approved" });
    const pending = await Review.countDocuments({ status: "Pending" });
    const rejected = await Review.countDocuments({ status: "Rejected" });

    const allApproved = await Review.find({ status: "Approved" });
    const avgRating = allApproved.length > 0
      ? (allApproved.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / allApproved.length).toFixed(1)
      : "5.0";

    return res.status(200).json({
      success: true,
      count: reviews.length,
      stats: {
        total,
        approved,
        pending,
        rejected,
        averageRating: avgRating,
      },
      reviews,
    });
  } catch (error) {
    console.error("[Review API] Admin get reviews error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews.",
      error: error.message,
    });
  }
});

/* =========================================================
   5. ADMIN: UPDATE REVIEW STATUS
========================================================= */
const updateReviewStatusHandler = async (req, res) => {
  try {
    const { status } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }

    if (status) review.status = status;
    await review.save();

    return res.status(200).json({
      success: true,
      message: `Review status updated to ${status}.`,
      review,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

router.patch("/:id/status", updateReviewStatusHandler);
router.put("/:id/status", updateReviewStatusHandler);
router.post("/:id/status", updateReviewStatusHandler);

/* =========================================================
   6. ADMIN: DELETE REVIEW
========================================================= */
router.delete("/:id", async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

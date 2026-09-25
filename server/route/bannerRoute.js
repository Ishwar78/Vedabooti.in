import express from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import HeroBanner from "../module/HeroBanner.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, `${Date.now()}-${cleanName}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

const bannerUploadFields = upload.fields([
  { name: "desktopImage", maxCount: 1 },
  { name: "mobileImage", maxCount: 1 },
  { name: "image", maxCount: 1 },
]);

/* =========================================================
   1. GET ACTIVE BANNERS (Storefront Home Page)
========================================================= */
router.get("/", async (req, res) => {
  try {
    let banners = await HeroBanner.find({ status: "Active" }).sort({ order: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: banners.length,
      banners,
    });
  } catch (error) {
    console.error("[Banner API] Fetch banners error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch banners.",
      error: error.message,
    });
  }
});

/* =========================================================
   2. ADMIN: GET ALL BANNERS
========================================================= */
router.get("/admin", async (req, res) => {
  try {
    const banners = await HeroBanner.find().sort({ order: 1, createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: banners.length,
      banners,
    });
  } catch (error) {
    console.error("[Banner API] Admin fetch banners error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch banners.",
      error: error.message,
    });
  }
});

/* =========================================================
   3. ADMIN: CREATE BANNER
========================================================= */
router.post("/", bannerUploadFields, async (req, res) => {
  try {
    const { title, subtitle, link, buttonText, order, status } = req.body;

    let desktopImage = "";
    let mobileImage = "";

    if (req.files?.desktopImage?.[0]) {
      desktopImage = `/uploads/${req.files.desktopImage[0].filename}`;
    } else if (req.files?.image?.[0]) {
      desktopImage = `/uploads/${req.files.image[0].filename}`;
    } else if (req.body.desktopImage) {
      desktopImage = req.body.desktopImage.trim();
    } else if (req.body.image) {
      desktopImage = req.body.image.trim();
    }

    if (req.files?.mobileImage?.[0]) {
      mobileImage = `/uploads/${req.files.mobileImage[0].filename}`;
    } else if (req.body.mobileImage) {
      mobileImage = req.body.mobileImage.trim();
    }

    if (!desktopImage) {
      return res.status(400).json({
        success: false,
        message: "Desktop banner image is required.",
      });
    }

    const newBanner = new HeroBanner({
      title: title || "Veda Booti Natural Wellness",
      subtitle: subtitle || "",
      desktopImage,
      mobileImage: mobileImage || desktopImage, // Fallback to desktop if mobile not provided
      link: link || "/shop",
      buttonText: buttonText || "Shop Now",
      order: Number(order) || 0,
      status: status || "Active",
    });

    await newBanner.save();

    return res.status(201).json({
      success: true,
      message: "Hero banner created and published successfully.",
      banner: newBanner,
    });
  } catch (error) {
    console.error("[Banner API] Create banner error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create banner.",
      error: error.message,
    });
  }
});

/* =========================================================
   4. ADMIN: UPDATE BANNER
========================================================= */
const updateBannerHandler = async (req, res) => {
  try {
    const banner = await HeroBanner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found." });
    }

    const { title, subtitle, link, buttonText, order, status } = req.body;

    if (title !== undefined) banner.title = title;
    if (subtitle !== undefined) banner.subtitle = subtitle;
    if (link !== undefined) banner.link = link;
    if (buttonText !== undefined) banner.buttonText = buttonText;
    if (order !== undefined) banner.order = Number(order);
    if (status !== undefined) banner.status = status;

    if (req.files?.desktopImage?.[0]) {
      banner.desktopImage = `/uploads/${req.files.desktopImage[0].filename}`;
    } else if (req.files?.image?.[0]) {
      banner.desktopImage = `/uploads/${req.files.image[0].filename}`;
    } else if (req.body.desktopImage) {
      banner.desktopImage = req.body.desktopImage.trim();
    }

    if (req.files?.mobileImage?.[0]) {
      banner.mobileImage = `/uploads/${req.files.mobileImage[0].filename}`;
    } else if (req.body.mobileImage) {
      banner.mobileImage = req.body.mobileImage.trim();
    }

    await banner.save();

    return res.status(200).json({
      success: true,
      message: "Hero banner updated successfully.",
      banner,
    });
  } catch (error) {
    console.error("[Banner API] Update banner error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update banner.",
      error: error.message,
    });
  }
};

router.put("/:id", bannerUploadFields, updateBannerHandler);
router.patch("/:id", bannerUploadFields, updateBannerHandler);
router.post("/:id", bannerUploadFields, updateBannerHandler);

/* =========================================================
   5. ADMIN: DELETE BANNER
========================================================= */
router.delete("/:id", async (req, res) => {
  try {
    const banner = await HeroBanner.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found." });
    }

    // Try deleting files if they were uploaded
    try {
      if (banner.desktopImage && banner.desktopImage.startsWith("/uploads/")) {
        const filePath = path.join(__dirname, "..", banner.desktopImage);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
      if (banner.mobileImage && banner.mobileImage.startsWith("/uploads/")) {
        const filePath = path.join(__dirname, "..", banner.mobileImage);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }
    } catch (e) {
      console.warn("Could not delete banner file:", e.message);
    }

    return res.status(200).json({
      success: true,
      message: "Hero banner deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

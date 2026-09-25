import express from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import Product from "../module/Product.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage Configuration for Product Images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const cleanBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    cb(null, `prod-${Date.now()}-${cleanBase}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB per image
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Please upload only valid image files (JPG, PNG, WEBP, etc.)"), false);
    }
  },
});

// Slugify helper
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

// 1. GET ALL PRODUCTS
// Optional queries: ?status=Active, ?category=..., ?search=..., ?sort=...
router.get("/", async (req, res) => {
  try {

    const query = {};

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.category && req.query.category !== "All Products") {
      const cleanCat = req.query.category.trim();
      query.$or = [
        { category: new RegExp(cleanCat, "i") },
        { subtitle: new RegExp(cleanCat, "i") },
      ];
    }

    if (req.query.search) {
      const term = req.query.search.trim();
      query.$or = [
        { name: new RegExp(term, "i") },
        { subtitle: new RegExp(term, "i") },
        { category: new RegExp(term, "i") },
        { desc: new RegExp(term, "i") },
      ];
    }

    let sortObj = { createdAt: -1 };
    if (req.query.sort === "Price: Low") {
      sortObj = { price: 1 };
    } else if (req.query.sort === "Price: High") {
      sortObj = { price: -1 };
    }

    const products = await Product.find(query).sort(sortObj);

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("[Product API] Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
});

// 2. GET SINGLE PRODUCT BY SLUG OR ID
router.get("/:slugOrId", async (req, res) => {
  try {
    await ensureDefaultProducts();

    const { slugOrId } = req.params;
    let product = null;

    if (slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(slugOrId);
    }

    if (!product) {
      product = await Product.findOne({
        $or: [{ slug: slugOrId.toLowerCase() }, { name: new RegExp(`^${slugOrId}$`, "i") }],
      });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("[Product API] Error fetching product:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Helper to parse arrays from JSON or strings
const parseArray = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) return input.filter((item) => typeof item === "string" && item.trim() !== "");
  try {
    const parsed = JSON.parse(input);
    if (Array.isArray(parsed)) return parsed.filter((item) => typeof item === "string" && item.trim() !== "");
  } catch {
    // If comma or newline separated
    return input.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

// 3. CREATE PRODUCT (Supports multiple image uploads)
router.post("/", (req, res, next) => {
  upload.array("images", 10)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      oldPrice,
      discount,
      discountType,
      shortDescription,
      description,
      subtitle,
      tag,
      short,
      stock,
      unit,
      weight,
      status,
      metaTitle,
      metaDescription,
      metaTags,
      existingImages,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Product name is required." });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ success: false, message: "Category is required." });
    }
    if (!price) {
      return res.status(400).json({ success: false, message: "Price is required." });
    }

    // Collect uploaded image paths
    const uploadedImages = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];
    const preservedImages = parseArray(existingImages);
    const allImages = [...preservedImages, ...uploadedImages];

    // Auto-generate slug and make unique
    let baseSlug = slugify(name);
    let finalSlug = baseSlug;
    let count = 1;
    while (await Product.findOne({ slug: finalSlug })) {
      finalSlug = `${baseSlug}-${count++}`;
    }

    const points = parseArray(req.body.benefits || req.body.points);
    const ingredients = parseArray(req.body.ingredients);

    let parsedFaq = [];
    if (req.body.faq) {
      try {
        parsedFaq = typeof req.body.faq === "string" ? JSON.parse(req.body.faq) : req.body.faq;
      } catch {
        parsedFaq = [];
      }
    }

    const newProduct = new Product({
      name: name.trim(),
      slug: finalSlug,
      subtitle: subtitle ? subtitle.trim() : shortDescription ? shortDescription.trim() : "",
      category: category.trim(),
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : 0,
      discount: discount || "",
      discountType: discountType || "Percentage",
      shortDescription: shortDescription ? shortDescription.trim() : "",
      desc: description ? description.trim() : shortDescription ? shortDescription.trim() : "",
      tag: tag || "Bestseller",
      short: short || category.trim(),
      stock: stock !== undefined && stock !== "" ? Number(stock) : 100,
      unit: unit || "Gram",
      weight: weight || "",
      status: status || "Active",
      images: allImages.length > 0 ? allImages : ["/assets/product1.jpeg"],
      image: allImages.length > 0 ? allImages[0] : "/assets/product1.jpeg",
      points: points.length > 0 ? points : [],
      ingredients,
      howToUse: req.body.howToUse || "",
      faq: parsedFaq,
      metaTitle: metaTitle || "",
      metaDescription: metaDescription || "",
      metaTags: metaTags || "",
    });

    const saved = await newProduct.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully!",
      product: saved,
    });
  } catch (error) {
    console.error("[Product API] Error creating product:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
});

// 4. UPDATE PRODUCT (Supports appending / replacing multiple images)
router.put("/:id", (req, res, next) => {
  upload.array("images", 10)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const {
      name,
      category,
      price,
      oldPrice,
      discount,
      discountType,
      shortDescription,
      description,
      subtitle,
      tag,
      short,
      stock,
      unit,
      status,
      metaTitle,
      metaDescription,
      metaTags,
      existingImages,
    } = req.body;

    if (name && name.trim()) product.name = name.trim();
    if (category && category.trim()) product.category = category.trim();
    if (price !== undefined) product.price = Number(price);
    if (oldPrice !== undefined) product.oldPrice = Number(oldPrice);
    if (discount !== undefined) product.discount = discount;
    if (discountType !== undefined) product.discountType = discountType;
    if (shortDescription !== undefined) product.shortDescription = shortDescription.trim();
    if (description !== undefined) product.desc = description.trim();
    if (subtitle !== undefined) product.subtitle = subtitle.trim();
    if (tag !== undefined) product.tag = tag;
    if (short !== undefined) product.short = short;
    if (stock !== undefined) product.stock = Number(stock);
    if (unit !== undefined) product.unit = unit;
    if (req.body.weight !== undefined) product.weight = req.body.weight;
    if (status !== undefined) product.status = status;
    if (metaTitle !== undefined) product.metaTitle = metaTitle;
    if (metaDescription !== undefined) product.metaDescription = metaDescription;
    if (metaTags !== undefined) product.metaTags = metaTags;

    if (req.body.benefits || req.body.points) {
      product.points = parseArray(req.body.benefits || req.body.points);
    }
    if (req.body.ingredients) {
      product.ingredients = parseArray(req.body.ingredients);
    }
    if (req.body.howToUse !== undefined) {
      product.howToUse = req.body.howToUse;
    }
    if (req.body.faq) {
      try {
        product.faq = typeof req.body.faq === "string" ? JSON.parse(req.body.faq) : req.body.faq;
      } catch {
        // ignore malformed faq
      }
    }

    // Merge existing kept images with newly uploaded images
    const newlyUploaded = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];
    let keptImages = existingImages !== undefined ? parseArray(existingImages) : product.images;

    const mergedImages = [...keptImages, ...newlyUploaded];
    if (mergedImages.length > 0) {
      product.images = mergedImages;
      product.image = mergedImages[0];
    }

    const updated = await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      product: updated,
    });
  } catch (error) {
    console.error("[Product API] Error updating product:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
});

// 5. DELETE PRODUCT
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Clean up uploaded images from disk if in /uploads/
    if (Array.isArray(product.images)) {
      product.images.forEach((img) => {
        if (img && img.startsWith("/uploads/")) {
          const filePath = path.join(uploadsDir, path.basename(img));
          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath);
            } catch (e) {
              console.warn("Could not delete image file from disk:", e.message);
            }
          }
        }
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully!",
    });
  } catch (error) {
    console.error("[Product API] Error deleting product:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
});

// 6. TOGGLE STATUS
router.patch("/:id/status", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    product.status = product.status === "Active" ? "Draft" : "Active";
    await product.save();

    return res.status(200).json({
      success: true,
      message: `Product marked as ${product.status}`,
      status: product.status,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update status" });
  }
});

export default router;

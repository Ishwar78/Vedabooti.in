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

// Initial 12 products to seed if database is empty
const defaultProducts = [
  {
    name: "Black 3X Power Oil",
    slug: "ashwagandha-powder",
    subtitle: "Strength & Vitality Care",
    category: "Health & Wellness",
    price: 299,
    oldPrice: 399,
    discount: "25% OFF",
    rating: "4.8",
    reviews: "1,230",
    tag: "Bestseller",
    short: "Strength & Vitality",
    image: "/assets/product1.jpeg",
    images: ["/assets/product1.jpeg", "/assets/product3.jpeg", "/assets/product2.jpeg", "/assets/combo.png"],
    desc: "A premium Ayurvedic herbal power oil made from authentic traditional roots and pure oils for strength, stamina, and overall vitality.",
    shortDescription: "Strength & Vitality Ayurvedic power oil formulated for daily rejuvenation.",
    points: [
      "Pure herbal formulation",
      "100% natural ingredients",
      "Clinically tested quality",
      "Made in India",
    ],
    status: "Active",
    stock: 120,
    unit: "ML",
  },
  {
    name: "Black 3X Power Caps",
    slug: "amla-powder",
    subtitle: "Shilajit + Ashwagandha 120 Veg",
    category: "Immunity",
    price: 249,
    oldPrice: 349,
    discount: "28% OFF",
    rating: "4.7",
    reviews: "980",
    tag: "20% OFF",
    short: "Energy & Stamina",
    image: "/assets/product3.jpeg",
    images: ["/assets/product3.jpeg", "/assets/product1.jpeg", "/assets/product4.jpeg"],
    desc: "Potent herbal capsules crafted with pure Shilajit, Ashwagandha, and natural energizing herbs for daily stamina and peak performance.",
    shortDescription: "Pure Shilajit + Ashwagandha capsules for stamina and natural power.",
    points: [
      "120 Veg Capsules",
      "Pure Shilajit & Ashwagandha",
      "Daily Energy & Stamina support",
      "Made in India",
    ],
    status: "Active",
    stock: 95,
    unit: "Capsules",
  },
  {
    name: "Black 3X Power Avleha",
    slug: "tulsi-leaves",
    subtitle: "Ayurvedic Rejuvenative 300g",
    category: "Immunity",
    price: 199,
    oldPrice: 299,
    discount: "33% OFF",
    rating: "4.8",
    reviews: "860",
    tag: "New",
    short: "Immunity & Vitality",
    image: "/assets/product2.jpeg",
    images: ["/assets/product2.jpeg", "/assets/product3.jpeg", "/assets/combo.png"],
    desc: "Traditional Chyawanprash formula crafted with pure Amla, rare Himalayan herbs, and gold spoon ritual for longevity and immune strength.",
    shortDescription: "300g Ayurvedic rejuvenative paste with Himalayan herbs.",
    points: [
      "300g Herbal Jam",
      "Immunity & Vitality boost",
      "Rich Ayurvedic herbs",
      "Made in India",
    ],
    status: "Active",
    stock: 80,
    unit: "Gram",
  },
  {
    name: "Black 3X Complete Power Kit",
    slug: "neem-powder",
    subtitle: "Complete Herbal Wellness Combo",
    category: "Health & Wellness",
    price: 4999,
    oldPrice: 6999,
    discount: "28% OFF",
    rating: "4.9",
    reviews: "1,840",
    tag: "Bestseller",
    short: "Complete Power Kit",
    image: "/assets/product4.jpeg",
    images: ["/assets/product4.jpeg", "/assets/combo.png", "/assets/product1.jpeg", "/assets/product2.jpeg"],
    desc: "Complete 3-in-1 wellness kit containing Power Oil, Power Capsules, Power Avleha, and Dulha Kit sachets with free gold spoon.",
    shortDescription: "All-in-one power combo with Oil, Capsules, Avleha and Dulha kit.",
    points: [
      "30ml Oil + 120 Caps + 300g Avleha",
      "Free Dulha Kit + Gold Spoon",
      "100% Ayurvedic Certified",
      "Free COD & Express Delivery",
    ],
    status: "Active",
    stock: 50,
    unit: "Kit",
  },
  {
    name: "Black 3X Shaadi Combo",
    slug: "triphala-churna",
    subtitle: "Dosti Wala Premium Combo",
    category: "Health & Wellness",
    price: 4999,
    oldPrice: 7999,
    discount: "37% OFF",
    rating: "4.9",
    reviews: "2,420",
    tag: "Offer Special",
    short: "Shaadi Wala Combo",
    image: "/assets/IMG-20260922-WA7722.jpg.jpeg",
    images: ["/assets/IMG-20260922-WA7722.jpg.jpeg", "/assets/combo.png", "/assets/product4.jpeg"],
    desc: "The ultimate gift combo designed for shaadi preparation and everyday rejuvenation with a complete herbal ritual.",
    shortDescription: "Special shaadi gift combo with complete herbal preparations.",
    points: [
      "Shaadi Wala Special Combo",
      "Premium Gift Packaging",
      "Clinically Trusted Ayurveda",
      "Made in India",
    ],
    status: "Active",
    stock: 65,
    unit: "Combo",
  },
  {
    name: "Dulha Kit Ritual",
    slug: "brahmi-powder",
    subtitle: "10-Day Ayurvedic Ritual",
    category: "Health & Wellness",
    price: 1999,
    oldPrice: 2499,
    discount: "20% OFF",
    rating: "4.8",
    reviews: "560",
    tag: "Special",
    short: "Dulha Ritual",
    image: "/assets/IMG-20260922-WA0006.jpg.jpeg",
    images: ["/assets/IMG-20260922-WA0006.jpg.jpeg", "/assets/product1.jpeg", "/assets/product3.jpeg"],
    desc: "Special 10-day ritual kit prepared for groom wellness with traditional potent herbs — Ek Dost Ki Taraf Se Shaadi Ka Tohfa.",
    shortDescription: "10-Day Ayurvedic groom ritual kit.",
    points: [
      "10-Day Ritual Packs",
      "Ek Dost Ki Taraf Se Shaadi Ka Tohfa",
      "100% Natural Certified",
      "Made in India",
    ],
    status: "Active",
    stock: 45,
    unit: "Box",
  },
  {
    name: "Giloy Tablets",
    slug: "giloy-tablets",
    subtitle: "Immunity Support",
    category: "Immunity",
    price: 279,
    oldPrice: 329,
    discount: "15% OFF",
    rating: "4.5",
    reviews: "390",
    tag: "Popular",
    short: "Daily Immunity",
    image: "/assets/product3.jpeg",
    images: ["/assets/product3.jpeg", "/assets/imunity.png"],
    desc: "Pure Giloy extracts formulated into convenient tablets to boost your body's natural defense mechanism and immunity.",
    shortDescription: "Natural Giloy extract tablets for year-round immunity.",
    points: ["Pure Giloy extract", "Daily immunity booster", "100% vegetarian", "Made in India"],
    status: "Active",
    stock: 140,
    unit: "Tablets",
  },
  {
    name: "Moringa Powder",
    slug: "moringa-powder",
    subtitle: "Nutrition Boost",
    category: "Nutrition",
    price: 249,
    oldPrice: 349,
    discount: "28% OFF",
    rating: "4.6",
    reviews: "510",
    tag: "New",
    short: "Daily Nutrition",
    image: "/assets/product2.jpeg",
    images: ["/assets/product2.jpeg", "/assets/herbal.png"],
    desc: "Organic drumstick leaf powder packed with essential vitamins, minerals, and antioxidants for daily vitality.",
    shortDescription: "Organic superfood drumstick leaf powder.",
    points: [
      "Rich in vitamins and minerals",
      "Superfood nutrition",
      "Zero artificial additives",
      "Made in India",
    ],
    status: "Active",
    stock: 110,
    unit: "Gram",
  },
  {
    name: "Shatavari Powder",
    slug: "shatavari-powder",
    subtitle: "Women's Wellness",
    category: "Health & Wellness",
    price: 299,
    oldPrice: 399,
    discount: "25% OFF",
    rating: "4.6",
    reviews: "280",
    tag: "Popular",
    short: "Women's Care",
    image: "/assets/product1.jpeg",
    images: ["/assets/product1.jpeg", "/assets/healt.png"],
    desc: "Traditional rejuvenating herb specifically formulated to support hormonal balance and female wellness.",
    shortDescription: "Pure Shatavari roots for hormonal support and vitality.",
    points: [
      "Natural hormone support",
      "Ayurvedic women's tonic",
      "100% pure Shatavari roots",
      "Made in India",
    ],
    status: "Active",
    stock: 85,
    unit: "Gram",
  },
  {
    name: "Herbal Hair Oil",
    slug: "herbal-hair-oil",
    subtitle: "Stronger, healthier hair",
    category: "Hair Care",
    price: 349,
    oldPrice: 449,
    discount: "22% OFF",
    rating: "4.8",
    reviews: "760",
    tag: "Bestseller",
    short: "Hair Care",
    image: "/assets/product4.jpeg",
    images: ["/assets/product4.jpeg", "/assets/haircare.png"],
    desc: "Formulated with Bhringraj, Amla, and 12 essential herbs to nourish the scalp, prevent hair fall, and promote strong roots.",
    shortDescription: "Bhringraj and Amla root nourishing hair oil.",
    points: [
      "Deep root nourishment",
      "Controls hair fall naturally",
      "No mineral oils or chemicals",
      "Made in India",
    ],
    status: "Active",
    stock: 130,
    unit: "ML",
  },
  {
    name: "Aloe Vera Gel",
    slug: "aloe-vera-gel",
    subtitle: "Cooling Skin Care",
    category: "Skin Care",
    price: 229,
    oldPrice: 299,
    discount: "23% OFF",
    rating: "4.7",
    reviews: "530",
    tag: "New",
    short: "Skin Soothing",
    image: "/assets/product2.jpeg",
    images: ["/assets/product2.jpeg", "/assets/skincare.png"],
    desc: "Pure soothing Aloe Vera gel extracted from fresh organic leaves to hydrate skin and calm sunburns and blemishes.",
    shortDescription: "Pure cooling organic Aloe Vera skin gel.",
    points: [
      "99% Pure Aloe Vera",
      "Deep hydration & soothing",
      "Non-sticky formulation",
      "Made in India",
    ],
    status: "Active",
    stock: 160,
    unit: "Gram",
  },
  {
    name: "Herbal Digest Tea",
    slug: "herbal-digest-tea",
    subtitle: "After-meal comfort",
    category: "Digestive",
    price: 199,
    oldPrice: 249,
    discount: "20% OFF",
    rating: "4.5",
    reviews: "220",
    tag: "Popular",
    short: "Herbal Tea",
    image: "/assets/product3.jpeg",
    images: ["/assets/product3.jpeg", "/assets/healt.png"],
    desc: "A calming herbal blend of Ginger, Fennel, Cardamom, and Mint for comfortable digestion and gut wellness.",
    shortDescription: "Ginger, fennel, and mint after-meal soothing tea.",
    points: [
      "Calms digestive discomfort",
      "100% natural herbs",
      "Caffeine-free soothing blend",
      "Made in India",
    ],
    status: "Active",
    stock: 90,
    unit: "Gram",
  },
];

// Helper to seed default products if empty
const ensureDefaultProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(defaultProducts);
      console.log("[Product API] Seeded 12 default products into MongoDB");
    }
  } catch (err) {
    console.error("[Product API] Error seeding default products:", err.message);
  }
};

// 1. GET ALL PRODUCTS
// Optional queries: ?status=Active, ?category=..., ?search=..., ?sort=...
router.get("/", async (req, res) => {
  try {
    await ensureDefaultProducts();

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
      stock: stock ? Number(stock) : 100,
      unit: unit || "Gram",
      status: status || "Active",
      images: allImages.length > 0 ? allImages : ["/assets/product1.jpeg"],
      image: allImages.length > 0 ? allImages[0] : "/assets/product1.jpeg",
      points: points.length > 0 ? points : ["Pure herbal formulation", "100% natural ingredients", "Made in India"],
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

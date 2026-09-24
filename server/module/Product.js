import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Product slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    subtitle: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    oldPrice: {
      type: Number,
      default: 0,
    },
    discount: {
      type: String,
      default: "",
    },
    discountType: {
      type: String,
      default: "Percentage",
    },
    rating: {
      type: String,
      default: "4.8",
    },
    reviews: {
      type: String,
      default: "850+",
    },
    tag: {
      type: String,
      default: "Bestseller",
    },
    short: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "Draft"],
      default: "Active",
    },
    // Multiple images uploaded by admin
    images: {
      type: [String],
      default: [],
    },
    // Primary/main image (first image fallback)
    image: {
      type: String,
      default: "",
    },
    desc: {
      type: String,
      default: "",
    },
    shortDescription: {
      type: String,
      default: "",
    },
    points: {
      type: [String],
      default: [],
    },
    ingredients: {
      type: [String],
      default: [],
    },
    howToUse: {
      type: String,
      default: "",
    },
    faq: [
      {
        question: { type: String, default: "" },
        answer: { type: String, default: "" },
      },
    ],
    stock: {
      type: Number,
      default: 100,
    },
    unit: {
      type: String,
      default: "Gram",
    },
    weight: {
      type: String,
      default: "",
    },
    metaTitle: {
      type: String,
      default: "",
    },
    metaDescription: {
      type: String,
      default: "",
    },
    metaTags: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook: ensure image points to first image in images array if present
productSchema.pre("save", function () {
  if (this.images && this.images.length > 0) {
    this.image = this.images[0];
  } else if (this.image && (!this.images || this.images.length === 0)) {
    this.images = [this.image];
  }
});

const Product = mongoose.model("Product", productSchema);

export default Product;

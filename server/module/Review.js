import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      index: true,
    },
    productSlug: {
      type: String,
      default: "",
      index: true,
    },
    productName: {
      type: String,
      default: "",
      trim: true,
    },
    productImage: {
      type: String,
      default: "",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userEmail: {
      type: String,
      required: false,
      default: "",
      lowercase: true,
      trim: true,
    },
    createdBy: {
      type: String,
      enum: ["Customer", "Admin"],
      default: "Customer",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    isVerifiedBuyer: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ["Approved", "Pending", "Rejected"],
      default: "Approved",
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;

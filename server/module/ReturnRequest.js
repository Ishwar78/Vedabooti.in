import mongoose from "mongoose";

const returnRequestSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    orderId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    customer: {
      name: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      address: { type: String, default: "" },
    },
    items: [
      {
        id: { type: String },
        name: { type: String },
        price: { type: Number, default: 0 },
        qty: { type: Number, default: 1 },
        image: { type: String, default: "" },
      },
    ],
    returnReason: {
      type: String,
      required: true,
      default: "Damaged / Defective Product",
      trim: true,
    },
    comments: {
      type: String,
      default: "",
      trim: true,
    },
    refundMethod: {
      type: String,
      required: true,
      enum: ["upi", "bank"],
      default: "upi",
    },
    refundDetails: {
      upiId: { type: String, default: "", trim: true },
      accountHolderName: { type: String, default: "", trim: true },
      accountNumber: { type: String, default: "", trim: true },
      ifscCode: { type: String, default: "", trim: true },
      bankName: { type: String, default: "", trim: true },
    },
    refundAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Refunded", "Completed"],
      default: "Pending",
    },
    adminNotes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ReturnRequest = mongoose.model("ReturnRequest", returnRequestSchema);
export default ReturnRequest;

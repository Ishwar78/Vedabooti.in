import mongoose from "mongoose";

const heroBannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Veda Booti - Pure Ayurvedic Healthcare",
      trim: true,
    },
    subtitle: {
      type: String,
      default: "100% Herbal & Natural Formulations",
      trim: true,
    },
    desktopImage: {
      type: String,
      required: true,
      trim: true,
    },
    mobileImage: {
      type: String,
      default: "",
      trim: true,
    },
    link: {
      type: String,
      default: "/shop",
      trim: true,
    },
    buttonText: {
      type: String,
      default: "Shop Now",
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const HeroBanner = mongoose.model("HeroBanner", heroBannerSchema);
export default HeroBanner;

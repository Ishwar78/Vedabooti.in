import mongoose from "mongoose";

const contactSettingsSchema = new mongoose.Schema(
  {
    titleLine1: {
      type: String,
      default: "We'd love to",
    },
    titleLine2: {
      type: String,
      default: "hear from you.",
    },
    description: {
      type: String,
      default:
        "Reach out to us for product information, order assistance, shipping queries or general support.",
    },
    email: {
      type: String,
      default: "support@vedabooti.com",
    },
    phone: {
      type: String,
      default: "+91 99999 99999",
    },
    businessName: {
      type: String,
      default: "Veda Booti Health Care",
    },
    address: {
      type: String,
      default: "India",
    },
    supportDays: {
      type: String,
      default: "Monday – Saturday",
    },
    supportTime: {
      type: String,
      default: "10:00 AM – 6:00 PM",
    },
    emailResponse: {
      type: String,
      default: "We usually reply within 24 hours",
    },
    instagram: {
      type: String,
      default: "https://instagram.com/vedabooti",
    },
    facebook: {
      type: String,
      default: "https://facebook.com/vedabooti",
    },
    youtube: {
      type: String,
      default: "https://youtube.com/@vedabooti",
    },
  },
  {
    timestamps: true,
  }
);

const ContactSettings =
  mongoose.models.ContactSettings ||
  mongoose.model("ContactSettings", contactSettingsSchema);

export default ContactSettings;

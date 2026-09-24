import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
    trim: true,
  },
  purpose: {
    type: String,
    enum: ["signup", "login"],
    required: true,
  },
  name: {
    type: String,
    default: "",
    trim: true,
  },
  phone: {
    type: String,
    default: "",
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // MongoDB TTL index: automatically deletes document after 600 seconds (10 mins)
  },
});

const Otp = mongoose.model("Otp", otpSchema);

export default Otp;

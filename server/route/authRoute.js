import express from "express";
import jwt from "jsonwebtoken";
import User from "../module/User.js";
import Otp from "../module/Otp.js";
import { sendOtpEmail } from "../config/email.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "vedabooti_user_jwt_secret_token_2026";

// Auth middleware for user protected routes
export const verifyUserToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Authorization token missing." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired session. Please login again." });
  }
};

// Helper to validate email format
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
};

// Helper to generate 6-digit random numeric OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/* =========================================================
   1. SEND SIGN-UP OTP
========================================================= */
router.post("/send-signup-otp", async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (name || "").trim();

    // Enforce: One email can only register once
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered. Please go to Login instead.",
        alreadyRegistered: true,
      });
    }

    // Generate fresh OTP
    const otp = generateOtp();

    // Delete any old pending signup OTP for this email
    await Otp.deleteMany({ email: cleanEmail, purpose: "signup" });

    // Save OTP record (auto-expires in 10 minutes via MongoDB TTL)
    await Otp.create({
      email: cleanEmail,
      otp,
      purpose: "signup",
      name: cleanName,
      phone: (phone || "").trim(),
    });

    // Send OTP via Nodemailer
    await sendOtpEmail({
      email: cleanEmail,
      otp,
      purpose: "signup",
      name: cleanName,
    });

    return res.status(200).json({
      success: true,
      message: `OTP sent successfully to ${cleanEmail}. Please check your inbox.`,
    });
  } catch (error) {
    console.error("[Send Signup OTP Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP email. Please try again.",
      error: error.message,
    });
  }
});

/* =========================================================
   2. VERIFY SIGN-UP OTP & REGISTER USER
========================================================= */
router.post("/verify-signup-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = String(otp).trim();

    // Find latest signup OTP for this email
    const record = await Otp.findOne({ email: cleanEmail, purpose: "signup" }).sort({ createdAt: -1 });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired or was not requested. Please request a new OTP.",
      });
    }

    if (record.otp !== cleanOtp) {
      return res.status(400).json({
        success: false,
        message: "Incorrect OTP. Please enter the valid 6-digit code received on your email.",
      });
    }

    // Double check email hasn't been registered in parallel
    const duplicate = await User.findOne({ email: cleanEmail });
    if (duplicate) {
      await Otp.deleteMany({ email: cleanEmail, purpose: "signup" });
      return res.status(400).json({
        success: false,
        message: "This email is already registered. Please login.",
      });
    }

    // Create and save new user
    const newUser = new User({
      name: record.name || "Customer",
      email: cleanEmail,
      phone: record.phone || "",
      isVerified: true,
      role: "user",
      status: "Active",
    });

    const savedUser = await newUser.save();

    // Clean up OTP record
    await Otp.deleteMany({ email: cleanEmail, purpose: "signup" });

    // Generate 30-day JWT session token
    const token = jwt.sign(
      { id: savedUser._id, email: savedUser.email, role: savedUser.role },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.status(201).json({
      success: true,
      message: "Account registered successfully! Welcome to Veda Booti.",
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        phone: savedUser.phone,
        role: savedUser.role,
        createdAt: savedUser.createdAt,
      },
      cart: savedUser.cart || [],
    });
  } catch (error) {
    console.error("[Verify Signup OTP Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed.",
      error: error.message,
    });
  }
});

/* =========================================================
   3. SEND LOGIN OTP (To registered email only)
========================================================= */
router.post("/send-login-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user is registered
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "This email is not registered with us. Please create an account first.",
        notRegistered: true,
      });
    }

    if (user.status === "Blocked") {
      return res.status(403).json({
        success: false,
        message: "Your account is temporarily suspended. Please contact support.",
      });
    }

    // Generate fresh OTP
    const otp = generateOtp();

    // Delete any old pending login OTP
    await Otp.deleteMany({ email: cleanEmail, purpose: "login" });

    // Save OTP
    await Otp.create({
      email: cleanEmail,
      otp,
      purpose: "login",
      name: user.name,
    });

    // Send email via Nodemailer
    await sendOtpEmail({
      email: cleanEmail,
      otp,
      purpose: "login",
      name: user.name,
    });

    return res.status(200).json({
      success: true,
      message: `Login OTP sent to ${cleanEmail}. Please enter the code to sign in.`,
    });
  } catch (error) {
    console.error("[Send Login OTP Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send login OTP. Please try again.",
      error: error.message,
    });
  }
});

/* =========================================================
   4. VERIFY LOGIN OTP & SIGN IN
========================================================= */
router.post("/verify-login-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = String(otp).trim();

    // Find latest login OTP for this email
    const record = await Otp.findOne({ email: cleanEmail, purpose: "login" }).sort({ createdAt: -1 });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired or was not requested. Please request a new OTP.",
      });
    }

    if (record.otp !== cleanOtp) {
      return res.status(400).json({
        success: false,
        message: "Incorrect OTP. Please check the code sent to your email.",
      });
    }

    // Fetch user
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    if (user.status === "Blocked") {
      return res.status(403).json({
        success: false,
        message: "Your account is temporarily suspended. Please contact support.",
      });
    }

    // Clean up OTP record
    await Otp.deleteMany({ email: cleanEmail, purpose: "login" });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.status(200).json({
      success: true,
      message: "Welcome back! Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
      cart: user.cart || [],
    });
  } catch (error) {
    console.error("[Verify Login OTP Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Login verification failed.",
      error: error.message,
    });
  }
});

/* =========================================================
   5. GET LOGGED-IN USER PROFILE (/me)
========================================================= */
router.get("/me", verifyUserToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/* =========================================================
   6. UPDATE PROFILE
========================================================= */
router.put("/profile", verifyUserToken, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (name && name.trim()) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();

    const updated = await user.save();
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/* =========================================================
   6B. GET USER CART
========================================================= */
router.get("/cart", verifyUserToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("cart");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    return res.status(200).json({ success: true, cart: user.cart || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/* =========================================================
   6C. SYNC / UPDATE USER CART
========================================================= */
router.put("/cart", verifyUserToken, async (req, res) => {
  try {
    const { cart } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    user.cart = Array.isArray(cart) ? cart : [];
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Cart synced successfully.",
      cart: user.cart,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/* =========================================================
   6D. GET USER ADDRESSES
========================================================= */
router.get("/addresses", verifyUserToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("addresses");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    return res.status(200).json({ success: true, addresses: user.addresses || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/* =========================================================
   6E. ADD USER ADDRESS
========================================================= */
router.post("/addresses", verifyUserToken, async (req, res) => {
  try {
    const { fullName, phone, addressLine1, addressLine2, city, state, pincode, type, isDefault } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const newAddress = {
      fullName: fullName || user.name,
      phone: phone || user.phone || "",
      addressLine1: addressLine1 || "",
      addressLine2: addressLine2 || "",
      city: city || "",
      state: state || "",
      pincode: pincode || "",
      type: type || "Home",
      isDefault: Boolean(isDefault),
    };

    if (newAddress.isDefault && user.addresses.length > 0) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    user.addresses.push(newAddress);
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Address added successfully.",
      addresses: user.addresses,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/* =========================================================
   6F. DELETE USER ADDRESS
========================================================= */
router.delete("/addresses/:addressId", verifyUserToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    user.addresses = user.addresses.filter(
      (addr) => addr._id.toString() !== req.params.addressId
    );
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Address removed successfully.",
      addresses: user.addresses,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/* =========================================================
   7. ADMIN: LIST ALL USERS (/users)
========================================================= */
router.get("/users", async (req, res) => {
  try {
    const { search, status } = req.query;
    const filter = {};

    if (status && status !== "All") {
      filter.status = status;
    }

    if (search && search.trim()) {
      const term = search.trim();
      filter.$or = [
        { name: new RegExp(term, "i") },
        { email: new RegExp(term, "i") },
        { phone: new RegExp(term, "i") },
      ];
    }

    const users = await User.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/* =========================================================
   8. ADMIN: TOGGLE USER STATUS (Active / Blocked)
========================================================= */
router.patch("/users/:id/status", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    user.status = user.status === "Active" ? "Blocked" : "Active";
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User status changed to ${user.status}.`,
      status: user.status,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/* =========================================================
   9. ADMIN: DELETE USER
========================================================= */
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

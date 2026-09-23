import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../module/Admin.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "vedabooti_super_secret_jwt_key_2026";

// Auth middleware for protected routes
export const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized. Token missing." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};

// POST /login (or /api/admin/login)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const admin = await Admin.findOne({ email: cleanEmail });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("[Admin Login Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Server error occurred during login.",
      error: error.message,
    });
  }
});

// GET /me
router.get("/me", verifyAdminToken, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found." });
    }
    return res.status(200).json({ success: true, admin });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

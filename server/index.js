import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import connectDB from "./config/db.js";
import seedAdmin from "./config/seedAdmin.js";
import adminRoute from "./route/adminRoute.js";
import categoryRoute from "./route/categoryRoute.js";
import contactRoute from "./route/contactRoute.js";
import videoRoute from "./route/videoRoute.js";
import productRoute from "./route/productRoute.js";
import authRoute from "./route/authRoute.js";
import orderRoute from "./route/orderRoute.js";
import couponRoute from "./route/couponRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables reliably from server/.env
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5065;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
// Mount both /api/... and /... for maximum flexibility with frontend requests
app.use("/api/auth", authRoute);
app.use("/auth", authRoute);

app.use("/api/admin", adminRoute);
app.use("/admin", adminRoute);

app.use("/api/categories", categoryRoute);
app.use("/categories", categoryRoute);

app.use("/api/contact", contactRoute);
app.use("/contact", contactRoute);

app.use("/api/videos", videoRoute);
app.use("/videos", videoRoute);

app.use("/api/products", productRoute);
app.use("/products", productRoute);

app.use("/api/orders", orderRoute);
app.use("/orders", orderRoute);

app.use("/api/coupons", couponRoute);
app.use("/coupons", couponRoute);

// Root health check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Veda Booti Backend Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Start Server and Connect DB
const startServer = async () => {
  try {
    await connectDB();
    await seedAdmin();

    app.listen(PORT, () => {
      console.log(`[Server] Veda Booti API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("[Server] Startup Error:", error.message);
    process.exit(1);
  }
};

startServer();

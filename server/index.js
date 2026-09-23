import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import seedAdmin from "./config/seedAdmin.js";
import adminRoute from "./route/adminRoute.js";

import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables reliably from server/.env
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5065;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Routes
// Mount both /api/admin and /admin for flexibility with frontend requests
app.use("/api/admin", adminRoute);
app.use("/admin", adminRoute);

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

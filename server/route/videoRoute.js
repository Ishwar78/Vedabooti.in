import express from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import Video from "../module/Video.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage Configuration for Video Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const cleanBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    cb(null, `video-${Date.now()}-${cleanBase}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB limit for video files
  fileFilter: (req, file, cb) => {
    // Allow any standard video MIME or video file extension
    const allowedExts = [".mp4", ".webm", ".ogg", ".mov", ".mkv", ".avi", ".m4v"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (file.mimetype.startsWith("video/") || allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Please upload a valid video file (MP4, WebM, MOV, etc.)"), false);
    }
  },
});

// Default initial reels to seed if database is empty
const defaultReels = [
  {
    title: "Honey",
    tag: "100% NATURAL",
    videoSrc: "/assets/Video.mp4",
    link: "/shop",
    status: "Active",
    order: 1,
    author: "Priya S.",
  },
  {
    title: "Mushroom Biscuit",
    tag: "MUSHROOM BISCUIT",
    videoSrc: "/assets/Video.mp4",
    link: "/shop",
    status: "Active",
    order: 2,
    author: "Rahul K.",
  },
  {
    title: "Mushroom Biscuit",
    tag: "MUSHROOM BISCUIT",
    videoSrc: "/assets/Video.mp4",
    link: "/shop",
    status: "Active",
    order: 3,
    author: "Sneha M.",
  },
  {
    title: "Black 3X Power Kit",
    tag: "100% NATURAL",
    videoSrc: "/assets/Video.mp4",
    link: "/shop",
    status: "Active",
    order: 4,
    author: "Amit R.",
  },
  {
    title: "Dulha Kit Ritual",
    tag: "AYURVEDIC CARE",
    videoSrc: "/assets/Video.mp4",
    link: "/shop",
    status: "Active",
    order: 5,
    author: "Neha P.",
  },
];

// Helper to seed default videos if empty
const ensureDefaultVideos = async () => {
  try {
    const count = await Video.countDocuments();
    if (count === 0) {
      await Video.insertMany(defaultReels);
      console.log("[Video API] Seeded 5 initial customer video reels into MongoDB");
    }
  } catch (err) {
    console.error("[Video API] Error seeding initial videos:", err.message);
  }
};

// 1. GET ALL VIDEOS
// Optional query: ?status=Active
router.get("/", async (req, res) => {
  try {
    await ensureDefaultVideos();

    const query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }

    const videos = await Video.find(query).sort({ order: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: videos.length,
      videos,
    });
  } catch (error) {
    console.error("[Video API] Error fetching videos:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch videos",
      error: error.message,
    });
  }
});

// 2. GET SINGLE VIDEO
router.get("/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }
    return res.status(200).json({ success: true, video });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// 3. CREATE / UPLOAD NEW VIDEO
router.post("/", (req, res, next) => {
  upload.single("video")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "Video file is too large. Maximum size allowed is 200MB.",
        });
      }
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { title, tag, link, status, author, order, videoSrc: rawVideoSrc } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Video title is required." });
    }

    let finalVideoSrc = "";
    if (req.file) {
      finalVideoSrc = `/uploads/${req.file.filename}`;
    } else if (rawVideoSrc && rawVideoSrc.trim()) {
      finalVideoSrc = rawVideoSrc.trim();
    } else {
      return res.status(400).json({
        success: false,
        message: "Please upload a video file or provide a video URL/path.",
      });
    }

    const newVideo = new Video({
      title: title.trim(),
      tag: tag ? tag.trim() : "100% NATURAL",
      videoSrc: finalVideoSrc,
      link: link ? link.trim() : "/shop",
      status: status || "Active",
      order: order ? Number(order) : 0,
      author: author ? author.trim() : "",
    });

    const saved = await newVideo.save();

    return res.status(201).json({
      success: true,
      message: "Video added successfully!",
      video: saved,
    });
  } catch (error) {
    console.error("[Video API] Error creating video:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create video",
      error: error.message,
    });
  }
});

// 4. UPDATE VIDEO
router.put("/:id", (req, res, next) => {
  upload.single("video")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          success: false,
          message: "Video file is too large. Maximum size allowed is 200MB.",
        });
      }
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }

    const { title, tag, link, status, author, order, videoSrc: rawVideoSrc } = req.body;

    if (title && title.trim()) video.title = title.trim();
    if (tag !== undefined) video.tag = tag.trim();
    if (link !== undefined) video.link = link.trim();
    if (status) video.status = status;
    if (author !== undefined) video.author = author.trim();
    if (order !== undefined) video.order = Number(order);

    if (req.file) {
      // Remove old file if it was in /uploads/ and exists
      if (video.videoSrc && video.videoSrc.startsWith("/uploads/")) {
        const oldPath = path.join(uploadsDir, path.basename(video.videoSrc));
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch (e) {
            console.warn("Could not delete old video file:", e.message);
          }
        }
      }
      video.videoSrc = `/uploads/${req.file.filename}`;
    } else if (rawVideoSrc && rawVideoSrc.trim()) {
      video.videoSrc = rawVideoSrc.trim();
    }

    const updated = await video.save();

    return res.status(200).json({
      success: true,
      message: "Video updated successfully!",
      video: updated,
    });
  } catch (error) {
    console.error("[Video API] Error updating video:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update video",
      error: error.message,
    });
  }
});

// 5. DELETE VIDEO
router.delete("/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }

    // Unlink uploaded file if in /uploads/
    if (video.videoSrc && video.videoSrc.startsWith("/uploads/")) {
      const filePath = path.join(uploadsDir, path.basename(video.videoSrc));
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.warn("Could not delete video file from disk:", e.message);
        }
      }
    }

    await Video.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Video deleted successfully!",
    });
  } catch (error) {
    console.error("[Video API] Error deleting video:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete video",
      error: error.message,
    });
  }
});

// 6. TOGGLE STATUS
router.patch("/:id/status", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }

    video.status = video.status === "Active" ? "Draft" : "Active";
    await video.save();

    return res.status(200).json({
      success: true,
      message: `Video marked as ${video.status}`,
      status: video.status,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update status" });
  }
});

export default router;

import express from "express";
import jwt from "jsonwebtoken";
import SupportTicket from "../module/SupportTicket.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "vedabooti_user_jwt_secret_token_2026";

// Auth helper
const extractUser = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  try {
    const token = authHeader.split(" ")[1];
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

/* =========================================================
   1. CREATE NEW SUPPORT TICKET (User)
========================================================= */
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, orderId, category, subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Subject and message are required.",
      });
    }

    const authUser = extractUser(req);
    const userEmail = (email || authUser?.email || "").trim().toLowerCase();
    const userName = (name || authUser?.name || "Customer").trim();

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "Customer email is required.",
      });
    }

    // Generate readable Ticket ID e.g. SUP-482190
    const ticketId = `SUP-${Math.floor(100000 + Math.random() * 900000)}`;

    const newTicket = new SupportTicket({
      ticketId,
      user: authUser?.id || null,
      name: userName,
      email: userEmail,
      phone: phone || authUser?.phone || "",
      orderId: orderId ? orderId.trim() : "",
      category: category || "General Support",
      subject: subject.trim(),
      message: message.trim(),
      status: "Open",
    });

    await newTicket.save();

    return res.status(201).json({
      success: true,
      message: `Support ticket #${ticketId} created successfully. Our team will review it shortly.`,
      ticket: newTicket,
    });
  } catch (error) {
    console.error("[Support API] Create ticket error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create support ticket.",
      error: error.message,
    });
  }
});

/* =========================================================
   2. GET LOGGED-IN USER'S SUPPORT TICKETS
========================================================= */
router.get("/my-tickets", async (req, res) => {
  try {
    const authUser = extractUser(req);
    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: "Authentication required to view your support tickets.",
      });
    }

    const tickets = await SupportTicket.find({
      $or: [
        { user: authUser.id },
        { email: authUser.email.toLowerCase() },
      ],
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error("[Support API] Fetch user tickets error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch support tickets.",
      error: error.message,
    });
  }
});

/* =========================================================
   3. ADMIN: GET ALL SUPPORT TICKETS
========================================================= */
router.get("/", async (req, res) => {
  try {
    const { search, status, category } = req.query;
    const filter = {};

    if (status && status !== "All" && status !== "All Status") {
      filter.status = status;
    }

    if (category && category !== "All" && category !== "All Categories") {
      filter.category = category;
    }

    if (search && search.trim()) {
      const term = search.trim();
      filter.$or = [
        { ticketId: new RegExp(term, "i") },
        { name: new RegExp(term, "i") },
        { email: new RegExp(term, "i") },
        { orderId: new RegExp(term, "i") },
        { subject: new RegExp(term, "i") },
      ];
    }

    const tickets = await SupportTicket.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error("[Support API] Fetch all tickets error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch support tickets.",
      error: error.message,
    });
  }
});

/* =========================================================
   4. ADMIN: UPDATE TICKET STATUS / ADMIN REPLY
========================================================= */
const updateTicketHandler = async (req, res) => {
  try {
    const { status, adminReply } = req.body;
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found." });
    }

    if (status) ticket.status = status;
    if (adminReply !== undefined) ticket.adminReply = adminReply;

    await ticket.save();

    return res.status(200).json({
      success: true,
      message: `Ticket #${ticket.ticketId} updated successfully.`,
      ticket,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

router.patch("/:id/status", updateTicketHandler);
router.put("/:id/status", updateTicketHandler);
router.post("/:id/status", updateTicketHandler);

/* =========================================================
   5. ADMIN: DELETE TICKET
========================================================= */
router.delete("/:id", async (req, res) => {
  try {
    const ticket = await SupportTicket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found." });
    }
    return res.status(200).json({
      success: true,
      message: `Ticket #${ticket.ticketId} deleted successfully.`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

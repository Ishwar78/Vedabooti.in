import express from "express";
import ContactSettings from "../module/ContactSettings.js";
import ContactMessage from "../module/ContactMessage.js";

const router = express.Router();

// 1. GET CONTACT DETAILS
router.get("/details", async (req, res) => {
  try {
    let settings = await ContactSettings.findOne();
    if (!settings) {
      settings = await ContactSettings.create({});
    }
    return res.status(200).json({
      success: true,
      details: settings,
    });
  } catch (error) {
    console.error("[Contact API] Error fetching contact details:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch contact details",
      error: error.message,
    });
  }
});

// 2. UPDATE CONTACT DETAILS
router.put("/details", async (req, res) => {
  try {
    const payload = req.body || {};
    let settings = await ContactSettings.findOne();

    if (!settings) {
      settings = new ContactSettings(payload);
    } else {
      Object.assign(settings, payload);
    }

    await settings.save();

    return res.status(200).json({
      success: true,
      message: "Contact details updated successfully",
      details: settings,
    });
  } catch (error) {
    console.error("[Contact API] Error updating contact details:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update contact details",
      error: error.message,
    });
  }
});

// Also support POST /details
router.post("/details", async (req, res) => {
  try {
    const payload = req.body || {};
    let settings = await ContactSettings.findOne();

    if (!settings) {
      settings = new ContactSettings(payload);
    } else {
      Object.assign(settings, payload);
    }

    await settings.save();

    return res.status(200).json({
      success: true,
      message: "Contact details saved successfully",
      details: settings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to save contact details",
      error: error.message,
    });
  }
});

// 3. GET ALL MESSAGES
router.get("/messages", async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
});

// 4. SUBMIT A CONTACT MESSAGE
router.post("/messages", async (req, res) => {
  try {
    const { name, email, phone, orderId, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required.",
      });
    }

    const newMessage = await ContactMessage.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : "",
      orderId: orderId ? orderId.trim() : "",
      subject: subject ? subject.trim() : "General Inquiry",
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Thank you! Your message has been sent successfully.",
      messageData: newMessage,
    });
  } catch (error) {
    console.error("[Contact API] Error sending message:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
});

// 5. DELETE A CONTACT MESSAGE
router.delete("/messages/:id", async (req, res) => {
  try {
    const deleted = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete message",
      error: error.message,
    });
  }
});

// 6. UPDATE MESSAGE STATUS
router.patch("/messages/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Status updated",
      messageData: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: error.message,
    });
  }
});

export default router;

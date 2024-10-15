const express = require("express");
const router = express.Router();
const verifyToken = require("../../user-middleware/auth");
const notificationModel = require("../../models/notificationModel");

router.put("/notification", verifyToken, async (req, res) => {
  const { id, text, isRead } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Notification ID is required." });
  }

  try {
    const notification = await notificationModel.findById(id);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found." });
    }

    if (typeof text !== "undefined") {
      notification.text = text.trim();
    }

    if (typeof isRead !== "undefined") {
      notification.isRead = isRead;
    }

    const updatedNotification = await notification.save();

    res.status(200).json({
      msg: "Notification updated successfully",
      notification: updatedNotification,
    });
  } catch (err) {
    console.error("Error updating notification:", err);
    res.status(500).json({ error: "Could not update notification" });
  }
});

module.exports = router;

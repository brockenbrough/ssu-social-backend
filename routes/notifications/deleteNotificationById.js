const express = require("express");
const router = express.Router();
const verifyToken = require("../../user-middleware/auth");
const notificationModel = require("../../models/notificationModel");

router.delete("/notification/deleteById/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Notification ID is required." });
  }

  try {
    const deletedNotification = await notificationModel.findByIdAndDelete(id);
    res.status(200).json({ msg: "Notification deleted successfully." });
  } catch (err) {
    console.error("Error deleting notification:", err);
    res.status(500).json({ error: "Could not delete notification." });
  }
});

module.exports = router;

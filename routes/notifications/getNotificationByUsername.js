const express = require("express");
const router = express.Router();
const verifyToken = require("../../user-middleware/auth");

const notificationModel = require("../../models/notificationModel");

router.get("/notification/:username", verifyToken, async (req, res) => {
  const username = req.params.username;

  try {
    const notifications = await notificationModel
      .find({ username })
      .sort({ date: -1 });
    res.status(200).json({ notifications });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Could not fetch notifications" });
  }
});

module.exports = router;

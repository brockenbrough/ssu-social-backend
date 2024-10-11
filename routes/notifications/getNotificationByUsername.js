const express = require("express");
const router = express.Router();

const notificationModel = require("../../models/notificationModel");

router.get("/notification/:username", async (req, res) => {
  const username = req.params.username;

  try {
    const notifications = await notificationModel.find({ username });

    res.status(200).json({ notifications });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Could not fetch notifications" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const notificationModel = require("../../models/notificationModel");

router.delete("/notification/deleteByUsername", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required." });
  }

  try {
    const result = await notificationModel.deleteMany({ username });
    res.status(200).json({ msg: "Notifications deleted successfully." });
  } catch (err) {
    console.error("Error deleting notifications:", err);
    res.status(500).json({ error: "Could not delete notifications." });
  }
});

module.exports = router;

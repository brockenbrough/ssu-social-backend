const express = require("express");
const router = express.Router();
const verifyToken = require("../../../user-middleware/auth");
const messageModel = require("../../../models/messageModel");

router.put("/message/markAsRead", verifyToken, async (req, res) => {
  const { messageIds } = req.body;

  if (!Array.isArray(messageIds)) {
    return res.status(400).json({ message: "Message IDs are required." });
  }

  if (messageIds.length === 0) {
    return res
      .status(200)
      .json({ message: "Messages are marked as read successfully." });
  }

  try {
    const messages = await messageModel
      .find({ _id: { $in: messageIds } })
      .lean();

    if (messages.length === 0) {
      return res.status(404).json({ message: "No messages found" });
    }

    await messageModel.updateMany(
      { _id: { $in: messageIds } },
      { $set: { isRead: true } }
    );

    return res
      .status(200)
      .json({ message: "Messages are marked as read successfully." });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const verifyToken = require("../../../user-middleware/auth");
const chatRoomModel = require("../../../models/chatRoomModel");
const messageModel = require("../../../models/messageModel");

router.post("/message/lastMessage", verifyToken, async (req, res) => {
  const { chatRoomIds } = req.body;

  if (!Array.isArray(chatRoomIds)) {
    return res.status(400).json({ message: "Chat Room IDs are required." });
  }

  if (chatRoomIds.length === 0) {
    return res.status(200).json({ data: [] });
  }

  try {
    const chatRooms = await chatRoomModel
      .find({ _id: { $in: chatRoomIds } })
      .lean();
    if (chatRooms.length === 0) {
      return res.status(404).json({ message: "No chat rooms found." });
    }

    const lastMessages = await Promise.all(
      chatRoomIds.map(async (chatRoomId) => {
        const lastMessage = await messageModel
          .findOne({ chatRoomId })
          .sort({ date: -1 })
          .lean();

        if (lastMessage) return lastMessage;
        else return { chatRoomId };
      })
    );

    return res.status(200).json({ data: lastMessages });
  } catch (error) {
    console.error("Error fetching last messages:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

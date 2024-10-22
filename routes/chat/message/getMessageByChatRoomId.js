const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const verifyToken = require("../../../user-middleware/auth");
const chatRoomModel = require("../../../models/chatRoomModel");
const messageModel = require("../../../models/messageModel");

router.get("/message/getByChatRoomId/:chatRoomId", async (req, res) => {
  const { chatRoomId } = req.params;

  if (!chatRoomId) {
    return res.status(400).json({ message: "ChatRoomId is required." });
  }

  try {
    const roomExists = await chatRoomModel.exists({ _id: chatRoomId });
    if (!roomExists) {
      return res
        .status(404)
        .json({ message: `ChatRoomId with ID ${chatRoomId} not found.` });
    }

    const messages = await messageModel.find({ chatRoomId }).lean();

    return res.json({ data: messages });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Could not fetch messages" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const verifyToken = require("../../../user-middleware/auth");
const chatRoomModel = require("../../../models/chatRoomModel");
const userModel = require("../../../models/userModel");
const messageModel = require("../../../models/messageModel");

router.post("/message/", verifyToken, async (req, res) => {
  const { chatRoomId, senderId, receiverId, text, isRead } = req.body;

  if (!chatRoomId || !senderId || !receiverId || !text) {
    return res.status(400).json({
      message: "chatRoomId, senderId, receiverId and text are required.",
    });
  }

  if (text.trim() === "")
    return res.status(400).json({ message: "Text is required." });

  if (chatRoomId) {
    const chatRoomExists = await chatRoomModel.exists({ _id: chatRoomId });
    if (!chatRoomExists)
      return res
        .status(404)
        .json({ message: `Chat room with ID ${chatRoomId} not found.` });
  }

  if (senderId) {
    const senderExists = await userModel.exists({ _id: senderId });
    if (!senderExists)
      return res
        .status(404)
        .json({ message: `Sender with ID ${senderId} not found.` });
  }

  if (receiverId) {
    const receiverExists = await userModel.exists({ _id: receiverId });
    if (!receiverExists)
      return res
        .status(404)
        .json({ message: `Receiver with ID ${receiverId} not found.` });
  }

  const newMessage = new messageModel({
    chatRoomId,
    senderId,
    receiverId,
    text,
    isRead,
  });

  try {
    const response = await newMessage.save();
    res.status(201).json({
      message: "Message created successfully",
      data: response,
    });
  } catch (err) {
    console.error("Error creating message:", err);
    res.status(500).json({ error: "Could not create message" });
  }
});

module.exports = router;

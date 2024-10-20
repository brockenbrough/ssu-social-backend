const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const verifyToken = require("../../../user-middleware/auth");
const chatRoomModel = require("../../../models/chatRoomModel");
const userModel = require("../../../models/userModel");

router.post("/chatRoom/", async (req, res) => {
  const { participants } = req.body;

  if (
    !participants ||
    !Array.isArray(participants) ||
    participants.length !== 2
  ) {
    return res.status(400).json({ message: "2 Participants are required." });
  }

  const [participant1, participant2] = participants;

  if (!participant1.userId || !participant2.userId) {
    return res.status(400).json({ message: "Participants must have userId." });
  }

  for (let participant of participants) {
    const userExists = await userModel.exists({ _id: participant.userId });
    if (!userExists) {
      return res
        .status(404)
        .json({ message: `User with ID ${participant.userId} not found.` });
    }
  }

  const chatRoom = await chatRoomModel.findOne({
    "participants.userId": { $all: participants.map((p) => p.userId) },
  });

  if (chatRoom)
    return res.json({ message: "Chat room already exists", chatRoom });

  const newChatRoom = new chatRoomModel({
    participants: participants.map((participant) => ({
      userId: participant.userId,
      firstMessageId: participant.firstMessageId || null,
    })),
  });

  try {
    const response = await newChatRoom.save();
    res
      .status(201)
      .json({ message: "Chat room created successfully", response });
  } catch (err) {
    console.error("Error creating chat room:", err);
    res.status(500).json({ error: "Could not create chat room" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const verifyToken = require("../../../user-middleware/auth");
const chatRoomModel = require("../../../models/chatRoomModel");
const userModel = require("../../../models/userModel");

router.get("/chatRoom/getByUserId/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "UserId is required." });
  }

  try {
    const userExists = await userModel.exists({ _id: userId });
    if (!userExists) {
      return res
        .status(404)
        .json({ message: `User with ID ${userId} not found.` });
    }

    const chatRooms = await chatRoomModel
      .find({
        "participants.userId": { $all: [userId] },
      })
      .lean();

    if (!chatRooms)
      return res.json({ message: "No chat room found.", chatRooms: [] });
    else return res.json({ chatRooms });
  } catch (err) {
    console.error("Error fetching chat rooms:", err);
    res.status(500).json({ error: "Could not fetch chat rooms" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const verifyToken = require("../../../user-middleware/auth");
const userModel = require("../../../models/userModel");
const messageModel = require("../../../models/messageModel");

router.get("/message/getByUserId/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "userId is required." });
  }

  try {
    const userExists = await userModel.exists({ _id: userId });
    if (!userExists) {
      return res
        .status(404)
        .json({ message: `User with ID ${userId} not found.` });
    }

    const messages = await messageModel
      .find({
        $or: [{ receiverId: userId }, { senderId: userId }],
      })
      .lean();

    return res.json({ data: messages });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Could not fetch messages" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const newUserModel = require("../../models/userModel");


router.get("/user/getUserByUsername/:username", async (req, res) => {
  const { username } = req.params;

  try {
    // Find user by username
    const user = await newUserModel.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { _id, biography, profileImage } = user;

    // Return user data (excluding sensitive information like password)
    return res.json({
      _id,
      username,
      biography,
      profileImage,
    });
  } catch (error) {
    console.error("Error fetching user by username:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
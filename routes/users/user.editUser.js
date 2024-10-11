const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const newUserModel = require('../../models/userModel');
const { newUserValidation } = require('../../models/userValidator');
const { generateAccessToken } = require('../../utilities/generateToken');
const verifyToken = require('../../user-middleware/auth');

router.put('/user/editUser', verifyToken, async (req, res) => {
  const { id } = req.user;

  try {
    // Fetch the user from the database using the ID from the token
    const user = await newUserModel.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure the user ID matches the one in the token
    if (user._id.toString() !== id) {
      return res.status(403).json({ error: "Unauthorized to edit this information" });
    }

    // Validate the new user information
    const { error } = newUserValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.errors[0].message });
    }

    const { username, email, password, biography } = req.body;

    // Check if username is taken
    const existingUser = await newUserModel.findOne({ username: username });
    if (existingUser && existingUser._id.toString() !== id) {
      return res.status(409).json({ message: "Username is taken, pick another" });
    }

    // Hash the new password only if it's provided
    let hashPassword = user.password;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashPassword = await bcrypt.hash(password, salt);
    }

    // Update user information
    const updatedUser = await newUserModel.findByIdAndUpdate(
      id,
      { username, email, password: hashPassword, biography },
      { new: true }
    );

    // Generate a new token with the updated information
    const accessToken = generateAccessToken(updatedUser._id, updatedUser.email, updatedUser.username);
    res.header('Authorization', accessToken).json({ accessToken: accessToken });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Error updating user information" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../../models/userModel");
const verifyToken = require("../../user-middleware/auth");
const moderationMiddleware = require("../../user-middleware/moderationMiddleware");

// Route to update a user's biography by userId
router.put("/update-bio/:userId", verifyToken, moderationMiddleware, async (req, res) => {
  const { userId } = req.params;
  const { biography } = req.body;
  const { id } = req.user;

  try {
    // Find user by ID to get current details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure the user ID matches the one in the token
    if (user._id.toString() !== id) {
      return res.status(403).json({ error: "Unauthorized to edit this information" });
    }

    const contentWasCensored = req.censored;

    // Update biography, keeping other fields the same
    user.biography = biography;
    await user.save();

    res.json({
      censored: contentWasCensored,
      biography: biography,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating biography", error });
  }
  
});


module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../../models/userModel");
const verifyToken = require("../../user-middleware/auth");
const moderationMiddleware = require("../../user-middleware/moderationMiddleware");

// Route to fetch user's current biography
router.get("/get-bio/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;
  const { id } = req.user;

  try {
    // Ensure the user is authorized to view their bio
    if (userId !== id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Fetch user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user's biography (or empty string if no biography is set)
    res.json({ biography: user.biography || "" });
  } catch (error) {
    console.error("Error fetching biography:", error);
    res.status(500).json({ message: "Error fetching biography" });
  }
});

// Route to update a user's biography by userId
router.put("/update-bio/:userId", verifyToken, moderationMiddleware, async (req, res) => {
  const { userId } = req.params;
  const { biography } = req.body;
  const { id } = req.user;

  try {
    // Ensure the user is authorized to edit their biography
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure the user ID matches the one in the token
    if (user._id.toString() !== id) {
      return res.status(403).json({ error: "Unauthorized to edit this information" });
    }

    // Update the biography field with the new biography value
    user.biography = biography;
    await user.save();

    // Send the updated biography back in the response
    res.json({
      biography: user.biography, // Return the updated biography
    });
  } catch (error) {
    console.error("Error updating biography:", error);
    res.status(500).json({ message: "Error updating biography", error });
  }
});

module.exports = router;
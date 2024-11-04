const express = require("express");
const router = express.Router();
const User = require("../../models/userModel");

// Route to update a user's biography by userId
router.put("/update-bio/:userId", async (req, res) => {
  const { userId } = req.params;
  const { biography } = req.body;

  try {
    // Find user by ID to get current details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update biography, keeping other fields the same
    user.biography = biography;
    await user.save();

    
  } catch (error) {
    res.status(500).json({ message: "Error updating biography", error });
  }
  
});


module.exports = router;

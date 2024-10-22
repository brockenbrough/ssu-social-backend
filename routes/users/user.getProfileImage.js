const express = require("express");
const router = express.Router();
const User = require("../../models/userModel");

// Route to fetch a user's profile image by username
router.get("/user/getProfileImage/:username", async (req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username: username });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.profileImage) {
            return res.json({ imageUri: user.profileImage });
        } else {
            return res.status(404).json({ message: "Profile image not found" });
        }

    } catch (error) {
        console.error("Error fetching profile image:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const newUserModel = require("../../models/userModel");
const { S3Client, HeadObjectCommand } = require("@aws-sdk/client-s3");

// AWS S3 client setup
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

router.get("/user/getUserByUsername/:username", async (req, res) => {
  const { username } = req.params;
  const defaultProfileImageUrl =
    "https://ssusocial.s3.amazonaws.com/profilepictures/ProfileIcon.png"; // Default profile picture URL

  try {
    // Find user by username
    const user = await newUserModel.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found:", user.profileImage);

    let profileImage = user.profileImage || defaultProfileImageUrl;

    // If the user has a profile image, check if it still exists in S3
    if (user.profileImage) {
      const imageKey = decodeURIComponent(
        new URL(user.profileImage).pathname.substring(1)
      );

      try {
        const headCommand = new HeadObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: imageKey,
        });
        await s3Client.send(headCommand);
      } catch (error) {
        if (error.name === "NotFound") {
          profileImage = defaultProfileImageUrl;
        } else {
          console.error("Error checking image in S3:", error);
        }
      }
    }

    // Return user data (excluding sensitive information like password)
    return res.json({
      _id: user._id,
      username: user.username,
      biography: user.biography,
      profileImage: profileImage,
    });
  } catch (error) {
    console.error("Error fetching user by username:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

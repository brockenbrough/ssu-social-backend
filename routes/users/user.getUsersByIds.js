const express = require("express");
const router = express.Router();
const newUserModel = require("../../models/userModel");
const { S3Client, HeadObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

router.post("/user/getUsersByIds", async (req, res) => {
  const { userIds } = req.body;
  const defaultProfileImageUrl =
    "https://ssusocial.s3.amazonaws.com/profilepictures/ProfileIcon.png";

  if (!Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({ message: "User IDs are required." });
  }

  try {
    // Fetch all users by their IDs
    const users = await newUserModel.find({ _id: { $in: userIds } }).lean();

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Check each user's profile image in S3 (if applicable)
    const updatedUsers = await Promise.all(
      users.map(async (user) => {
        let profileImage = user.profileImage || defaultProfileImageUrl;

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

        return {
          _id: user._id,
          username: user.username,
          biography: user.biography,
          email: user.email,
          profileImage: profileImage,
        };
      })
    );

    return res.json(updatedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

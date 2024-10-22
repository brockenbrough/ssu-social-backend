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

router.get("/user/getUsersById/:userId", async (req, res) => {
  const { userId } = req.params;
  const defaultProfileImageUrl =
    "https://ssusocial.s3.amazonaws.com/profilepictures/ProfileIcon.png";

  try {
    const user = await newUserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

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

    return res.json({
      _id: user._id,
      username: user.username,
      biography: user.biography,
      email: user.email,
      profileImage: profileImage,
    });
  } catch (error) {
    console.error("Error fetching user by username:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

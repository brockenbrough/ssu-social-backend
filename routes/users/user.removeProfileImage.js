const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// Configure AWS SDK with your credentials and region
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Route to handle profile image removal
router.post('/profile/remove', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    // Find the user by username
    const user = await User.findOne({ username: name });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If the user has a profile image, delete it from S3
    if (user.profileImage) {
      const oldProfileImageUrl = new URL(user.profileImage);
      const oldKey = oldProfileImageUrl.pathname.substring(1); // Get the key from the URL path, skipping the leading '/'

      if (oldKey) {
        const deleteParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: oldKey,
        };

        await s3Client.send(new DeleteObjectCommand(deleteParams));
      }
    }

    // Set the user's profile image to the default image after removal
    user.profileImage = 'https://ssusocial.s3.amazonaws.com/profilepictures/ProfileIcon.png';
    await user.save();

    res.json({
      message: 'Profile image removed successfully',
      profileImage: user.profileImage, // Send back the default profile image URL
    });
  } catch (error) {
    console.error('Error removing profile image:', error);
    res.status(500).json({ message: 'Failed to remove profile image', error });
  }
});

module.exports = router;
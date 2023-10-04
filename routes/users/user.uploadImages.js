const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const User = require('../../models/userModel');

// Initialize GridFS stream
let gfs;
mongoose.connection.once('open', () => {
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('uploads');
});

router.post('/user/updateProfileImage/:username', async (req, res) => {
  console.log("Received request to update profile image for:", req.params.username);

  const username = req.params.username;

  // Handling the image upload
  let part = req.files.profileImage;
  let writeStream = gfs.createWriteStream({
    filename: 'img_' + username + '_' + part.name,
    mode: 'w',
    content_type: part.mimetype
  });

  writeStream.on('close', async (uploadedFile) => {
    try {
      // Once the image is uploaded, find the user by username and update their profile image details
      const user = await User.findOne({ username: req.params.username });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      user.profileImage = {
          filename: uploadedFile.filename,
          originalname: part.name,
          mimeType: part.mimetype
      };

      await user.save();

      res.status(200).json({ message: 'Profile image updated successfully', user });
    } catch (error) {
      console.error("Error updating user's profile image:", error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  writeStream.write(part.data);
  writeStream.end();
});

module.exports = router;

const express = require("express");
const router = express.Router();
const newPostModel = require('../../models/postModel');
const mongoose = require("mongoose");
const verifyToken = require('../../user-middleware/auth')

router.post("/posts/createPost", verifyToken, async (req, res) => {
  const { content, imageId } = req.body;

  // Get user information from token
  const { id, username } = req.user;

  const createNewPost = newPostModel({
    userId: mongoose.Types.ObjectId(id),
    username: username,
    content: content,
    imageId: imageId, 
  });

  try {
    const response = await newPostModel.create(createNewPost);
    res.json({ msg: 'Post created successfully' });
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'Could not create post' });
  }
});

module.exports = router;

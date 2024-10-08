const express = require("express");
const router = express.Router();
const newPostModel = require('../../models/postModel');
const mongoose = require("mongoose");
const verifyToken = require('../../user-middleware/auth')

router.post("/posts/createPost", verifyToken, async (req, res) => {
  const { content, imageUri } = req.body;

  const { id, username } = req.user;

  const createNewPost = newPostModel({
    userId: mongoose.Types.ObjectId(id),
    username: username,
    content: content,
    imageUri: imageUri,  // Ensure imageUri is stored in the post object
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
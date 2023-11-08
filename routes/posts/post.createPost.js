const express = require("express");
const router = express.Router();
const newPostModel = require('../../models/postModel');
const mongoose = require("mongoose");

router.post("/posts/createPost", async (req, res) => {
  const { id, username, content, imageId} = req.body;

  const createNewPost = newPostModel({
    userId : mongoose.Types.ObjectId(id),
    username: username,
    content: content,
    imageId: String,
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
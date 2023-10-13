const express = require("express");
const router = express.Router();
const newPostModel = require('../../models/postModel');
const mongoose = require("mongoose");

router.post("/posts/createPost", async (req, res) => {
  const { id, username, content, image} = req.body;

  const createNewPost = newPostModel({
    userId : mongoose.Types.ObjectId(id),
    username: username,
    content: content,
    image: image, 
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
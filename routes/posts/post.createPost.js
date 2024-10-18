const express = require('express');
const router = express.Router();
const newPostModel = require('../../models/postModel');
const mongoose = require('mongoose');
const verifyToken = require('../../user-middleware/auth');
const moderationMiddleware = require('../../user-middleware/moderationMiddleware');

router.post('/posts/createPost', verifyToken, moderationMiddleware, async (req, res) => {
  const { content, imageUri } = req.body;
  const { id, username } = req.user;

  try {
    // Access the censorship flag
    const contentWasCensored = req.censored;

    // Create the post with the censored content
    const createNewPost = newPostModel({
      userId: mongoose.Types.ObjectId(id),
      username: username,
      content: content,
      imageUri: imageUri,
    });

    // Save the post
    await newPostModel.create(createNewPost);

    // Inform the client if the content was censored
    res.json({
      msg: 'Post created successfully',
      censored: contentWasCensored,
      content: content,
    });
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'Could not create post' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const verifyToken = require('../../user-middleware/auth');
const newPostModel = require('../../models/postModel');
const moderationMiddleware = require('../../user-middleware/moderationMiddleware');

router.put('/posts/updatePost/:postId', verifyToken, moderationMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { isSensitive, content } = req.body;

  try {
    const post = await newPostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the content was censored by the moderation middleware
    const contentWasCensored = req.censored;
    const hasOffensiveText = req.hasOffensiveText;

    // Update post fields
    if (typeof isSensitive !== 'undefined') {
      post.isSensitive = isSensitive;
    }
    if (typeof content !== 'undefined') {
      post.content = content;
      post.hasOffensiveText = hasOffensiveText; // Set offensive flag
    }
    await post.save();

    // Send response, informing if content was censored
    res.status(200).json({
      msg: "Post updated successfully",
      censored: contentWasCensored,
      content: post.content,
      post
    });
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ error: 'Error updating post' });
  }
});

module.exports = router;

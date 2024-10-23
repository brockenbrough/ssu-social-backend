const express = require('express');
const router = express.Router();
const verifyToken = require('../../user-middleware/auth');
const newPostModel = require('../../models/postModel');

// Route to update the post's imageFlag field
router.put('/posts/updatePost/:postId', verifyToken, async (req, res) => {
  const { postId } = req.params;
  const { imageFlag } = req.body;

  try {
    // Find the post by ID
    const post = await newPostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Update the imageFlag field
    post.imageFlag = imageFlag;
    await post.save();

    res.status(200).json({ msg: "Post flag updated successfully", post });
  } catch (err) {
    console.error('Error updating post flag:', err);
    res.status(500).json({ error: 'Error updating post flag' });
  }
});

module.exports = router;

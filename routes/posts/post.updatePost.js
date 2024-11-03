const express = require('express');
const router = express.Router();
const verifyToken = require('../../user-middleware/auth');
const newPostModel = require('../../models/postModel');

router.put('/posts/updatePost/:postId', verifyToken, async (req, res) => {
  const { postId } = req.params;
  const { imageFlag } = req.body;

  // Check if imageFlag is present in the request body
  if (typeof imageFlag === 'undefined') {
    return res.status(400).json({ error: "imageFlag is required in the request body" });
  }

  try {
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

const express = require('express');
const router = express.Router();
const verifyToken = require('../../user-middleware/auth');
const newPostModel = require('../../models/postModel');

router.put('/posts/updatePost/:postId', verifyToken, async (req, res) => {
  const { postId } = req.params;
  const { imageFlag, content } = req.body;

  try {
    const post = await newPostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (typeof imageFlag !== 'undefined') {
      post.imageFlag = imageFlag;
    }
    if (typeof content !== 'undefined') {
      post.content = content;
    }
    await post.save();

    res.status(200).json({ msg: "Post flag updated successfully", post });
  } catch (err) {
    console.error('Error updating post flag:', err);
    res.status(500).json({ error: 'Error updating post flag' });
  }
});

module.exports = router;

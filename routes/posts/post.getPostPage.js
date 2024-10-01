const express = require("express");
const router = express.Router();
const Post = require("../../models/postModel");

router.get("/posts/getPostPage", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const posts = await Post.find()
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ error: "Error fetching posts" });
  }
});

module.exports = router;

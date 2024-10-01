const express = require("express");
const router = express.Router();
const Post = require("../../models/postModel");

router.get("/posts/getPostPage", async (req, res) => {
  const DEFAULT_POST_LIMIT = 10;
  const INITIAL_PAGE = 1;

  const page = parseInt(req.query.page) || INITIAL_PAGE;
  const limit = parseInt(req.query.limit) || DEFAULT_POST_LIMIT;

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

const express = require("express");
const router = express.Router();
const Post = require("../../models/postModel");

router.get("/posts/getPostPage", async (req, res) => {
  const INITIAL_PAGE = 1;
  const DEFAULT_POST_PER_PAGE = 10;

  const page = parseInt(req.query.page) || INITIAL_PAGE;
  const postsPerPage = parseInt(req.query.postPerPage) || DEFAULT_POST_PER_PAGE;

  try {
    const posts = await Post.find()
      .skip((page - 1) * postsPerPage)
      .limit(postsPerPage);

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ error: "Error fetching posts" });
  }
});

module.exports = router;

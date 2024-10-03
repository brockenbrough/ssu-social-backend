const express = require("express");
const router = express.Router();
const Post = require("../../models/postModel");

router.get("/posts/getAllByUsername/:username", async (req, res) => {
  const { username } = req.params;
  const posts = await Post.find({ username: username }).sort({ date: -1 });
  return res.status(200).json(posts);
});

module.exports = router;

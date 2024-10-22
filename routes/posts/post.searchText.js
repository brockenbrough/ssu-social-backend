const express = require("express");
const router = express.Router();
const newPostModel = require("../../models/postModel");
const fuzzysort = require("fuzzysort");

router.get("/post/search/:searchInput", async (req, res) => {
  const searchInput = req.params.searchInput;

  if (!searchInput) {
    return res.json([]);
  }

  try {
    const posts = await newPostModel.find();

    const results = fuzzysort.go(searchInput, posts, {
      key: "content",
      threshold: -1000,
    });

    const matchedPosts = results.map((result) => result.obj);
    return res.json(matchedPosts);
  } catch (error) {
    console.error("Error searching for posts:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

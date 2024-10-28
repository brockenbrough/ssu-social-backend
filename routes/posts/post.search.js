const express = require("express");
const router = express.Router();
const newPostModel = require("../../models/postModel");

router.get("/post/search/:searchInput", async (req, res) => {
  const searchInput = req.params.searchInput;

  if (!searchInput) {
    return res.json([]);
  }

  try {
    const posts = await newPostModel.find({
      content: { $regex: searchInput, $options: "i" } // 'i' for case-insensitive
    });

    return res.json(posts);
  } catch (error) {
    console.error("Error searching for posts:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
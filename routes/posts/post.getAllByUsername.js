const express = require("express");
const router = express.Router();
const newPostModel = require('../../models/postModel')

router.get("/posts/getAllByUsername/:username", async (req, res) => {
    const { username } = req.params
    const allPosts = await newPostModel.find({ username: username })
    return res.status(200).json(allPosts)
})

module.exports = router;


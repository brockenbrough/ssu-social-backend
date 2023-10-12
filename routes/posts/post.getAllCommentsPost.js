const express = require("express");
const router = express.Router();
const commentModel = require('../../models/commentsModel')

router.get("/posts/getAllCommentsPost/:postId", async (req, res) => {
    const { postId } = req.params
    const allComments = await commentModel.find({ postId: postId })
    return res.status(200).json(allComments)
})

module.exports = router;
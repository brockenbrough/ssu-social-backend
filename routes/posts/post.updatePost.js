const express = require("express");
const router = express.Router();
const newPostModel = require('../../models/postModel');
const verifyToken = require("../../user-middleware/auth");

router.put("/posts/updatePost/:postId", verifyToken, async (req, res) => {
    const { postId } = req.params;
    const { id } = req.user;

    try {
        const post = await newPostModel.findById(postId);

        if (!post) {
            return res.status(404).json({ error: "No post found" });
        }

        // Ensure the post belongs to the user
        if (post.userId.toString() !== id) {
            return res.status(403).json({ error: "Not authorized to update this post" });
        }

        // Update the post with the provided data
        const updatedPost = await newPostModel.findByIdAndUpdate(
            postId,
            req.body,
            { new: true } // Return the updated post
        );

        return res.json({ msg: "Post successfully updated", updatedPost });
    } catch (err) {
        console.error("Error updating post:", err);
        return res.status(500).json({ error: "Error updating post" });
    }
});

module.exports = router;

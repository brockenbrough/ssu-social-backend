const express = require("express");
const router = express.Router();
const newPostModel = require('../../models/postModel')

router.get("/posts/getAllByUsername/:username", async (req, res) => {
    const { username } = req.params
    newPostModel.exists({ username: username })
        .then(e => {
            if (!e) {
                return res.status(404).json('this user doesnt exists')
            } else {
                newPostModel.find({ username: username })
                    .then(userPosts => res.status(200).json(userPosts))
                    .catch(err => res.status(404).json({ err }));
            }
        })
})

module.exports = router;


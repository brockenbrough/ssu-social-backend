const express = require("express");
const router = express.Router();
const newPostModel = require('../../models/postModel')

router.put("/posts/updatePost/:postId", async (req, res) => { 
    const { postId } = req.params

    const updatePost = newPostModel.findByIdAndUpdate(req.params.postId, req.body)
        .then(post => res.json({msg: 'Post sucessfully updated'}))
        .catch(err =>res.status(400).json({ error: 'Unable to update the Database' }));
})
  
module.exports = router;
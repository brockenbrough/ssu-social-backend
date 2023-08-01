const express = require("express");
const router = express.Router();
const newPostModel = require('../../models/postModel')

router.delete("/posts/deletePost/:postId", async (req, res) => {  
  const { postId } = req.params
  
  const deletePost = await newPostModel.findByIdAndRemove(req.params.postId, req.body)
  .then(post => res.json({ msg: 'Post entry deleted successfully' }))
  .catch(err => res.status(404).json({ error: 'No Post found' }));
})

module.exports = router;
const express = require("express");
const router = express.Router();
const newPostModel = require('../../models/postModel')

router.get("/posts/getPostById/:postId", async (req, res) => {
  const { postId } = req.params

  newPostModel.findById(req.params.postId, req.body)
  .then(post => res.status(200).json(post))
  .catch(err => res.status(404).json({ error: 'No Post found' }));
});

module.exports = router;

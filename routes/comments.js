const express = require("express");

// CommentRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path 
const commentRoutes = express.Router();
//==============================================

// This will help us connect to the database
const comment = require("../models/commentsModel");

commentRoutes.post("/comments/comment/reply/:id", async (req, res) => {
  const { commentContent } = req.body;
  const { id } = req.params;

  if (!id && !commentContent) return res.status(403).json("Please provide the required fields");
  const data = await comment.findById(id).then(e => e)
  
    if(!data) return res.status(404).json('User does not exist')

  comment.findByIdAndUpdate(
    id,
    { $addToSet: { replies: `${commentContent}` } },
    { upsert: true }
  ).then(e => {

      return res.status(200).json(e)
  }).then(e => {
    return e
  })

});
// This section will help you get a list of all the comments.
commentRoutes.get("/comment", (req, res) => {
  comment.find()
  .then((comments) => res.json(comments))
    .catch((err) =>
      res.status(404).json({ commentsfound: "No comments found" })
    );
});

// Finds a specific comment by their id. Do "npm test" if you're making any changes to this.
commentRoutes.get("/comments/comment/:id", (req, res) => {
  comment.findById(req.params.id)
    .then((comment) => res.json(comment))
    .catch((err) =>
      res.status(404).json({ commentnotfound: "No comment found" })
    );
});

commentRoutes.get("/comments/comment/getCommentById/:postId", async (req,res) => {
  comment.find({postId: req.params.postId})
  .then (comment => res.status(200).json(comment))
  .catch((err)=>
    res.status(404).json({ commentnotfound : "No comment found"})
  );
})



// This section will help you create a new comment.
commentRoutes.post("/comments/comment/add", (req, res) => {
  comment.create(req.body)
    .then((comment) => res.json({ msg: "Comment added" }))
    .catch((err) =>
      res.status(400).json({ error: "Unable to add this comment" })
    );
});

// This section will help you update a comment by id.
commentRoutes.put("/comments/comment/update/:id", (req, res) => {
  comment.findByIdAndUpdate(req.params.id, req.body)
    .then((comment) => res.json({ msg: "Updated successfully" }))
    .catch((err) =>
      res.status(400).json({ error: "Unable to update the Database" })
    );
});

// This section will help you delete a comment
commentRoutes.delete("/comments/comment/:id", (req, res) => {
  comment.findByIdAndRemove(req.params.id, req.body)
    .then((comment) => res.json({ msg: "comment deleted successfully" }))
    .catch((err) => res.status(404).json({ error: "No comment" }));
});

// help you find a comment to reply to by id.

module.exports = commentRoutes;

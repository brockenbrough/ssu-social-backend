const express = require("express");
const route = express.Router();
const commentsSchema = require("../models/commentsModel");
const newPostModel = require("../models/postModel");

const likeSchema = require("../models/like");
const viewSchema = require("../models/view");


/**
 * Functions to add views and likes to posts
 */

//Allows a post to gain a view of a post
route.post('/views/view',async(req,res)=>{
  const userView={
    userId: req.body.userId,
    postId: req.body.postId,
  };

  try{
    const response=await viewSchema.create(userView);
    res.send(response);
  }catch{
    res.status(400).send({message:"Error trying to create new View"});
  }
});

//Alows a user to like a post
route.post('/likes/like', async(req,res) => {
  //Creating a timestamp object to pass to 
  const userLike = {
    userId: req.body.userId,
    postId: req.body.postId,
  };

  const likes = await likeSchema.findOne({userId: userLike.userId, postId: userLike.postId})
  console.log(likes)
  /**
   * Checking to see if the like exists in the database, if so, return a 404
   */
  if(likes){
    return res.status(404).json("Post has been liked already.")
  } else{
    const response = await likeSchema.create(userLike)
    return res.status(200).json(response)
  }
});

/**
 * Utility functions for likes.
 */

//returns a list of all likes
route.get('/like-list', async(req,res) => {
  const likes = await likeSchema.find()
  return res.json(likes)
});

//returns a list of posts that an individual user liked
route.get('/user-likes/:userId', async(req,res) => {
  const likes = await likeSchema.find({userId: req.params.userId}) 
  return res.json(likes)
});

//Function to unlike a post. 
route.delete('/likes/unLike', async(req,res) =>{
  try{
    const response = await likeSchema.deleteOne({userId: req.body.userId , postId : req.body.postId})
    res.status(200).json(response)
    console.log("Like deleted")
  }catch{
    res.status(400).send({message: "Like does not exist"})
  }
});


/**
 * Get functions for counting likes and views for users and posts
 */


route.get('/user-totallikes/:username', async (req, res) => {
  const {username} = req.params;

  try {
    // Find all posts created by the user

    const userPosts = await newPostModel.find({ username: username });

    // Extract the post IDs from the user's posts
    const postIds = userPosts.map(post => post._id);

    // Find the count of likes associated with the user's posts
    const likeCount = await likeSchema.countDocuments({ postId: { $in: postIds } });

    // Return the like count as a JSON response
    return res.json(likeCount);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


//Count the amount of posts a user liked
route.get('/count/likes-by-user/:userId', async(req,res) => {
  try{
    const response = await likeSchema.find({userId: req.params.userId}).count()
    return res.status(200).json(response)
  }catch{
    res.sendStatus(404).send({message: "User does not exist."})
  }
});

//Find the amount of likes by postId
route.get('/count/likes-for-post/:postId', async(req,res) => {
  try{
    const likes = await likeSchema.find({ postId: req.params.postId });
    const likeCount = likes.length; // Count the number of likes in the array

    return res.status(200).json(likeCount)
  }catch{
    res.sendStatus(404).send({message: "Post does not exist"})
  }
});

route.get('/count/comments-for-post/:postId', async(req,res) => {
  try{
    const comments = await commentsSchema.find({ postId: req.params.postId });
    const commentCount = comments.length; // Count the number of comments in the array


    return res.status(200).json(commentCount)
  }catch{
    res.sendStatus(404).send({message: "Post does not exist"})
  }
});


route.get('/views/:postId',async(req,res)=>{
 try {const response = await viewSchema.find({postId : req.params.postId}).count();
 res.status(200).json(response);
  } catch (error) {
    res.sendStatus(404).send({message: "Post does not exist"})
 } 
  

})

module.exports = route;






















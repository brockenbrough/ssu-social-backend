const express = require("express");
const { body, validationResult } = require('express-validator');
const route = express.Router();
const commentsSchema = require("../models/commentsModel");
const newPostModel = require("../models/postModel");
const likeSchema = require("../models/like");
const viewSchema = require("../models/view");
const userSchema = require("../models/userModel"); // Import user model

/**
 * Functions to add views and likes to posts
 */

// Allows a post to gain a view
route.post('/views/view', async (req, res) => {
  const userView = {
    userId: req.body.userId,
    postId: req.body.postId,
  };

  try {
    const response = await viewSchema.create(userView);
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: "Error trying to create new View" });
  }
});

// Allows a user to like a post
route.post('/likes/like', 
  body('userId').notEmpty().withMessage('User ID is required'),
  body('postId').notEmpty().withMessage('Post ID is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userLike = {
      userId: req.body.userId,
      postId: req.body.postId,
    };

    const existingLike = await likeSchema.findOne({ userId: userLike.userId, postId: userLike.postId });
    if (existingLike) {
      return res.status(400).json({ message: "Post has been liked already." });
    } 

    try {
      const response = await likeSchema.create(userLike);
      return res.status(200).json(response);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error liking post." });
    }
  }
);

/**
 * Utility functions for likes.
 */

// Returns a list of all likes
route.get('/like-list', async (req, res) => {
  try {
    const likes = await likeSchema.find();
    return res.json(likes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching likes." });
  }
});

// Returns a list of posts that an individual user liked
route.get('/user-likes/:userId', async (req, res) => {
  try {
    const likes = await likeSchema.find({ userId: req.params.userId });
    return res.json(likes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching user likes." });
  }
});

// Allows a user to unlike a post
route.delete('/likes/unLike', 
  body('userId').notEmpty().withMessage('User ID is required'),
  body('postId').notEmpty().withMessage('Post ID is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const response = await likeSchema.deleteOne({ userId: req.body.userId, postId: req.body.postId });
      if (response.deletedCount === 0) {
        return res.status(404).json({ message: "Like does not exist." });
      }
      res.status(200).json({ message: "Like removed successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error unliking post." });
    }
  }
);

/**
 * Get functions for counting likes and views for users and posts
 */

// Count total likes for posts created by a user
route.get('/user-totallikes/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const userPosts = await newPostModel.find({ username: username });
    const postIds = userPosts.map(post => post._id);
    const likeCount = await likeSchema.countDocuments({ postId: { $in: postIds } });
    return res.json(likeCount);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Count the number of posts a user liked
route.get('/count/likes-by-user/:userId', async (req, res) => {
  try {
    const likeCount = await likeSchema.countDocuments({ userId: req.params.userId });
    return res.status(200).json(likeCount);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error counting likes." });
  }
});

// Count the number of likes for a specific post
route.get('/count/likes-for-post/:postId', async (req, res) => {
  try {
    const likeCount = await likeSchema.countDocuments({ postId: req.params.postId });
    return res.status(200).json(likeCount);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ message: "Post does not exist." });
  }
});

// Count the number of comments for a specific post
route.get('/count/comments-for-post/:postId', async (req, res) => {
  try {
    const comments = await commentsSchema.find({ postId: req.params.postId });
    return res.status(200).json(comments.length);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ message: "Post does not exist." });
  }
});

// Count the number of views for a specific post
route.get('/views/:postId', async (req, res) => {
  try {
    const viewCount = await viewSchema.countDocuments({ postId: req.params.postId });
    res.status(200).json(viewCount);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ message: "Post does not exist." });
  }
});

/**
 * Route to get users who liked a specific post with profile images
 */
route.get('/likes/view-likes/:postId', async (req, res) => {
    const { postId } = req.params;
    console.log("Received request for likes of post ID:", postId); // Log incoming postId

    try {
        // Find likes for the post and populate user data
        const likes = await likeSchema.find({ postId })
            .populate({
                path: 'userId',
                select: 'username profileImage' // Assuming profileImage is the field in user schema
            });

        // Log the fetched likes
        console.log("Likes fetched from database:", likes);

        // Extract user info if likes are found
        const likedUsers = likes.map(like => ({
            username: like.userId.username,
            profileImage: like.userId.profileImage
        }));

        return res.status(200).json(likedUsers);
    } catch (error) {
        console.error("Error fetching likes:", error);
        return res.status(500).json({ message: "Error fetching likes" });
    }
});

module.exports = route;

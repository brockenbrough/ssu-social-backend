const express = require("express");

// followerRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /following.
const followerRoutes = express.Router();

// Follower model
const followerModel = require('../models/followerModel')
const followingModel = require('../models/followingModel')

// Retrieves a list of all users and their followers.
followerRoutes.get("/followers", async (req, res) => {
  const followers = await followerModel.find();
  return res.status(200).json(followers);
});

// Retrieves a list of all users and who they are following.
followerRoutes.get("/following", async (req, res) => {
  const following = await followingModel.find();
  return res.status(200).json(following);
});

// Retrieves all the followers of a user by id.
followerRoutes.get("/followers/:id", (req, res) => {
  followerModel
    .find({ userId: req.params.id })
    .then((followers) => res.json(followers))
    .catch((err) => res.status(404).json({ User: "No user found." }));
});

// Retrieves all the users that a certain user is following by id.
followerRoutes.get("/following/:id", (req, res) => {
  followingModel
    .find({ userId: req.params.id })
    .then((following) => res.json(following))
    .catch((err) => res.status(404).json({ User: "No user found." }));
});

// Follow a User
followerRoutes.post('/followers/follow', async (req, res) => {
  
  const { userId, targetUserId } = req.body;

  if (userId == null || userId == "")
    return res.status(400).json("Invalid parameters for userId.");
  if (targetUserId == null || targetUserId == "")
    return res.status(400).json("Invalid parameters for targetUserID");

  followingModel
    .updateOne({ userId: userId }, { $addToSet: { following: `${targetUserId}` } }, {upsert: true})
    .then(
      followerModel
        .updateOne(
          { userId: targetUserId },
          { $addToSet: { followers: `${userId}` } },
          {upsert: true})
        .then((e) => {
          return res.status(200).json(e);
        })
    ).then(e => {return e}).catch((err) => res.status(404).json({ Error: "Error occurred trying to follow a user." }));;
});

// To unfollow a user.
followerRoutes.delete("/followers/unfollow", async (req, res) => {

  const { userId, targetUserId } = req.body;

  if (userId == null || userId == "")
    return res.status(400).json("Invalid parameters for userId.");
  if (targetUserId == null || targetUserId == "")
    return result.status(400).json("Invalid parameters for targetUserId");

  followingModel.updateOne({ userId: userId },{ $pull: { following: `${targetUserId}` } }).catch((err) => res.status(404).json({ Error: "Error occurred trying to remove a following." }));
  followerModel.updateOne({ userId: targetUserId },{ $pull: { followers: `${userId}` } }).catch((err) => res.status(404).json({ Error: "Error occurred trying to remove a follower." }));
  res.status(200).json({Success: "Unfollowed User."})
});

module.exports = followerRoutes;
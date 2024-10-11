const express = require("express");
const router = express.Router();
const notificationModel = require("../../models/notificationModel");
const userModel = require("../../models/userModel");
const postModel = require("../../models/postModel");
const verifyToken = require("../../user-middleware/auth");
const { use } = require("chai");

const isValidData = async (data) => {
  if (!data.type || !data.text || !data.username || !data.actionUsername) {
    return {
      isValid: false,
      msg: "Missing required fields (type, text, username, or actionUsername)",
    };
  }

  if (!["like", "comment", "follow"].includes(data.type)) {
    return {
      isValid: false,
      msg: "Invalid type. Type Must be 'like', 'comment', or 'follow'.",
    };
  }

  if (data.text.trim() === "") {
    return {
      isValid: false,
      msg: "Text cannot be an empty string.",
    };
  }

  if ((data.type === "like" || data.type === "comment") && !data.postId) {
    return {
      isValid: false,
      msg: "postId is required when type is 'like' or 'comment'.",
    };
  }

  const user = await userModel.findOne({ username: data.username });
  if (!user) {
    return {
      isValid: false,
      msg: "Username does not exist.",
    };
  }

  const actionUser = await userModel.findOne({ username: data.actionUsername });
  if (!actionUser) {
    return {
      isValid: false,
      msg: "actionUsername does not exist.",
    };
  }

  if (data.postId) {
    const id = data.postId;
    const post = await postModel.findOne({ _id: id });

    if (!post) {
      return {
        isValid: false,
        msg: "Post does not exist.",
      };
    }
  }

  return { isValidData: true, msg: "Success" };
};

router.post("/notification/", async (req, res) => {
  let { type, text, username, isRead, postId, actionUsername } = req.body;
  type = type ? type.trim() : type;
  text = text ? text.trim() : text;
  username = username ? username.trim() : username;
  postId = postId ? postId.trim() : postId;
  actionUsername = actionUsername ? actionUsername.trim() : actionUsername;

  const { isValid, msg } = await isValidData({
    type,
    text,
    username,
    isRead,
    postId,
    actionUsername,
  });

  if (isValid === false) {
    res.status(400).json({ error: msg });
    return;
  }

  const notification = notificationModel({
    type: type.trim(),
    text: text.trim(),
    username: username,
    isRead: isRead,
    postId: postId,
    actionUsername: actionUsername,
  });

  try {
    const response = await notificationModel.create(notification);
    res
      .status(201)
      .json({ id: response._id, msg: "Notification created successfully" });
  } catch (err) {
    console.error("Error creating notification:", err);
    res.status(500).json({ error: "Could not create post" });
  }
});

module.exports = router;

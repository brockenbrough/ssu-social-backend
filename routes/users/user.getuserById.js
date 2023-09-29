const express = require("express");
const router = express.Router();
const z = require("zod");
const bcrypt = require("bcrypt");

const newUserModel = require("../../models/userModel");

router.get("/user/getUserById", async (req, res) => {
  var { userId } = req.body;

  newUserModel.findById(userId, function (err, user) {
    if (err) {
      console.log(err);
    }
    if (user==null) {
      res.status(404).send("userId does not exist.");
    } 
    else {
      return res.json(user);
    }
  });
});

//try comments out whatever is broke make a story
//change comment model so a comment can comment on a comment.
//create a pop up that asks the user if they actually wan to delete the comment.

module.exports = router;

const express = require("express");
const router = express.Router();
const newUserModel = require('../../models/userModel')

router.get('/user/getAll', async (req, res) => {
    const user = await newUserModel.find();
    return res.json(user)
  })

  module.exports = router;
const express = require('express');
const router = express.Router();
const newUserModel = require("../../models/userModel");

router.post('/user/deleteById', async (req, res) => {
    const { userId } = req.body;
    
    try {
      const user = await newUserModel.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).send("User not found");
      }
      return res.json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal server error");
    }
});

module.exports = router;
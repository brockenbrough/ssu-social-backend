const express = require("express");
const router = express.Router();
const newUserModel = require("../../models/userModel");

router.get("/user/search/:searchInput", async (req, res) => {
  const searchInput = req.params.searchInput;

  if (!searchInput) {
    return res.json({});
  }

  try {
    const users = await newUserModel.find({
      username: { $regex: searchInput, $options: "i" },
    });

    return res.json(users);
  } catch (error) {
    console.error("Error searching for users:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

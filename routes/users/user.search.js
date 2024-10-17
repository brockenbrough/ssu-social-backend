const express = require("express");
const router = express.Router();
const newUserModel = require("../../models/userModel");
const fuzzysort = require("fuzzysort");

router.get("/user/search/:searchInput", async (req, res) => {
  const searchInput = req.params.searchInput;

  if (!searchInput) {
    return res.json({});
  }

  try {
    const users = await newUserModel.find();

    const results = fuzzysort.go(searchInput, users, {
      key: "username",
      threshold: -1000,
    });

    const matchedUsers = results.map((result) => result.obj);

    return res.json(matchedUsers);
  } catch (error) {
    console.error("Error searching for users:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

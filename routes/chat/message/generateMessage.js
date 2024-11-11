const express = require("express");
const router = express.Router();
const verifyToken = require("../../../user-middleware/auth");

router.post("/message/generate", verifyToken, async (req, res) => {
  let { chatHistoryStr } = req.body;
  chatHistoryStr = chatHistoryStr.trim();

  if (!chatHistoryStr) return res.status(200).json({ message: "" });

  return res.status(200).json({ message: "AI generated Message!!!" });
});

module.exports = router;

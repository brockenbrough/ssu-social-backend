const express = require("express");
const router = express.Router();
const verifyToken = require("../../../user-middleware/auth");
const { generateMessage } = require("../../../utilities/openaiService");

router.post("/message/generate", verifyToken, async (req, res) => {
  let { chatHistoryStr } = req.body;
  chatHistoryStr = chatHistoryStr.trim();

  if (!chatHistoryStr) return res.json({ message: "" });

  try {
    const aiResponse = await generateMessage(chatHistoryStr);
    res.json({ message: aiResponse });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate response" });
  }
});

module.exports = router;

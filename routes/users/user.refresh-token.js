const express = require('express');
const { generateAccessToken } = require('../../utilities/generateToken')
const router = express.Router();

// Route to refresh the expiration time of the access token
router.post('/user/refresh-token', (req, res) => {
  const { id, email, username, password } = req.body;

  // Generate a new access token with an extended expiration time
  const newAccessToken = generateAccessToken(id, email, username, password);

  // Send the new access token in the response
  res.json({ accessToken: newAccessToken });
});

module.exports = router;
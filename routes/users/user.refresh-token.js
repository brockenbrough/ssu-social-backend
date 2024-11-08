const express = require('express');
const { generateAccessToken } = require('../../utilities/generateToken')
const router = express.Router();

// Route to refresh the expiration time of the access token
router.post('/user/refresh-token', (req, res) => {
  const { id, email, username, role } = req.body;

  // Generate a new access token with an extended expiration time
  const newAccessToken = generateAccessToken(id, email, username, role);

  // Send the new access token in the response
  res.json({ accessToken: newAccessToken });
});

module.exports = router;
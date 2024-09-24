const express = require('express');
const verifyToken = require('../../user-middleware/auth');  // Middleware to verify token
const { generateAccessToken } = require('../../utilities/generateToken');  // Import the named export
const router = express.Router();

// Route to generate token for the logged-in user
router.get('/generate-token', verifyToken, (req, res) => {
  // req.user contains the user data from the verified token
  const { id, email, username } = req.user;

  // Generate a new token based on the logged-in user's information
  const newAccessToken = generateAccessToken(id, email, username);  // Pass the id, email, and username

  // Send the new access token in the response
  res.json({ accessToken: newAccessToken });
});

module.exports = router;

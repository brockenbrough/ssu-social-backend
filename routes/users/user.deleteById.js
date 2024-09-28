const express = require('express');
const router = express.Router();
const newUserModel = require('../../models/userModel');
const verifyToken = require('../../user-middleware/auth'); // Middleware to verify token

router.delete('/user/deleteById/:id', verifyToken, async (req, res) => {
  const { id: userId } = req.params;  // Retrieve userId from URL params
  const { id: tokenUserId } = req.user;  // Extract userId from the token

  try {
    // Check if the tokenUserId (from the token) matches the userId (from the URL params)
    if (tokenUserId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this user' });
    }

    // Proceed to delete the user
    const deletedUser = await newUserModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;


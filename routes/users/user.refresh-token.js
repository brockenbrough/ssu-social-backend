const express = require("express");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utilities/generateToken");
const router = express.Router();
const jwt = require("jsonwebtoken");

const verifyRefreshToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return reject(new Error("Invalid or expired refresh token"));
      resolve(decoded);
    });
  });
};

// Route to refresh the access token
router.post("/user/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    console.log("No refresh token provided");
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = await verifyRefreshToken(refreshToken);
    const { id, email, username, role } = decoded;

    if (!id) throw new Error("Decoded token missing user ID");

    // Generate new tokens
    const newAccessToken = generateAccessToken(id, email, username, role);
    const newRefreshToken = generateRefreshToken(id, email, username, role);

    // Send the new tokens
    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("Error in refresh token route:", error.message);
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
});

module.exports = router;

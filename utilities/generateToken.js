const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const generateAccessToken = (id, email, username, role) => {
  return jwt.sign(
    { id: id, email, username, role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "60m",
    }
  );
};

const generateRefreshToken = (id, email, username, role) => {
  return jwt.sign(
    { id: id, email, username, role },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};

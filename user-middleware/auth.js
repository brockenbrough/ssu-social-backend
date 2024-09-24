const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token missing or invalid' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // Log the decoded token to verify its content (only for debugging, remove this in production)
    console.log('Decoded token:', user);

    // Ensure the token contains the user's ID
    if (!user.id) {
      return res.status(400).json({ message: 'Token does not contain valid user information' });
    }

    // Attach decoded token (user) to req.user
    req.user = user;

    next();
  });
};

module.exports = verifyToken;


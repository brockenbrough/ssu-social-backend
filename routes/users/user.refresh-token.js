const express = require('express');
const { generateAccessToken } = require('../../utilities/generateToken');
const router = express.Router();

router.post('/user/refresh-token', (req, res) => {
  const { decodedAccessToken } = req.body;
    if (!decodedAccessToken) {
      return res.status(400).json({ error: 'Invalid request: decodedAccessToken is missing' });
    }

    // Assuming decodedAccessToken is an object with id, email, username, and password properties
    const id = decodedAccessToken.id;
    const email = decodedAccessToken.email;
    const username = decodedAccessToken.username;
    const password = decodedAccessToken.password;



    if (!id || !email || !username || !password) {
      return res.status(400).json({ error: 'Invalid request: decodedAccessToken is incomplete' });
    }

    // Generate a new access token with a new expiration time
    const accessToken = generateAccessToken(id, email, username, password);

    res.header('Authorization', accessToken).send({ accessToken: accessToken })
});

module.exports = router;
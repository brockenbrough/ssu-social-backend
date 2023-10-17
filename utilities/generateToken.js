const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
dotenv.config();

const generateAccessToken = (id, email, username, password ) => {
    return jwt.sign({id: id, email, username, password},process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:'10m'
    })
 }

module.exports.generateAccessToken = generateAccessToken
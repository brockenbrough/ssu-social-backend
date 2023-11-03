const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
dotenv.config();

const generateAccessToken = (id, email, username ) => {
    return jwt.sign({id: id, email, username},process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:'60m'
    })
 }

module.exports.generateAccessToken = generateAccessToken
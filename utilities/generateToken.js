const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
dotenv.config();

const generateAccessToken = (id, email, username,role ) => {
    return jwt.sign({id: id, email, username, role},process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:'60m'
    })
    
 }

module.exports.generateAccessToken = generateAccessToken
const express = require("express");
const router = express.Router();
const z = require('zod')
const bcrypt = require("bcrypt");
const newUserModel = require('../../models/userModel')
const { newUserValidation } = require('../../models/userValidator');
const { generateAccessToken } = require('../../utilities/generateToken');

router.post('/user/editUser', async (req, res) => {
    // validate new user information
    const { error } = newUserValidation(req.body);
    if (error) return res.status(400).send({ message: error.errors[0].message });

    // store new user information
    const { userId, username, email, password, biography } = req.body;

    // check if username is available
    const user = await newUserModel.findOne({ username: username });
    if (user) userIdReg = JSON.stringify(user._id).replace(/["]+/g, '');
    if (user && userIdReg !== userId) return res.status(409).send({ message: "Username is taken, pick another" });

    // generates the hash
    const generateHash = await bcrypt.genSalt(Number(10));

    // parse the generated hash into the password
    const hashPassword = await bcrypt.hash(password, generateHash);

    // find and update user using stored information
    newUserModel.findByIdAndUpdate(userId, {
        username: username, // Access username from the request body
        email: email,
        password: hashPassword,
        biography: biography,
    }, function (err, user) {
        if (err) {
        console.log(err);
        } else {
        // create and send a new access token to local storage
        const accessToken = generateAccessToken(user._id, email, username, hashPassword, biography);
        res.header('Authorization', accessToken).send({ accessToken: accessToken });
        }
    });
    });

module.exports = router;
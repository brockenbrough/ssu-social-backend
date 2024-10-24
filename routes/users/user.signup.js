const express = require("express");
const router = express.Router();
const z = require('zod')
const bcrypt = require("bcrypt");
const { newUserValidation } = require('../../models/userValidator')
const newUserModel = require('../../models/userModel')
const { body, validationResult } = require('express-validator');

router.post('/user/signup', async (req, res) => {
    const { error } = newUserValidation(req.body);
    console.log(error)
    if (error) return res.status(400).send({ message: error.errors[0].message });

    const { username, email, password } = req.body

    //check if username already exists
    const user = await newUserModel.findOne({ username: username })
    if (user)
        return res.status(409).send({ message: "Username is taken, make another one" })

    // Check if the email already exists
    const existingEmail = await newUserModel.findOne({ email: email });
    if (existingEmail) {
        return res.status(409).send({ errors: { message: "Email already exists, Make another one" } });
    }

    //generates the hash
    const generateHash = await bcrypt.genSalt(Number(10))

    //parse the generated hash into the password
    const hashPassword = await bcrypt.hash(password, generateHash)

    //creates a new user
    const createUser = new newUserModel({
        username: username,
        email: email,
        password: hashPassword,
    });

   
    try {
        const saveNewUser = await createUser.save();
        res.send(saveNewUser);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: "Error trying to create new user" });
    }

})

module.exports = router;
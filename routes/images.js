const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const multer = require('multer');
const path = require('path');
const imageSchema = require('../models/imageModel');

// Configure AWS SDK with your credentials and region
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION // Set your S3 bucket region
});

// Configure multer to store the image in memory
const upload = multer({ storage: multer.memoryStorage() });

// Route to upload an image to S3
router.post('/images/create', upload.single('image'), async (req, res) => {
    const file = req.file;

    // Set up S3 upload parameters
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME, // Your S3 bucket name
        Key: `${Date.now()}_${file.originalname}`, // Unique filename
        Body: file.buffer,
        ContentType: file.mimetype
    };

    try {
        // Upload the image to S3
        const data = await s3.upload(params).promise();

        // Save the image URL in the database
        const newImage = new imageSchema({
            name: req.body.name,
            url: data.Location // S3 file URL
        });
        await newImage.save();

        res.json({ message: 'Image uploaded successfully', url: data.Location });
    } catch (error) {
        console.error('Error uploading image: ', error);
        res.status(500).json({ message: 'Failed to upload image', error });
    }
});

module.exports = router;
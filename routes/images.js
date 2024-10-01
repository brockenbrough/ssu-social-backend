const AWS = require('aws-sdk');
const multer = require('multer');
const express = require('express');
const router = express.Router();
const imageSchema = require('../models/imageModel');

// Configure AWS SDK with your credentials and region
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Set up multer to store the file in memory
const upload = multer({ storage: multer.memoryStorage() });

// Route to handle image upload
router.post('/images/create', upload.single('image'), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  if (!req.body.name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const data = await s3.upload(params).promise();

    const newImage = new imageSchema({
      name: req.body.name,
      uri: data.Location,  // Ensure this is the S3 URL
    });

    await newImage.save();

    // Return the imageUri (S3 URL) in the response
    res.json({
      message: 'Image uploaded successfully',
      imageUri: data.Location,  // Return the S3 URL (imageUri)
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Failed to upload image', error });
  }
});

module.exports = router;
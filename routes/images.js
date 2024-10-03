const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const express = require('express');
const router = express.Router();
const imageSchema = require('../models/imageModel');

// Configure AWS SDK with your credentials and region
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
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
    // Using v3's `PutObjectCommand` to upload the image
    const data = await s3Client.send(new PutObjectCommand(params));

    const imageUri = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;

    const newImage = new imageSchema({
      name: req.body.name,
      uri: imageUri,  // Ensure this is the S3 URL
    });

    await newImage.save();

    // Return the imageUri (S3 URL) in the response
    res.json({
      message: 'Image uploaded successfully',
      imageUri,  // Return the S3 URL (imageUri)
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Failed to upload image', error });
  }
});

// Route to handle image deletion
router.delete('/images/:imageKey', async (req, res) => {
  const { imageKey } = req.params;

  const deleteParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: imageKey,
  };

  try {
    // Using v3's `DeleteObjectCommand` to delete the image
    await s3Client.send(new DeleteObjectCommand(deleteParams));
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Failed to delete image', error });
  }
});

module.exports = router;
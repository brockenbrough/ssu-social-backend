const express = require("express");
const router = express.Router();
const newPostModel = require('../../models/postModel');
const AWS = require('aws-sdk');

// Configure AWS S3 SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Function to delete the image from S3
const deleteImageFromS3 = async (imageUri) => {
  const imageKey = imageUri.split('/').pop(); // Extract the image key from the URI
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME, // Your S3 bucket name
    Key: imageKey, // Image key (filename)
  };

  try {
    await s3.deleteObject(params).promise();
    console.log(`Image ${imageKey} deleted from S3`);
  } catch (error) {
    console.error('Error deleting image from S3:', error);
  }
};

router.delete("/posts/deletePost/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await newPostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'No Post found' });
    }

    // If the post has an image, delete it from S3
    if (post.imageUri) {
      await deleteImageFromS3(post.imageUri);
    }

    // Delete the post from the database
    await newPostModel.findByIdAndRemove(postId);
    return res.json({ msg: 'Post and associated image deleted successfully' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ error: 'Error deleting post' });
  }
});

module.exports = router;
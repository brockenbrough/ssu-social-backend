const express = require('express');
const router = express.Router();
const newPostModel = require('../../models/postModel');
const mongoose = require('mongoose');
const verifyToken = require('../../user-middleware/auth');
const moderationMiddleware = require('../../user-middleware/moderationMiddleware');
const rekognitionService = require('../../utilities/rekognitionService');

router.post('/posts/createPost', verifyToken, moderationMiddleware, async (req, res) => {
  const { content, imageUri, isSensitive } = req.body;
  const { id, username } = req.user;

  try {
    // Access the censorship flag
    const contentWasCensored = req.censored;
    const hasOffensiveText = req.hasOffensiveText;

    // Check for offensive content in the image 
    let imageIsSensitive = isSensitive || false;
    if (imageUri) {
      const imageBuffer = await axios.get(imageUri, { responseType: 'arraybuffer' });
      const moderationLabels = await rekognitionService.detectModerationLabels(imageBuffer.data);

      const offensiveLabels = ['Explicit Nudity', 'Violence', 'Hate Symbols', 'Graphic Violence', 'Rude Gestures', 'Drugs', 'Tobacco', 'Alcohol', 'Gambling', 'Weapons','Age Appropriate Content', 
        'Misleading Information', 'Harmful Information', 'Hate Speech'];
      const sensitiveLabels = ['Personal Information', 'Graphic Content', 'Emotional Triggering', 'Vulnerable Conditions'];

      const isOffensive = moderationLabels.some(label => offensiveLabels.includes(label.Name));
      const isSensitiveImage = moderationLabels.some(label => sensitiveLabels.includes(label.Name));

      if (isOffensive) {
        return res.status(400).json({ error: 'The image contains offensive content.' });
      }

      if (isSensitiveImage) {
        imageIsSensitive = true;
      }
    }

    // Create the post with the censored content
    const createNewPost = newPostModel({
      userId: mongoose.Types.ObjectId(id),
      username: username,
      content: content,
      imageUri: imageUri,
      hasOffensiveText: hasOffensiveText,
      isSensitive: isSensitive || false,
    });
    // Save the post
    await newPostModel.create(createNewPost);

    // Inform the client if the content was censored
    res.json({
      msg: 'Post created successfully',
      censored: contentWasCensored,
      content: content,
      post: createNewPost
    });
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'Could not create post' });
  }
});

module.exports = router;
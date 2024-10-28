const express = require('express');
const router = express.Router();
const View = require('../models/viewModel'); // Make sure this path is correct

//
// Route to get all views of a specific post
router.get('/views/:postId', async (req, res) => {
    const { postId } = req.params;
    
    try {
        // Find all views for the given postId
        const views = await View.find({ postId });

        // Return the views
        res.status(200).json(views);
    } catch (error) {
        // Handle any errors during the query
        res.status(500).json({ message: 'Server error. Could not retrieve views.', error });
    }
});

//
// Route to increase views on a post
router.post('/views/increase', async (req, res) => {
    const { userId, postId } = req.body;

    if (!userId || !postId) {
        return res.status(400).json({ message: 'userId and postId are required.' });
    }

    try {
        // Check if the user has already viewed the post
        const existingView = await View.findOne({ userId, postId });

        if (existingView) {
            // If user already viewed the post, do not increase the view count
            return res.status(200).json({ message: ' ' });
        }

        // If user hasn't viewed the post yet, create a new view
        const newView = new View({ userId, postId });
        await newView.save();

    } catch (error) {
        // Handle any errors during the process
        res.status(500).json({ message: 'Server error. Could not increase views.', error });
    }
});

module.exports = router;

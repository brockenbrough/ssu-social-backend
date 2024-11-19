const express = require('express');
const router = express.Router();
const View = require('../models/viewModel'); // Make sure this path is correct

//
// Route to get all views of a specific post
router.get('/views/:postId', async (req, res) => {
    const { postId } = req.params;
    
    try {
        // Count views for the given postId
        const viewCount = await View.countDocuments({ postId });

        // Return the view count
        res.status(200).json({ viewCount });
    } catch (error) {
        // Handle any errors during the query
        res.status(500).json({ message: 'Server error. Could not retrieve view count.', error });
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
            return res.status(200).json({ message: 'Unique View Already Exists' });
        }

        // Create a new view if the user hasn't viewed it yet
        const newView = new View({ userId, postId });
        await newView.save();

        return res.status(201).json({ message: 'View added successfully.' }); // Respond with success
    } catch (error) {
        res.status(500).json({ message: 'Server error. Could not increase views.', error });
    }
});


module.exports = router;

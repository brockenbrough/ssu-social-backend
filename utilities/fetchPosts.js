const Post = require('../models/postModel'); 
const rekognitionService = require('./rekognitionService');
const axios = require('axios');

async function fetchPosts(query) {
    if (!query || typeof query !== 'string'|| !query.trim()) {
        console.warn('Invalid or empty query provided to fetchPosts.');
        return [];
    }

    try {
        const regex = new RegExp(query, 'i');
        const posts = await Post.find({ content: regex }).lean();
        const filteredPosts = [];

        // Analyze images using Rekognition and filter posts based on labels
        for (const post of posts) {
            let includePost = false;

            if (post.imageUri) {
                const imageBuffer = await axios.get(post.imageUri, { responseType: 'arraybuffer' });
                const labels = await rekognitionService.detectLabels(imageBuffer.data);
                const labelNames = labels.map(label => label.Name.toLowerCase());

                // Check if any of the labels match the query
                if (labelNames.includes(query.toLowerCase())) {
                    post.labels = labels;
                    includePost = true;
                }
            }

            // Include the post if it matches the content query or has matching image labels
            if (regex.test(post.content) || includePost) {
                filteredPosts.push(post);
            }
        }

        return filteredPosts;
    } catch (error) {
        console.error(`Error fetching posts: ${error.message}`);
        throw error;
    }
}
module.exports = fetchPosts;
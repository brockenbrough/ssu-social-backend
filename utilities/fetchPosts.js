const Post = require('../models/postModel');
const rekognitionService = require('./rekognitionService');
const axios = require('axios');

class PostService {
    constructor() {
        
    }

    /**
     * Fetches posts that match the query in either content or image labels.
     * @param {string} query - The search query string.
     * @returns {Promise<Array>} - Filtered posts matching the query.
     */
    async fetchPosts(query) {
        if (!query || typeof query !== 'string' || !query.trim()) {
            console.warn('Invalid or empty query provided to fetchPosts.');
            return [];
        }

        try {
            const regex = new RegExp(query, 'i');

            const posts = await Post.find({ content: regex }).lean();

            const imageProcessingPromises = posts.map(async (post) => {
                let includePost = false;

                if (post.imageUri) {
                    try {
                        const imageBuffer = await axios.get(post.imageUri, { responseType: 'arraybuffer' });
                        const labels = await rekognitionService.detectLabels(imageBuffer.data);
                        const labelNames = labels.map((label) => label.Name.toLowerCase());

                        if (labelNames.includes(query.toLowerCase())) {
                            post.labels = labels; // Add labels to the post
                            includePost = true;
                        }
                    } catch (imageError) {
                        console.warn(`Error processing image for post ${post._id}:`, imageError.message);
                    }
                }

                if (regex.test(post.content) || includePost) {
                    return post;
                }

                return null;
            });

            const filteredPosts = (await Promise.all(imageProcessingPromises)).filter((post) => post !== null);

            return filteredPosts;
        } catch (error) {
            console.error(`Error fetching posts: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new PostService();

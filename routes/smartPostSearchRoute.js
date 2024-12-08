const express = require("express");
const router = express.Router();
const PerronSearchAlgorithm = require("../utilities/perronsSearchAlgo");
const AIPersonalization = require("../utilities/searchAIModule");
const postService = require("../utilities/fetchPosts");
const fetchUserInteractions = require("../utilities/fetchUserInteractions");

const validateSearchInput = (req, res, next) => {
    const { query } = req.body;
    if (!query || typeof query !== "string" || !query.trim()) {
        return res.status(400).json({ error: "Query must be a non-empty string." });
    }
    next();
};


router.post("/smartPostSearch/:userId", validateSearchInput, async (req, res) => {
    try {
        const { query } = req.body;
        const userId = req.params.userId;

        
        const posts = await postService.fetchPosts(query); 
        console.log('Fetched posts:', posts);
        console.log('Type of posts:', typeof posts);
        console.log('Is posts an array:', Array.isArray(posts));
        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: "No posts found matching the query." });
        }

        const userInteractions = await fetchUserInteractions(userId);    

        const perronSearch = new PerronSearchAlgorithm(posts, userInteractions);
        const filteredPosts = perronSearch.filterPosts(posts);

        const aiPersonalization = new AIPersonalization(query);
        const personalizedScores = aiPersonalization.computeRelevance(filteredPosts);

        const results = filteredPosts.map((post, index) => ({
            ...post,
            relevanceScore: personalizedScores[index],
        }));
        res.json({ results });
    } catch (error) {
        console.error("Error during search process:", error); // Log the error details
        res.status(500).json({ error: "An error occurred during the search process." });
    }
});

module.exports = router;
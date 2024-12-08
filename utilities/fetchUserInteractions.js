const Like = require('../models/like');
const Comment = require('../models/commentsModel');
const Following = require('../models/followingModel');

/**
 * Fetch user interactions from the database.
 * @param {string} userId - The userId of the user.
 * @returns {Object} An object containing the user's interactions.
 */
async function fetchUserInteractions(userId) {
    try {
        if (!userId) {
            throw new Error("User ID is required to fetch user interactions.");
        }

        const [likesResult, commentsResult, followingsResult] = await Promise.all([
            fetchLikes(userId),
            fetchComments(userId),
            fetchFollowings(userId)
        ]);

        return {
            likes: likesResult,
            comments: commentsResult,
            followings: followingsResult
        };
    } catch (error) {
        console.error(`Error fetching user interactions: ${error.message}`);
        throw error;
    }
}

async function fetchLikes(userId) {
    return Like.find({ userId }).lean();
}

async function fetchComments(userId) {
    return Comment.find({ userId }).lean();
}

async function fetchFollowings(userId) {
    return Following.find({ userId }).lean();
}

module.exports = fetchUserInteractions;
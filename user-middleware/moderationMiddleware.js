const { moderateContent } = require('../utilities/openaiService');
const Filter = require('bad-words');
const customFlaggedWords = require('../utilities/customFlags');

const moderationMiddleware = async (req, res, next) => {
    try {
        const { content } = req.body;

        // If there's no content to moderate, proceed to the next middleware/route handler
        if (!content) {
            return next();
        }

        // Perform content moderation using OpenAI Moderation API
        const moderationResult = await moderateContent(content);

        // Check for severe categories
        const flaggedCategories = moderationResult.categories;
        const severeCategories = [
            'self-harm',
            'sexual',
            'violence',
            'harassment/hate',
            'illegal',
        ];

        const isSevere = severeCategories.some(
            (category) => flaggedCategories[category]
        );

        if (moderationResult.flagged && isSevere) {
            // Reject the content and send an error response
            return res.status(400).json({
                error: 'Your content contains disallowed content and cannot be submitted.',
                categories: flaggedCategories,
            });
        }

        // Initialize the profanity filter
        const filter = new Filter();

        // Add custom words to the filter
        filter.addWords(...customFlaggedWords);

        // Censor the content using the profanity filter
        let censoredContent = filter.clean(content);

        // Update the content in the request body with the censored text
        req.body.content = censoredContent;

        // Attach the moderation result and censorship flag to the request object
        req.moderation = moderationResult;
        req.censored = content !== censoredContent;

        // Proceed to the next middleware/route handler
        next();
    } catch (error) {
        console.error('Error in moderation middleware:', error);
        res.status(500).json({ error: 'An error occurred during content moderation.' });
    }
};

module.exports = moderationMiddleware;


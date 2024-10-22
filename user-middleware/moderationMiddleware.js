// moderationMiddleware.js
const {
  moderateContent,
  censorContent,
  preprocessText
} = require("../utilities/openaiService");
const customFlaggedWords = require("../utilities/customFlags"); // Ensure these words are policy-compliant

const moderationMiddleware = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content) {
      return next();
    }

    // Preprocess the text
    const preProcessedText = preprocessText(content);

    // Perform content moderation using OpenAI Moderation API
    const moderationResult = await moderateContent(preProcessedText);

    
    const severeCategories = [
      "hate",
      "hate/threatening",
      "self-harm",
      "sexual",
      "sexual/minors",
      "violence",
      "violence/graphic",
    ];

    const { categories } = moderationResult; // categories is an object with category flags

    const isSevere = severeCategories.some((category) => categories[category]);

    if (isSevere) {
      // Reject the content and send an error response
      return res.status(400).json({
        error:
          "Your content contains disallowed content and cannot be submitted.",
        categories: severeCategories.filter((category) => categories[category]),
      });
    }

    // Censor the content using OpenAI Chat Completion API
    const censoredContent = await censorContent(preProcessedText, customFlaggedWords);

    // Update the content in the request body with the censored text
    req.body.content = censoredContent;

    // Attach the moderation result and censorship flag to the request object
    req.moderation = moderationResult;
    req.censored = content !== censoredContent;

    next();
  } catch (error) {
    console.error("Error in moderation middleware:", error);
    res
      .status(500)
      .json({ error: "An error occurred during content moderation." });
  }
};

module.exports = moderationMiddleware;

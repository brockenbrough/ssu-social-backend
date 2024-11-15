// textToModerate and its functionality could possibly be improved 
// something like fieldsToModerate = ['content', 'commentContent', 'biography'];
// then loop through fieldsToModerate

const {
  moderateContent,
  censorContent,
  preprocessText
} = require("../utilities/openaiService");
const customFlaggedWords = require("../utilities/customFlags"); // Ensure these words are policy-compliant

const moderationMiddleware = async (req, res, next) => {
  try {
    // Use `content` if available; otherwise, fallback to `commentContent`
    const textToModerate = req.body.content || req.body.commentContent || req.body.biography;

    // If neither content field is provided, proceed to the next middleware
    if (!textToModerate) {
      return next();
    }

    // Preprocess the text
    const preProcessedText = preprocessText(textToModerate);

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
        error: "Your content contains disallowed content and cannot be submitted.",
        categories: severeCategories.filter((category) => categories[category]),
      });
    }

    // Censor the content using OpenAI Chat Completion API
    const censoredContent = await censorContent(preProcessedText, customFlaggedWords);

    // Update the appropriate field in the request body with the censored text
    if (req.body.content) {
      req.body.content = censoredContent;
    } else if (req.body.commentContent) {
      req.body.commentContent = censoredContent;
    } else if (req.body.biography) {
      req.body.biography = censoredContent;
    }

    // Attach the moderation result and censorship flag to the request object
    req.moderation = moderationResult;
    req.censored = textToModerate !== censoredContent;

    next();
  } catch (error) {
    console.error("Error in moderation middleware:", error);
    res.status(500).json({ error: "An error occurred during content moderation." });
  }
};

module.exports = moderationMiddleware;

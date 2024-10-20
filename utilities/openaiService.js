const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.CHAT_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Function to check for offensive content
const moderateContent = async (text) => {
  try {
    // Use OpenAI Moderation API
    const response = await openai.createModeration({
      input: text,
    });

    const results = response.data.results[0];

    return {
      flagged: results.flagged,
      categories: results.categories,
    };
  } catch (error) {
    console.error('Error with OpenAI moderation:', error);
    throw new Error('OpenAI moderation error');
  }
};

module.exports = { moderateContent };

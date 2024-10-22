const { Configuration, OpenAIApi } = require("openai");

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
    console.error("Error with OpenAI moderation:", error);
    throw new Error("OpenAI moderation error");
  }
};

// Function to censor content using OpenAI Chat Completion API
const censorContent = async (text, customFlaggedWords) => {
  try {
    const customWordsList = customFlaggedWords.join(", ");

    const prompt = [
      {
        role: "system",
        content: `You are an assistant that censors disallowed content from user input. If the text contains any disallowed content or any of the following words: [${customWordsList}], replace them with asterisks (*). Do not change acceptable content.`,
      },
      {
        role: "user",
        content: text,
      },
    ];

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: prompt,
      temperature: 0,
      max_tokens: 500,
    });

    const censoredText = response.data.choices[0].message.content.trim();
    return censoredText;
  } catch (error) {
    console.error("Error with OpenAI censoring:", error);
    throw new Error("OpenAI censoring error");
  }
};

module.exports = { moderateContent, censorContent };

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
        content: `You are an assistant that censors disallowed content from user input. If the text contains any disallowed content or any of the following words: [${customWordsList}], replace them with asterisks (*). This includes words that are intentionally misspelled or obfuscated with spaces, numbers, or special characters. Do not change acceptable content.`,
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

// Function to escape regex special characters
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Function to reconstruct words with spaces between letters
const reconstructSpacedWords = (text) => {
  return text.replace(/\b(?:[a-zA-Z]\s+){1,}[a-zA-Z]\b/g, (match) => {
    return match.replace(/\s+/g, '');
  });
};

// Function to replace common obfuscated characters
const replaceObfuscatedCharacters = (text) => {
  const obfuscationMap = {
    '4': 'a',
    '@': 'a',
    '3': 'e',
    '€': 'e',
    '1': 'i',
    '!': 'i',
    '|': 'i',
    '0': 'o',
    '5': 's',
    '$': 's',
    '7': 't',
    '+': 't',
    '(': 'c',
    ')': 'c',
    '[': 'c',
    '{': 'c',
    '<': 'c',
    '®': 'r',
    '©': 'c',
    // Add more substitutions as needed
  };

  // Escape the keys to handle special regex characters
  const escapedKeys = Object.keys(obfuscationMap).map((key) => escapeRegExp(key));

  const regex = new RegExp(escapedKeys.join('|'), 'gi');

  return text.replace(regex, (char) => obfuscationMap[char.toLowerCase()] || char);
};

// Function to preprocess text
const preprocessText = (text) => {
  let normalizedText = text;
  normalizedText = reconstructSpacedWords(normalizedText);
  normalizedText = replaceObfuscatedCharacters(normalizedText);
  return normalizedText;
};

module.exports = {
  moderateContent,
  censorContent,
  preprocessText,
};
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.CHAT_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Obfuscation map defined globally
const obfuscationMap = {
  4: "a",
  "@": "a",
  3: "e",
  "€": "e",
  1: "i",
  "!": "i",
  "|": "i",
  0: "o",
  5: "s",
  $: "s",
  7: "t",
  "+": "t",
  "(": "c",
  ")": "c",
  "[": "c",
  "{": "c",
  "<": "c",
  "®": "r",
  "©": "c",
  // Add more substitutions as needed
};

// Function to escape regex special characters
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Generate a character class for obfuscated characters
const obfuscationChars = Object.keys(obfuscationMap)
  .map((char) => escapeRegExp(char))
  .join("");

// Function to reconstruct words where every character is separated by spaces
const reconstructSpacedWords = (text) => {
  const charClass = `[a-zA-Z${obfuscationChars}]`;
  // Match words where every character is separated by spaces, with at least 3 characters
  const regex = new RegExp(
    `\\b(${charClass})(?:\\s+${charClass}){2,}\\b`,
    "gi"
  );
  return text.replace(regex, (match) => {
    // Ensure we're only matching letters, obfuscated chars, and spaces
    if (
      /^([a-zA-Z${obfuscationChars}]\\s+)+[a-zA-Z${obfuscationChars}]$/.test(
        match
      )
    ) {
      return match.replace(/\s+/g, "");
    }
    return match;
  });
};

// Function to replace obfuscated characters within words containing letters
const replaceObfuscatedCharacters = (text) => {
  const escapedKeys = Object.keys(obfuscationMap).map((key) =>
    escapeRegExp(key)
  );
  const characterClass = `[${escapedKeys.join("")}]`;

  // Only process words that contain at least one letter
  return text.replace(/\b\w*[a-zA-Z]\w*\b/g, (word) => {
    return word.replace(new RegExp(characterClass, "gi"), (char) => {
      return obfuscationMap[char.toLowerCase()] || char;
    });
  });
};

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
        content: `You are a content moderation assistant. Your task is to review user input text and censor any disallowed content, including profanity, inappropriate language, and ${customWordsList}, regardless of obfuscation techniques such as added spaces between letters, substitution with numbers or special characters, or any other methods to bypass filters. For each detected disallowed word, replace every character of that word with asterisks (*), but preserve the original punctuation and spacing of acceptable content. Do not alter any acceptable content.

Examples where "[badword]" represents a disallowed word:

Input: "This is [badword] in a sentence."

Output: "This is ******* in a sentence."

Input: "[b a d w o r d] with spaces."

Output: "******* with spaces."

Input: "Normal acceptable text."

Output: "Normal acceptable text."

Input: "With spaces and special characters [b @ dw 0 r d]!"

Output: "With spaces and special characters *******!"

Input: "N0rm@l @((3ptable text."

Output: "N0rm@l @((3ptable text."`,
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

// Function to preprocess text
const preprocessText = (text) => {
  let normalizedText = text;
  normalizedText = reconstructSpacedWords(normalizedText);
  normalizedText = replaceObfuscatedCharacters(normalizedText);
  return normalizedText;
};

const generateMessage = async (chatHistoryStr) => {
  try {
    const prompt = [
      {
        role: "system",
        content: `Generate a unique, very short response based on the provided chat history, as if you are the user responding naturally in the conversation. Analyze the chat history thoroughly, reply in the user’s voice and tone, and return only the response text without any prefixes. Vary responses each time. Here "Me: " indicates the assistant user's messages. and other user messages are shown as with their username such as "Bob345: ". keep the conversation engaging and interesting. Generate your response for Me: but remove the Me: prefix.`,
      },
      {
        role: "user",
        content: `${chatHistoryStr}\nMe: `,
      },
    ];

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: prompt,
      max_tokens: 500,
      temperature: 0.7,
    });

    const generatedMessage = response.data.choices[0].message.content.trim();
    return generatedMessage;
  } catch (error) {
    console.error("Error generating message:", error);
    throw new Error("Failed to generate message.");
  }
};

module.exports = {
  moderateContent,
  censorContent,
  preprocessText,
  generateMessage,
};

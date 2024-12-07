const natural = require('natural');

class AIPersonalization {
    constructor(query) {
        this.query = query; // user query
    }

    // Compute AI relevance scores for posts
    computeRelevance(posts) {
        const tokenizer = new natural.WordTokenizer();
        const queryTokens = this.preprocessText(this.query, tokenizer);

        return posts.map(post => {
            const postTokens = this.preprocessText(post.content, tokenizer);
            return this.calculateSimilarity(queryTokens, postTokens);
        });
    }

    // Preprocess text: tokenize, lowercase, and stem
    preprocessText(text, tokenizer) {
        const tokens = tokenizer.tokenize(text.toLowerCase());
        const stemmer = natural.PorterStemmer;
        return tokens.map(token => stemmer.stem(token));
    }

    // Similarity calculation: Jaccard Similarity
    calculateSimilarity(tokensA, tokensB) {
        const setA = new Set(tokensA);
        const setB = new Set(tokensB);

        const intersection = [...setA].filter(token => setB.has(token)).length;
        const union = new Set([...setA, ...setB]).size;

        return union === 0 ? 0 : intersection / union;
    }
}

module.exports = AIPersonalization;

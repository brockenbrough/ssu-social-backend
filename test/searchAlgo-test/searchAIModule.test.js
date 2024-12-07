const natural = require('natural');
const AIPersonalization = require('../../utilities/searchAIModule');


describe('AIPersonalization', () => {
    test('should preprocess text correctly', () => {
        const ai = new AIPersonalization('');
        const tokenizer = new natural.WordTokenizer();
        const text = 'This is a Test';
        const expectedTokens = ['thi', 'is', 'a', 'test'];

        const tokens = ai.preprocessText(text, tokenizer);

        expect(tokens).toEqual(expectedTokens);
    });

    test('should compute relevance scores correctly', () => {
        const query = 'test query';
        const posts = [
            { content: 'this is a test post' },
            { content: 'another post with different content' },
            { content: 'test query in this post' }
        ];

        const ai = new AIPersonalization(query);
        const relevanceScores = ai.computeRelevance(posts);

        expect(relevanceScores).toHaveLength(3);
        expect(relevanceScores[0]).toBeGreaterThan(0);
        expect(relevanceScores[1]).toBe(0);
        expect(relevanceScores[2]).toBeGreaterThan(0);
    });

    test('should calculate similarity correctly', () => {
        const ai = new AIPersonalization('');

        const tokensA = ['test', 'query'];
        const tokensB = ['test', 'post'];
        const tokensC = ['completely', 'different'];

        const similarityAB = ai.calculateSimilarity(tokensA, tokensB);
        const similarityAC = ai.calculateSimilarity(tokensA, tokensC);

        expect(similarityAB).toBeGreaterThan(0);
        expect(similarityAC).toBe(0);
    });
});
describe('AIPersonalization', () => {
    test('should preprocess text correctly', () => {
        const ai = new AIPersonalization('');
        const tokenizer = new natural.WordTokenizer();
        const text = 'This is a Test';
        const expectedTokens = ['thi', 'is', 'a', 'test'];

        const tokens = ai.preprocessText(text, tokenizer);

        expect(tokens).toEqual(expectedTokens);
    });

    test('should compute relevance scores correctly', () => {
        const query = 'test query';
        const posts = [
            { 
                userId: '60d21b4667d0d8992e610c85', 
                username: 'user1', 
                content: 'this is a test post', 
                date: new Date(), 
                isSensitive: false, 
                hasOffensiveText: false 
            },
            { 
                userId: '60d21b4667d0d8992e610c86', 
                username: 'user2', 
                content: 'another post with different content', 
                date: new Date(), 
                isSensitive: false, 
                hasOffensiveText: false 
            },
            { 
                userId: '60d21b4667d0d8992e610c87', 
                username: 'user3', 
                content: 'test query in this post', 
                date: new Date(), 
                isSensitive: false, 
                hasOffensiveText: false 
            }
        ];

        const ai = new AIPersonalization(query);
        const relevanceScores = ai.computeRelevance(posts);

        expect(relevanceScores).toHaveLength(3);
        expect(relevanceScores[0]).toBeGreaterThan(0);
        expect(relevanceScores[1]).toBe(0);
        expect(relevanceScores[2]).toBeGreaterThan(0);
    });

    test('should calculate similarity correctly', () => {
        const ai = new AIPersonalization('');

        const tokensA = ['test', 'query'];
        const tokensB = ['test', 'post'];
        const tokensC = ['completely', 'different'];

        const similarityAB = ai.calculateSimilarity(tokensA, tokensB);
        const similarityAC = ai.calculateSimilarity(tokensA, tokensC);

        expect(similarityAB).toBeGreaterThan(0);
        expect(similarityAC).toBe(0);
    });
});
describe('AIPersonalization', () => {
    test('should preprocess text correctly', () => {
        const ai = new AIPersonalization('');
        const tokenizer = new natural.WordTokenizer();
        const text = 'This is a Test';
        const expectedTokens = ['thi', 'is', 'a', 'test'];

        const tokens = ai.preprocessText(text, tokenizer);

        expect(tokens).toEqual(expectedTokens);
    });

    test('should compute relevance scores correctly', () => {
        const query = 'test query';
        const posts = [
            { 
                userId: '60d21b4667d0d8992e610c85', 
                username: 'user1', 
                content: 'this is a test post', 
                date: new Date(), 
                isSensitive: false, 
                hasOffensiveText: false 
            },
            { 
                userId: '60d21b4667d0d8992e610c86', 
                username: 'user2', 
                content: 'another post with different content', 
                date: new Date(), 
                isSensitive: false, 
                hasOffensiveText: false 
            },
            { 
                userId: '60d21b4667d0d8992e610c87', 
                username: 'user3', 
                content: 'test query in this post', 
                date: new Date(), 
                isSensitive: false, 
                hasOffensiveText: false 
            }
        ];

        const ai = new AIPersonalization(query);
        const relevanceScores = ai.computeRelevance(posts);

        expect(relevanceScores).toHaveLength(3);
        expect(relevanceScores[0]).toBeGreaterThan(0);
        expect(relevanceScores[1]).toBe(0);
        expect(relevanceScores[2]).toBeGreaterThan(0);
    });

    test('should calculate similarity correctly', () => {
        const ai = new AIPersonalization('');

        const tokensA = ['test', 'query'];
        const tokensB = ['test', 'post'];
        const tokensC = ['completely', 'different'];

        const similarityAB = ai.calculateSimilarity(tokensA, tokensB);
        const similarityAC = ai.calculateSimilarity(tokensA, tokensC);

        expect(similarityAB).toBeGreaterThan(0);
        expect(similarityAC).toBe(0);
    });
});
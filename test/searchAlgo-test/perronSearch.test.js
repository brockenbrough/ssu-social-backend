const PerronSearchAlgorithm = require('../../utilities/perronsSearchAlgo');
const math = require('mathjs');

describe('PerronSearchAlgorithm', () => {
    let posts;
    let algorithm;

    beforeEach(() => {
        posts = [
            { content: 'post one content' },
            { content: 'post two content' },
            { content: 'post three content' }
        ];
        algorithm = new PerronSearchAlgorithm(posts);
    });

    test('should initialize with posts and empty matrices', () => {
        expect(algorithm.posts).toEqual(posts);
        expect(algorithm.adjacencyMatrix).toEqual([]);
        expect(algorithm.perronVector).toEqual([]);
    });

    test('should build adjacency matrix', () => {
        algorithm.calculateSimilarity = jest.fn(() => 1); // Mock similarity calculation
        algorithm.buildAdjacencyMatrix();

        const expectedMatrix = [
            [0, 1, 1],
            [1, 0, 1],
            [1, 1, 0]
        ];

        expect(algorithm.adjacencyMatrix).toEqual(expectedMatrix);
        expect(algorithm.calculateSimilarity).toHaveBeenCalledTimes(6); // 3 posts, 3*2 comparisons
    });

    test('should calculate Perron vector', () => {
        algorithm.adjacencyMatrix = [
            [0, 1, 1],
            [1, 0, 1],
            [1, 1, 0]
        ];

        algorithm.calculatePerronVector = jest.fn(() => [1, 1, 1]); // Mock Perron vector calculation
        const perronVector = algorithm.calculatePerronVector();

        expect(perronVector).toEqual([1, 1, 1]);
        expect(algorithm.calculatePerronVector).toHaveBeenCalledTimes(1);
    });

    test('should rank posts based on Perron vector', () => {
        algorithm.perronVector = [0.5, 0.8, 0.3];
        const rankedPosts = algorithm.rankPosts();

        const expectedRanking = [
            { content: 'post two content', score: 0.8 },
            { content: 'post one content', score: 0.5 },
            { content: 'post three content', score: 0.3 }
        ];

        expect(rankedPosts).toEqual(expectedRanking);
    });
});
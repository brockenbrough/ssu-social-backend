const PerronSearchAlgorithm = require('../../utilities/perronsSearchAlgo');
const math = require('mathjs');

jest.mock('mathjs', () => ({
    matrix: jest.fn((input) => input), 
    eigs: jest.fn(), 
}));

describe('PerronSearchAlgorithm', () => {
    let posts;
    let userInteractions;

    beforeEach(() => {
        posts = [
            { _id: 'post1', content: 'post one content' },
            { _id: 'post2', content: 'post two content' },
            { _id: 'post3', content: 'post three content' },
        ];

        userInteractions = {
            post1: ['userA', 'userB'],
            post2: ['userB', 'userC'],
            post3: ['userA', 'userC'],
        };

        math.eigs.mockClear();
    });

    test('should compute Perron vector using eigen decomposition', () => {
        const algorithm = new PerronSearchAlgorithm(posts, userInteractions);
        algorithm.buildAdjacencyMatrix();

        const mockEigenvectors = [
            [0.5, 0.6, 0.7],
            [0.6, 0.5, 0.4],
            [0.7, 0.4, 0.3],
        ];
        const mockValues = [1.2, 0.8, 0.7];
        math.eigs.mockReturnValue({
            values: mockValues,
            eigenvectors: mockEigenvectors,
        });

        algorithm.computePerronVector();

        expect(math.matrix).toHaveBeenCalledWith(algorithm.adjacencyMatrix); 
        expect(math.eigs).toHaveBeenCalledWith(algorithm.adjacencyMatrix); 
        expect(algorithm.perronVector).toEqual([0.5, 0.6, 0.7]); 
    });

    test('should rank posts based on Perron vector scores', () => {
        const algorithm = new PerronSearchAlgorithm(posts, userInteractions);
        algorithm.buildAdjacencyMatrix();

        const mockEigenvectors = [
            [0.5, 0.6, 0.7],
            [0.6, 0.5, 0.4],
            [0.7, 0.4, 0.3],
        ];
        const mockValues = [1.2, 0.8, 0.7];
        math.eigs.mockReturnValue({
            values: mockValues,
            eigenvectors: mockEigenvectors,
        });

        algorithm.computePerronVector();

        const rankedPosts = algorithm.rankPosts();
        const expectedRanking = [
            { _id: 'post3', content: 'post three content', score: 0.7 },
            { _id: 'post2', content: 'post two content', score: 0.6 },
            { _id: 'post1', content: 'post one content', score: 0.5 },
        ];

        expect(rankedPosts).toEqual(expectedRanking);
    });

    test('should filter posts using rankPosts logic', () => {
        const algorithm = new PerronSearchAlgorithm(posts, userInteractions);

        const mockEigenvectors = [
            [0.4, 0.5, 0.6],
            [0.5, 0.6, 0.7],
            [0.6, 0.7, 0.8],
        ];
        const mockValues = [1.1, 0.9, 0.8];
    
        jest.spyOn(math, 'eigs').mockReturnValue({
            values: mockValues,
            eigenvectors: mockEigenvectors,
        });
    
        algorithm.buildAdjacencyMatrix();
        algorithm.computePerronVector();
    
        const filteredPosts = algorithm.filterPosts();

        const expectedFilteredPosts = [
            { _id: 'post3', content: 'post three content', score: 0.6 },
            { _id: 'post2', content: 'post two content', score: 0.5 },
            { _id: 'post1', content: 'post one content', score: 0.4 },
        ];
    
        expect(filteredPosts).toEqual(expectedFilteredPosts);
    
        jest.restoreAllMocks(); 
    });
    
});

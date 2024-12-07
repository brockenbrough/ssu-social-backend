const userInteractions = require('../utilities/fetchUserInteractions');
const math = require('mathjs');

class PerronSearchAlgorithm {
    constructor(posts, userInteractions) {
        if (!Array.isArray(posts)) {
            throw new Error("Posts should be an array");
        }
        this.posts = posts; // Fetched posts based on the query
        this.userInteractions = userInteractions;
        this.adjacencyMatrix = [];
        this.perronVector = [];
        this.buildAdjacencyMatrix();
        this.computePerronVector();
    }

    // Step 1: Build Adjacency Matrix
    buildAdjacencyMatrix() {
        const n = this.posts.length;
        this.adjacencyMatrix = Array.from({ length: n }, () =>
            Array(n).fill(0)
        );

        // Fill adjacency matrix based on relationships between posts
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    this.adjacencyMatrix[i][j] = this.calculateSimilarity(
                        this.posts[i],
                        this.posts[j]
                    );
                }
            }
        }
    }

    // Similarity calculation (e.g., tag overlap or content similarity)
    calculateSimilarity(postA, postB) {
        const interactionsA = this.userInteractions[postA._id] || [];
        const interactionsB = this.userInteractions[postB._id] || [];
        const commonInteractions = interactionsA.filter(interaction => interactionsB.includes(interaction));
        return commonInteractions.length / Math.max(interactionsA.length, interactionsB.length);
    }

    // Step 2: Compute Perron Vector
    computePerronVector() {
        const matrix = math.matrix(this.adjacencyMatrix);
        const { values, eigenvectors } = math.eigs(matrix);
        const maxEigenIndex = values.toArray().indexOf(Math.max(...values.toArray()));
        this.perronVector = eigenvectors.map(row => row[maxEigenIndex]);
    }

    // Step 3: Rank Posts
    rankPosts() {
        return this.posts
            .map((post, index) => ({
                ...post,
                score: this.perronVector[index],
            }))
            .sort((a, b) => b.score - a.score)

    }
    filterPosts() {
        return this.rankPosts();
    }
}

module.exports = PerronSearchAlgorithm;

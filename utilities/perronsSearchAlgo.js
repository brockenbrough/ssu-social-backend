const userInteractions = require('../utilities/fetchUserInteractions');
const math = require('mathjs');

class PerronSearchAlgorithm {
    constructor(posts, userInteractions) {
        if (!Array.isArray(posts)) {
            throw new Error("Posts should be an array");
        }
        this.posts = posts; 
        this.userInteractions = userInteractions; 
        this.adjacencyMatrix = []; 
        this.perronVector = []; 
    }

    buildAdjacencyMatrix() {
        const n = this.posts.length;
        this.adjacencyMatrix = Array.from({ length: n }, () =>
            Array(n).fill(0)
        );

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

    calculateSimilarity(postA, postB) {
        const interactionsA = this.userInteractions[postA._id] || [];
        const interactionsB = this.userInteractions[postB._id] || [];
        const commonInteractions = interactionsA.filter(interaction =>
            interactionsB.includes(interaction)
        );

        // Avoid division by zero
        return commonInteractions.length / Math.max(interactionsA.length, interactionsB.length, 1);
    }

    computePerronVector() {
        const { values, eigenvectors } = math.eigs(math.matrix(this.adjacencyMatrix));
        const maxEigenIndex = values.indexOf(Math.max(...values));
        this.perronVector = eigenvectors.map(row => row[maxEigenIndex]);
    }

    rankPosts() {
        return this.posts
            .map((post, index) => ({
                ...post,
                score: this.perronVector[index],
            }))
            .sort((a, b) => b.score - a.score);
    }

    filterPosts() {
        return this.rankPosts();
    }
}

module.exports = PerronSearchAlgorithm;

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const searchRoute = require('../../routes/searchRoute');
const User = require('../../models/userModel');
const fetchPosts = require('../../utilities/fetchPosts');
const fetchUserInteractions = require('../../utilities/fetchUserInteractions');

// Mock the models and utilities
jest.mock('../../models/userModel', () => ({
    findOne: jest.fn(),
}));

jest.mock('../../utilities/fetchPosts', () => jest.fn());

jest.mock('../../utilities/fetchUserInteractions', () => jest.fn());

// Initialize Express app
const app = express();
app.use(express.json());
app.use('/api/search', searchRoute);

describe('Search Route Tests', () => {
    let mongoServer;

    beforeAll(async () => {
        // Use an in-memory MongoDB instance
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear mock calls and state between tests
    });

    test('should return 400 for invalid query input', async () => {
        const response = await request(app).post('/api/search').send({ query: '' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Query must be a non-empty string.');
    });

    test('should return 400 if user is not authenticated', async () => {
        const response = await request(app).post('/api/search').send({ query: 'test' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('User not authenticated.');
    });

    test('should return 404 if user is not found', async () => {
        User.findOne.mockResolvedValue(null); // Mock user not found

        const response = await request(app)
            .post('/api/search')
            .set('Authorization', 'Bearer token') // Simulate authentication
            .send({ query: 'test' });

        expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('User not found.');
    });

    test('should return 404 if no posts are found', async () => {
        User.findOne.mockResolvedValue({ _id: 'user123', username: 'testuser' }); // Mock user found
        fetchPosts.mockResolvedValue([]); // Mock no posts found

        const response = await request(app)
            .post('/api/search')
            .set('Authorization', 'Bearer token')
            .send({ query: 'test' });

        expect(fetchPosts).toHaveBeenCalledWith('test');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No posts found matching the query.');
    });

    test('should return 404 if no user interactions are found', async () => {
        User.findOne.mockResolvedValue({ _id: 'user123', username: 'testuser' }); // Mock user found
        fetchPosts.mockResolvedValue([{ id: 'post1', content: 'Post 1' }]); // Mock some posts
        fetchUserInteractions.mockResolvedValue(null); // Mock no interactions

        const response = await request(app)
            .post('/api/search')
            .set('Authorization', 'Bearer token')
            .send({ query: 'test' });

        expect(fetchUserInteractions).toHaveBeenCalledWith('user123');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No user interactions found.');
    });

    test('should return 200 with combined search results', async () => {
        User.findOne.mockResolvedValue({ _id: 'user123', username: 'testuser' });
        fetchPosts.mockResolvedValue([
            { id: 'post1', content: 'Post 1' },
            { id: 'post2', content: 'Post 2' },
        ]);
        fetchUserInteractions.mockResolvedValue({
            likes: ['post1'],
            comments: ['post2'],
            followings: [],
            followers: [],
        });

        const response = await request(app)
            .post('/api/search')
            .set('Authorization', 'Bearer token')
            .send({ query: 'test' });

        expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
        expect(fetchPosts).toHaveBeenCalledWith('test');
        expect(fetchUserInteractions).toHaveBeenCalledWith('user123');

        expect(response.status).toBe(200);
        expect(response.body.results).toBeDefined();
        expect(response.body.results.length).toBeGreaterThan(0);
        expect(response.body.results[0]).toHaveProperty('post');
        expect(response.body.results[0]).toHaveProperty('finalScore');
    });

    test('should return 500 for unexpected server errors', async () => {
        User.findOne.mockRejectedValue(new Error('Unexpected server error'));

        const response = await request(app)
            .post('/api/search')
            .set('Authorization', 'Bearer token')
            .send({ query: 'test' });

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('An error occurred while processing the search.');
    });
});

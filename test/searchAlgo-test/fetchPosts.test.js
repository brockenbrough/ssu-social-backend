const postService = require('../../utilities/fetchPosts'); // Import the instance
const Post = require('../../models/postModel');
const axios = require('axios');
const rekognitionService = require('../../utilities/rekognitionService');
const mongoose = require('mongoose');

jest.mock('../../models/postModel');
jest.mock('axios');
jest.mock('../../utilities/rekognitionService');

describe('PostService.fetchPosts', () => {
    beforeAll(() => {
        mongoose.connect = jest.fn();
    });

    beforeEach(() => {
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return an empty array if query is invalid or empty', async () => {
        const result = await postService.fetchPosts('');
        expect(result).toEqual([]);
        expect(console.warn).toHaveBeenCalledWith('Invalid or empty query provided to fetchPosts.');
    });

    test('should return posts matching the query', async () => {
        const mockPosts = [
            { content: 'test post 1', imageUri: null },
            { content: 'another test post', imageUri: null },
        ];
        Post.find.mockImplementation(() => ({
            lean: jest.fn().mockResolvedValue(mockPosts),
        }));

        const result = await postService.fetchPosts('test');
        expect(result).toEqual(mockPosts);
        expect(Post.find).toHaveBeenCalledWith({ content: /test/i });
    });

    test('should return posts with matching image labels', async () => {
        const mockPosts = [
            { content: 'test post 1', imageUri: 'http://example.com/image1.jpg' },
            { content: 'another test post', imageUri: 'http://example.com/image2.jpg' },
        ];
        const mockLabels = [{ Name: 'test' }];

        Post.find.mockImplementation(() => ({
            lean: jest.fn().mockResolvedValue(mockPosts),
        }));

        axios.get
            .mockResolvedValueOnce({ data: Buffer.from('mock image data 1') })
            .mockResolvedValueOnce({ data: Buffer.from('mock image data 2') });

        rekognitionService.detectLabels
            .mockResolvedValueOnce(mockLabels)
            .mockResolvedValueOnce(mockLabels);

        const result = await postService.fetchPosts('test');

        const expectedResult = [
            { content: 'test post 1', imageUri: 'http://example.com/image1.jpg', labels: mockLabels },
            { content: 'another test post', imageUri: 'http://example.com/image2.jpg', labels: mockLabels },
        ];

        expect(result).toEqual(expectedResult);
        expect(Post.find).toHaveBeenCalledWith({ content: /test/i });
        expect(axios.get).toHaveBeenCalledTimes(2);
        expect(rekognitionService.detectLabels).toHaveBeenCalledTimes(2);
    });

    test('should skip Rekognition for posts without imageUri', async () => {
        const mockPosts = [{ content: 'test post 1', imageUri: null }];
        Post.find.mockImplementation(() => ({
            lean: jest.fn().mockResolvedValue(mockPosts),
        }));

        const result = await postService.fetchPosts('test');
        expect(result).toEqual(mockPosts);
        expect(axios.get).not.toHaveBeenCalled();
        expect(rekognitionService.detectLabels).not.toHaveBeenCalled();
    });

    test('should return an empty array and log error if an error occurs', async () => {
        const mockError = new Error('Database error');

        Post.find.mockImplementation(() => ({
            lean: jest.fn().mockRejectedValue(mockError),
        }));

        try {
            await postService.fetchPosts('test');
        } catch (error) {
            expect(error).toBe(mockError);
            expect(Post.find).toHaveBeenCalledWith({ content: /test/i });
            expect(console.error).toHaveBeenCalledWith(`Error fetching posts: ${mockError.message}`);
        }
    });
});

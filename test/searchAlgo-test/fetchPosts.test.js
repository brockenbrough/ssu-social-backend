const fetchPosts = require('../../utilities/fetchPosts');
const Post = require('../../models/postModel');
const mongoose = require('mongoose');

jest.mock('../../models/postModel');

describe('fetchPosts', () => {
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
        const result = await fetchPosts('');
        expect(result).toEqual([]);
        expect(console.warn).toHaveBeenCalledWith('Invalid or empty query provided to fetchPosts.');
    });

    test('should return posts matching the query', async () => {
        const mockPosts = [
            { content: 'test post 1' },
            { content: 'another test post' }
        ];
        Post.find.mockResolvedValue(mockPosts);

        const result = await fetchPosts('test');
        expect(result).toEqual(mockPosts);
        expect(Post.find).toHaveBeenCalledWith({
            content: { $regex: 'test', $options: 'i' },
        });
    });

    test('should return an empty array and log error if an error occurs', async () => {
        const mockError = new Error('Database error');
        Post.find.mockRejectedValue(mockError);
        console.error = jest.fn();

        const result = await fetchPosts('test');
        expect(result).toEqual([]);
        expect(console.error).toHaveBeenCalledWith('Error fetching posts:', mockError);
    });
});
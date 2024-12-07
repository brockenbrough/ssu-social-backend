const fetchUserInteractions = require('../../utilities/fetchUserInteractions');
const User = require('../../models/userModel');
const Like = require('../../models/like');
const Comment = require('../../models/commentsModel');
const Following = require('../../models/followingModel');

jest.mock('../../models/userModel');
jest.mock('../../models/like');
jest.mock('../../models/commentsModel');
jest.mock('../../models/followingModel');

describe('fetchUserInteractions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.setTimeout(10000); // Set timeout to 10 seconds
    });

    test('should fetch interactions for a valid username', async () => {
        // Mock user lookup
        User.findOne.mockReturnValue({
            select: jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue({ _id: 'user123' }),
            }),
        });

        // Mock interactions
        Like.find.mockReturnValue({
            select: jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue([{ postId: 'post1' }, { postId: 'post2' }]),
            }),
        });
        Comment.find.mockReturnValue({
            select: jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue([{ postId: 'post3' }]),
            }),
        });
        Following.findOne.mockReturnValue({
            select: jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue({ following: ['user456', 'user789'] }),
            }),
        });

        const result = await fetchUserInteractions('mockUsername');

        expect(User.findOne).toHaveBeenCalledWith({ username: 'mockUsername' });
        expect(Like.find).toHaveBeenCalledWith({ userId: 'user123' });
        expect(Comment.find).toHaveBeenCalledWith({ userId: 'user123' });
        expect(Following.findOne).toHaveBeenCalledWith({ userId: 'user123' });

        expect(result).toEqual({
            userId: 'user123',
            likes: ['post1', 'post2'],
            comments: ['post3'],
            followings: ['user456', 'user789']        });
    });

    test('should return default values if username is not found', async () => {
        User.findOne.mockReturnValue({
            select: jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue(null),
            }),
        });

        const result = await fetchUserInteractions('unknownUser');

        expect(User.findOne).toHaveBeenCalledWith({ username: 'unknownUser' });
        expect(result).toEqual({
            userId: null,
            likes: [],
            comments: [],
            followings: []
        });
    });

    test('should return default values on database errors', async () => {
        User.findOne.mockReturnValue({
            select: jest.fn().mockReturnValue({
                lean: jest.fn().mockRejectedValue(new Error('Database error')),
            }),
        });

        const result = await fetchUserInteractions('mockUsername');

        expect(User.findOne).toHaveBeenCalledWith({ username: 'mockUsername' });
        expect(result).toEqual({
            userId: null,
            likes: [],
            comments: [],
            followings: [],
        });
    });
});

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
 
        Like.find.mockImplementation(() => ({
            lean: jest.fn().mockResolvedValue([{ postId: 'post1' }, { postId: 'post2' }]),
        }));
        Comment.find.mockImplementation(() => ({
            lean: jest.fn().mockResolvedValue([{ comment: 'Nice post!' }]),
        }));
        Following.find.mockImplementation(() => ({
            lean: jest.fn().mockResolvedValue([{ following: ['user456', 'user789'] }]),
        }));
    
        const result = await fetchUserInteractions('user123');

        expect(Like.find).toHaveBeenCalledWith({ userId: 'user123' });
        expect(Comment.find).toHaveBeenCalledWith({ userId: 'user123' });
        expect(Following.find).toHaveBeenCalledWith({ userId: 'user123' });
    
        expect(result).toEqual({
            likes: [{ postId: 'post1' }, { postId: 'post2' }],
            comments: [{ comment: 'Nice post!' }],
            followings: [{ following: ['user456', 'user789'] }],
        });
    });
    
    test('should return default values if username is not found', async () => {

        Like.find.mockImplementation(() => ({
            lean: jest.fn().mockResolvedValue([]),
        }));
        Comment.find.mockImplementation(() => ({
            lean: jest.fn().mockResolvedValue([]),
        }));
        Following.find.mockImplementation(() => ({
            lean: jest.fn().mockResolvedValue([]),
        }));
    
        const result = await fetchUserInteractions('unknownUser');

        expect(result).toEqual({
            likes: [],
            comments: [],
            followings: [],
        });
    });
    

    test('should return default values on database errors', async () => {
        const mockError = new Error('Database error');

        jest.spyOn(console, 'error').mockImplementation(() => {});

        Like.find.mockImplementation(() => ({
            lean: jest.fn().mockRejectedValue(mockError),
        }));
        Comment.find.mockImplementation(() => ({
            lean: jest.fn().mockRejectedValue(mockError),
        }));
        Following.find.mockImplementation(() => ({
            lean: jest.fn().mockRejectedValue(mockError),
        }));
    
        try {
            await fetchUserInteractions('user123');
        } catch (error) {
            expect(error).toBe(mockError);
        }
 
        expect(console.error).toHaveBeenCalledWith(
            `Error fetching user interactions: ${mockError.message}`
        );

        console.error.mockRestore();
    });
    
});

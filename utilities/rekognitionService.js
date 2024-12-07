const AWS = require('aws-sdk');

// Configure AWS SDK with credentials and region
AWS.config.update({
    accessKeyId: process.env.REKOGNITION_ACCESS_KEY_ID,
    secretAccessKey: process.env.REKOGNITION_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const rekognition = new AWS.Rekognition();

const detectLabels = async (imageBuffer) => {
    const params = {
        Image: {
            Bytes: imageBuffer
        },
        MaxLabels: 5,
        MinConfidence: 85
    };

    try {
        
        const response = await rekognition.detectLabels(params).promise();
        return response.Labels;
    } catch (error) {
        console.error('Error detecting labels:', error);
        throw error;
    }
};

const detectModerationLabels = async (imageBuffer) => {
    const params = {
        Image: {
            Bytes: imageBuffer
        },
        MinConfidence: 75
    };

    try {
        const response = await rekognition.detectModerationLabels(params).promise();
        return response.ModerationLabels;
    } catch (error) {
        console.error('Error detecting moderation labels:', error);
        throw error;
    }
};

module.exports = {
    detectLabels,
    detectModerationLabels
};
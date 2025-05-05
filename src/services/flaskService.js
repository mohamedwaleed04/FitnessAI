import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const FLASK_API_URL = process.env.FLASK_API_URL || 'http://localhost:5000';

export const analyzePose = async (filePath, exerciseType = 'squat') => {
    const formData = new FormData();
    formData.append('video', fs.createReadStream(filePath));
    formData.append('exercise_type', exerciseType);

    try {
        const response = await axios.post(`${FLASK_API_URL}/analyze-pose`, formData, {
            headers: {
                ...formData.getHeaders(),
                'Content-Length': formData.getLengthSync()
            },
            timeout: 60000
        });
        return response.data;
    } catch (error) {
        console.error('Flask API Error:', error.message);
        throw new Error(`AI service failed: ${error.message}`);
    }
};

export const getRealTimeFeedback = async (frameData, exerciseType) => {
    try {
        const response = await axios.post(`${FLASK_API_URL}/realtime-feedback`, {
            frame_data: frameData.toString('base64'),
            exercise_type: exerciseType
        }, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000
        });
        return response.data;
    } catch (error) {
        console.error('Real-time analysis error:', error);
        throw error;
    }
};
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const FLASK_API_URL = process.env.FLASK_API_URL || 'http://localhost:5000';

/**
 * Analyze workout video for form correction
 * @param {string} filePath - Path to video file
 * @param {string} exerciseType - Type of exercise (squat, pushup, etc.)
 * @returns {Promise<Object>} Analysis results
 */
export const analyzePose = async (filePath, exerciseType = 'squat') => {
    const formData = new FormData();
    formData.append('video', fs.createReadStream(filePath));
    formData.append('exercise_type', exerciseType);

    try {
        const response = await axios.post(`${FLASK_API_URL}/motion/analyze-pose`, formData, {
            headers: {
                ...formData.getHeaders(),
                'Content-Length': formData.getLengthSync()
            },
            timeout: 60000 // 1 minute timeout
        });
        return response.data;
    } catch (error) {
        console.error('Video analysis error:', error.message);
        throw new Error(`AI service failed: ${error.message}`);
    }
};

/**
 * Generate workout plan based on user data
 * @param {Object} userData - User fitness data
 * @returns {Promise<Object>} Workout plan
 */
export const generateWorkoutPlan = async (userData) => {
    try {
        const response = await axios.post(`${FLASK_API_URL}/workout/generate-workout`, userData, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000
        });
        return response.data;
    } catch (error) {
        console.error('Workout generation error:', error.message);
        throw error;
    }
};

/**
 * Generate meal plan based on goals
 * @param {string} goal - Fitness goal (muscle_gain, fat_loss)
 * @returns {Promise<Object>} Meal plan
 */
export const generateMealPlan = async (goal) => {
    try {
        const response = await axios.post(`${FLASK_API_URL}/diet/generate-meal-plan`, 
            { goal },
            { headers: { 'Content-Type': 'application/json' },
              timeout: 10000 }
        );
        return response.data;
    } catch (error) {
        console.error('Meal plan generation error:', error.message);
        throw error;
    }
};

// Remove getRealTimeFeedback if not used or implement it properly
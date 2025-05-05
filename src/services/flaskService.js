import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const FLASK_API_URL = process.env.FLASK_API_URL || 'http://localhost:5000';

export const analyzePose = async (filePath, exerciseType = 'squat') => {
    const formData = new FormData();
    formData.append('video', fs.createReadStream(filePath));
    formData.append('exercise_type', exerciseType);

    try {
        const response = await axios.post(`${FLASK_API_URL}/motion/analyze-pose`, formData, {
            headers: formData.getHeaders(),
            timeout: 60000
        });
        return response.data;
    } catch (error) {
        console.error('Pose analysis error:', error.message);
        throw error;
    }
};

export const generateWorkoutPlan = async (userData) => {
    try {
        const response = await axios.post(`${FLASK_API_URL}/workout/generate-workout`, userData, {
            timeout: 10000
        });
        return response.data;
    } catch (error) {
        console.error('Workout generation error:', error.message);
        throw error;
    }
};

export const generateMealPlan = async (goalData) => {
    try {
        const response = await axios.post(`${FLASK_API_URL}/diet/generate-meal-plan`, goalData, {
            timeout: 10000
        });
        return response.data;
    } catch (error) {
        console.error('Meal plan generation error:', error.message);
        throw error;
    }
};

export const getHealthAnalysis = async (healthData) => {
    try {
        const response = await axios.post(`${FLASK_API_URL}/diet/health-analysis`, healthData, {
            timeout: 10000
        });
        return response.data;
    } catch (error) {
        console.error('Health analysis error:', error.message);
        throw error;
    }
};
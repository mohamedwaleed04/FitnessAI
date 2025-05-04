import axios from 'axios';

const FLASK_API_URL = process.env.FLASK_API_URL || 'http://localhost:5000';

export const callFlaskEndpoint = async (endpoint, data) => {
  try {
    const response = await axios.post(`${FLASK_API_URL}/${endpoint}`, data, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000 // 30 seconds timeout for AI processing
    });
    return response.data;
  } catch (error) {
    console.error(`Flask API Error (${endpoint}):`, error.message);
    throw new Error(`AI service failed: ${error.message}`);
  }
};

// Specific endpoint wrappers
export const analyzePose = (videoData, exerciseType) => 
  callFlaskEndpoint('analyze-pose', { video_data: videoData, exercise_type: exerciseType });

export const generateWorkoutPlan = (userData) => 
  callFlaskEndpoint('generate-workout', userData);

export const generateMealPlan = (goal) => 
  callFlaskEndpoint('generate-meal-plan', { goal: goal.toString() });
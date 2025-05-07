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
    // Ensure the upload directory exists
    const uploadDir = path.join(process.cwd(), 'uploads', 'videos');
    ensureDirectoryExists(path.join(uploadDir, 'temp.txt')); // Just to create dir
    
    const formData = new FormData();
    
    try {
        // Verify file exists before processing
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
        
        formData.append('video', fs.createReadStream(filePath));
        formData.append('exercise_type', exerciseType);

        const response = await axios.post(`${FLASK_API_URL}/motion/analyze`, formData, {
            headers: {
                ...formData.getHeaders(),
                'Content-Length': formData.getLengthSync()
            },
            timeout: 60000
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
        const response = await axios.post(`${FLASK_API_URL}/workout/generate`, userData, {
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
        const response = await axios.post(`${FLASK_API_URL}/diet/generate`, 
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


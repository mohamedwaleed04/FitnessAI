import axios from 'axios';
import { generateMealPlan as generateAImealPlan } from '../../services/flaskService.js';
import NutritionLog from '../../../db/models/NutritionLog.js';

const NUTRITIONIX_APP_ID = '3168eb75';
const NUTRITIONIX_APP_KEY = 'c384d740480b62f92653ec1603483bcb';

let nutritionLogs = [];

// AI Meal Plan Generation
export const generateMealPlan = async (req, res) => {
    const { goal, preferences, restrictions } = req.body;

    try {
        const result = await generateAImealPlan({
            goal,
            preferences,
            restrictions,
            userData: {
                weight: req.user.weight,
                height: req.user.height,
                age: req.user.age,
                gender: req.user.gender
            }
        });
        
        res.status(200).json({
            success: true,
            mealPlan: result
        });
    } catch (error) {
        console.error('AI Meal Plan Error:', error);
        res.status(500).json({ 
            error: 'Failed to generate meal plan',
            details: error.message 
        });
    }
};

// Existing Nutritionix Functions (unchanged)
async function fetchNutritionalData(foodQuery) {
    const url = 'https://trackapi.nutritionix.com/v2/natural/nutrients';
    const headers = {
        'Content-Type': 'application/json',
        'x-app-id': NUTRITIONIX_APP_ID,
        'x-app-key': NUTRITIONIX_APP_KEY,
    };
    const data = {
        query: foodQuery,
    };

    try {
        const response = await axios.post(url, data, { headers });
        return response.data.foods[0];
    } catch (error) {
        console.error('Error fetching nutritional data:', error);
        return null;
    }
}

// Log nutrition intake
export const nutrition = async (req, res) => {
    const { food } = req.body;

    if (!food) {
        return res.status(400).json({ error: 'Food query is required' });
    }

    const nutritionalData = await fetchNutritionalData(food);

    if (!nutritionalData) {
        return res.status(404).json({ error: 'Nutritional data not found' });
    }

    // Create a new log entry
    const logEntry = {
        id: nutritionLogs.length + 1,
        food: nutritionalData.food_name,
        calories: nutritionalData.nf_calories,
        protein: nutritionalData.nf_protein,
        carbs: nutritionalData.nf_total_carbohydrate,
        fats: nutritionalData.nf_total_fat,
        timestamp: new Date(),
    };

    nutritionLogs.push(logEntry);
    res.status(201).json(logEntry);
};

// Retrieve nutrition logs
export const Lnutrition = async (req, res) => {
    res.status(200).json(nutritionLogs);
};

// Retrieve details about a log
export const retriveN = async (req, res) => {
    const { nutritionId } = req.params;

    const logEntry = nutritionLogs.find(log => log.id === parseInt(nutritionId));

    if (!logEntry) {
        return res.status(404).json({ error: 'Log entry not found' });
    }

    res.status(200).json(logEntry);
};

// Update a log
export const updatenN = async (req, res) => {
    const { nutritionId } = req.params;
    const { food } = req.body;

    const logIndex = nutritionLogs.findIndex(log => log.id === parseInt(nutritionId));

    if (logIndex === -1) {
        return res.status(404).json({ error: 'Log entry not found' });
    }

    const nutritionalData = await fetchNutritionalData(food);

    if (!nutritionalData) {
        return res.status(404).json({ error: 'Nutritional data not found' });
    }

    // Update the log entry
    nutritionLogs[logIndex] = {
        ...nutritionLogs[logIndex],
        food: nutritionalData.food_name,
        calories: nutritionalData.nf_calories,
        protein: nutritionalData.nf_protein,
        carbs: nutritionalData.nf_total_carbohydrate,
        fats: nutritionalData.nf_total_fat,
        timestamp: new Date(),
    };

    res.status(200).json(nutritionLogs[logIndex]);
};

// Delete a log
export const deleteN = async (req, res) => {
    const { nutritionId } = req.params;

    const logIndex = nutritionLogs.findIndex(log => log.id === parseInt(nutritionId));

    if (logIndex === -1) {
        return res.status(404).json({ error: 'Log entry not found' });
    }

    // Remove the log entry
    const deletedLog = nutritionLogs.splice(logIndex, 1);
    res.status(200).json(deletedLog);
};
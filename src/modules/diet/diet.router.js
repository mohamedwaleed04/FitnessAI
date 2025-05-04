import { Router } from 'express';
import { 
    nutrition, 
    Lnutrition, 
    retriveN, 
    updatenN, 
    deleteN,
    generateMealPlan  
} from './diet.controller.js';

const router = Router();

// AI Meal Plan Generation
router.post('/generate-meal-plan', generateMealPlan);

// Existing Nutrition Routes
router.post('/nutrition', nutrition);
router.get('/nutrition', Lnutrition);
router.get('/nutrition/:nutritionId', retriveN);
router.put('/nutrition/:nutritionId', updatenN);
router.delete('/nutrition/:nutritionId', deleteN);

export default router;
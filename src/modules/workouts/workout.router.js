// workout.router.js
import { Router } from 'express';
import {
    createWorkout,
    getWorkouts,
    getWorkout,
    updateWorkout,
    deleteWorkout,
    generateWorkoutPlan,
    healthAnalysis 
} from './workout.controller.js';
import { isAuthenticated } from '../../middleware/auth.middleware.js';
import { isValid } from '../../middleware/validation.middleware.js';
import {
    createWorkoutSchema,
    updateWorkoutSchema,
    generateWorkoutSchema,
    healthAnalysisSchema
} from './workout.validation.js';

const router = Router();

// AI Workout Generation (simplified)
router.post('/generate',
    isAuthenticated,
    isValid(generateWorkoutSchema),
    generateWorkoutPlan
);

// Health Analysis
router.post('/health-analysis',
    isAuthenticated,
    isValid(healthAnalysisSchema),
    healthAnalysis
);
router.post('/add', isAuthenticated, isValid(createWorkoutSchema), createWorkout);
router.get('/getall', isAuthenticated, getWorkouts);
router.get('/:id', isAuthenticated, getWorkout);
router.patch('/:id', isAuthenticated, isValid(updateWorkoutSchema), updateWorkout);
router.delete('/:id', isAuthenticated, deleteWorkout);

export default router;
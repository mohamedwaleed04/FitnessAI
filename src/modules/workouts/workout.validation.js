import Joi from 'joi';

const exerciseSchema = Joi.object({
  name: Joi.string().required(),
  sets: Joi.number().required(),
  reps: Joi.number().required(),
  description: Joi.string().optional()
});

export const createWorkoutSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  exercises: Joi.array().items(exerciseSchema).required()
});

export const updateWorkoutSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  exercises: Joi.array().items(exerciseSchema).optional()
});

export const generateWorkoutSchema = Joi.object({
  goal: Joi.string().valid('muscle_gain', 'fat_loss', 'beginner').required()
});

export const healthAnalysisSchema = Joi.object({
  weight: Joi.number().min(30).max(300).required(),
  height: Joi.number().min(1.2).max(2.5).required(),
  age: Joi.number().min(12).max(120).required(),
  gender: Joi.string().valid('male', 'female').required(),
  activityLevel: Joi.string().valid(
    'sedentary', 
    'light', 
    'moderate', 
    'active', 
    'very_active'
  ).required()
});
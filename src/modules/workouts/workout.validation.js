import Joi from 'joi';

const exerciseSchema = Joi.object({
  name: Joi.string().required(),
  sets: Joi.number().required(),
  reps: Joi.number().required(),
});

export const createWorkoutSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  exercises: Joi.array().items(exerciseSchema),
});

export const updateWorkoutSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  exercises: Joi.array().items(exerciseSchema).optional(),
});
export const generateWorkoutSchema = Joi.object({
  goal: Joi.string().valid('muscle_gain', 'fat_loss', 'beginner').required(),
  gender: Joi.string().valid('male', 'female').required(),
  weight: Joi.number().min(30).max(300).required(),
  height: Joi.number().min(1.2).max(2.5).required(),
  age: Joi.number().min(12).max(120).required(),
  training_days: Joi.number().min(1).max(7).default(3)
});
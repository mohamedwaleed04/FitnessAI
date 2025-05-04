import { Workout } from '../../../db/models/workout.model.js';
import { catchError } from '../../utils/catch.error.js';
import { EXERCISE_LIBRARY } from '../../../data/exercises.js';
import { generateWorkoutPlan as generateAIWorkout } from '../../services/flaskService.js';

// Helper function to calculate duration
function calculateTotalDuration(exercises) {
  return exercises.reduce((total, ex) => {
    return total + (ex.sets * ex.reps * 4); // assuming 4 seconds per rep
  }, 0) / 60; // convert to minutes
}

// AI Workout Generation
export const generateWorkoutPlan = catchError(async (req, res) => {
  const userData = {
    goal: req.body.goal,
    gender: req.user.gender,
    weight: req.user.weight,
    height: req.user.height,
    age: req.user.age,
    training_days: req.body.training_days,
    fitness_level: req.body.fitness_level
  };

  try {
    const aiPlan = await generateAIWorkout(userData);
    
    // Enrich with local exercise data if needed
    const enrichedPlan = aiPlan.map(day => ({
      ...day,
      exercises: day.exercises.map(ex => ({
        ...ex,
        // Add any local enrichment here
      }))
    }));

    res.status(200).json({ 
      success: true, 
      data: enrichedPlan 
    });
  } catch (error) {
    console.error('Workout Generation Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate workout plan',
      error: error.message 
    });
  }
});


// Existing controller functions (unchanged)
export const createWorkout = catchError(async (req, res) => {
  const { title, description } = req.body;
  let exercises = req.body.exercises;

  if (typeof exercises === 'string') {
    exercises = JSON.parse(exercises);
  }

  const enrichedExercises = exercises.map((exercise) => {
    const preset = EXERCISE_LIBRARY.find(
      (ex) => ex.name.toLowerCase() === exercise.name.toLowerCase()
    );

    return {
      ...exercise,
      imageUrl: preset?.imageUrl || null,
      videoUrl: preset?.videoUrl || null,
    };
  });

  const workout = await Workout.create({
    userId: req.user._id,
    title,
    description,
    exercises: enrichedExercises,
    duration: calculateTotalDuration(enrichedExercises)
  });

  res.status(201).json({ success: true, data: workout });
});

export const getWorkouts = catchError(async (req, res) => {
  const workouts = await Workout.find({ userId: req.user._id });
  res.status(200).json({
    success: true,
    count: workouts.length,
    data: workouts
  });
});

export const getWorkout = catchError(async (req, res) => {
  const { id } = req.params;
  const workout = await Workout.findOne({
    _id: id,
    userId: req.user._id
  });

  if (!workout) {
    return res.status(404).json({
      success: false,
      message: 'Workout not found'
    });
  }

  res.status(200).json({
    success: true,
    data: workout
  });
});

export const updateWorkout = catchError(async (req, res) => {
  const workout = await Workout.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true }
  );
  if (!workout) {
    return res.status(404).json({ success: false, message: 'Workout not found' });
  }
  res.json({ success: true, data: workout });
});

export const deleteWorkout = catchError(async (req, res) => {
  const workout = await Workout.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id
  });
  if (!workout) {
    return res.status(404).json({ success: false, message: 'Workout not found' });
  }
  res.json({ success: true, message: 'Workout deleted' });
});
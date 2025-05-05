import { Workout } from '../../../db/models/workout.model.js';
import { catchError } from '../../utils/catch.error.js';
import { EXERCISE_LIBRARY } from '../../../data/exercises.js';
import { 
  calculateTotalDuration,
  calculateTotalCalories,
  formatWorkoutDuration
} from '../utils/workout.utils.js';

// Health Analysis Functions
function calculateBMI(weight, height) {
  return (weight / (height * height)).toFixed(1);
}

function getBMICategory(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

function calculateTDEE(gender, weight, height, age, activityLevel) {
  // Mifflin-St Jeor Equation
  let bmr;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * (height * 100) - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * (height * 100) - 5 * age - 161;
  }

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };

  return Math.round(bmr * activityMultipliers[activityLevel]);
}

// Updated Workout Generation
export const generateWorkoutPlan = catchError(async (req, res) => {
  const { goal } = req.body;
  
  if (!['muscle_gain', 'fat_loss', 'beginner'].includes(goal)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid goal. Must be: muscle_gain, fat_loss, or beginner'
    });
  }

  try {
    // Using the simplified workout plans from the Python version
    let workoutPlan;
    
    if (goal === "muscle_gain") {
      workoutPlan = [
        // Push/Pull/Legs split 
        {
          "day": "Sunday",
          "focus": "Push (Chest, Shoulders, Triceps)",
          "exercises": [
              {"name": "Bench Press", "sets": "4x8", "description": "Builds chest strength."},
              {"name": "Shoulder Press", "sets": "3x10", "description": "Targets shoulders."},
              {"name": "Triceps Pushdown", "sets": "3x12", "description": "Isolates the triceps."}
          ]
      },
      {
          "day": "Monday",
          "focus": "Pull (Back, Biceps)",
          "exercises": [
              {"name": "Pull-Ups", "sets": "4x6", "description": "Strengthens back and biceps."},
              {"name": "Barbell Row", "sets": "3x10", "description": "Focuses on mid-back."},
              {"name": "Dumbbell Curl", "sets": "3x12", "description": "Isolates the biceps."}
          ]
      },
      {
          "day": "Tuesday",
          "focus": "Legs",
          "exercises": [
              {"name": "Squats", "sets": "4x10", "description": "Full lower body workout."},
              {"name": "Lunges", "sets": "3x10", "description": "Leg strength and balance."},
              {"name": "Calf Raises", "sets": "3x15", "description": "Works calves."}
          ]
      },
      {
          "day": "Wednesday",
          "focus": "Rest",
          "exercises": []
      },
      {
          "day": "Thursday",
          "focus": "Push (Variation)",
          "exercises": [
              {"name": "Incline Dumbbell Press", "sets": "4x10", "description": "Upper chest focus."},
              {"name": "Lateral Raise", "sets": "3x12", "description": "Side deltoids."},
              {"name": "Overhead Triceps Extension", "sets": "3x12", "description": "Stretches triceps."}
          ]
      },
      {
          "day": "Friday",
          "focus": "Pull (Variation)",
          "exercises": [
              {"name": "Lat Pulldown", "sets": "4x10", "description": "Back width builder."},
              {"name": "Seated Row", "sets": "3x10", "description": "Back thickness."},
              {"name": "Hammer Curl", "sets": "3x12", "description": "Biceps and forearms."}
          ]
      },
      {
          "day": "Saturday",
          "focus": "Legs (Variation)",
          "exercises": [
              {"name": "Leg Press", "sets": "4x12", "description": "Quad-focused leg builder."},
              {"name": "Romanian Deadlift", "sets": "3x10", "description": "Glutes and hamstrings."},
              {"name": "Standing Calf Raises", "sets": "3x20", "description": "Calf endurance."}
          ]
      }
      ];
    } else if (goal === "fat_loss") {
      workoutPlan = [
        // Fat loss plan 
        {"day": "Monday", "focus": "HIIT + Full Body", "exercises": [
          {"name": "Burpees", "sets": "3x20", "description": "Full body cardio."},
          {"name": "Jump Squats", "sets": "3x15", "description": "Explosive lower body."},
          {"name": "Push-Ups", "sets": "3x10", "description": "Upper body endurance."}
      ]},
      {"day": "Tuesday", "focus": "Cardio", "exercises": [
          {"name": "Jogging", "sets": "30 min", "description": "Steady-state cardio."}
      ]},
      {"day": "Wednesday", "focus": "Core + HIIT", "exercises": [
          {"name": "Plank", "sets": "3x45 sec", "description": "Core endurance."},
          {"name": "Bicycle Crunches", "sets": "3x20", "description": "Oblique focus."},
          {"name": "High Knees", "sets": "3x30 sec", "description": "Cardio finisher."}
      ]},
      {"day": "Thursday", "focus": "Rest", "exercises": []},
      {"day": "Friday", "focus": "Strength (Full Body)", "exercises": [
          {"name": "Deadlifts", "sets": "3x8", "description": "Back and glutes."},
          {"name": "Dumbbell Press", "sets": "3x10", "description": "Chest and arms."},
          {"name": "Air Bike", "sets": "3x1 min", "description": "Cardio booster."}
      ]}
  
      ];
    } else {
      //beginners plan
      workoutPlan = [
        {"day": "Monday", "focus": "Full Body", "exercises": [
          {"name": "Bodyweight Squats", "sets": "3x15", "description": "Lower body strength."},
          {"name": "Push-Ups", "sets": "3x10", "description": "Upper body basics."},
          {"name": "Plank", "sets": "3x30 sec", "description": "Core stability."}
      ]},
      {"day": "Wednesday", "focus": "Full Body", "exercises": [
          {"name": "Lunges", "sets": "3x12", "description": "Works quads and glutes."},
          {"name": "Bent-over Rows", "sets": "3x12", "description": "Back and arms."},
          {"name": "Mountain Climbers", "sets": "3x20 sec", "description": "Cardio and core."}
      ]},
      {"day": "Friday", "focus": "Full Body", "exercises": [
          {"name": "Wall Sit", "sets": "3x30 sec", "description": "Leg endurance."},
          {"name": "Dumbbell Shoulder Press", "sets": "3x12", "description": "Deltoid work."},
          {"name": "Leg Raises", "sets": "3x15", "description": "Lower abs."}
      ]}
      ];
    }

    res.status(200).json({ 
      success: true, 
      data: workoutPlan 
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

// Health Analysis Endpoint
export const healthAnalysis = catchError(async (req, res) => {
  const { weight, height, age, gender, activityLevel } = req.body;
  
  // Validate inputs
  if (!['male', 'female'].includes(gender)) {
    return res.status(400).json({ error: "Gender must be 'male' or 'female'" });
  }
  
  if (!['sedentary', 'light', 'moderate', 'active', 'very_active'].includes(activityLevel)) {
    return res.status(400).json({ error: "Invalid activity level" });
  }

  const bmi = calculateBMI(weight, height);
  const bmiCategory = getBMICategory(bmi);
  const tdee = calculateTDEE(gender, weight, height, age, activityLevel);

  res.status(200).json({
    success: true,
    data: {
      bmi,
      bmiCategory,
      tdee,
      metrics: {
        weight,
        height,
        age,
        gender,
        activityLevel
      }
    }
  });
});

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
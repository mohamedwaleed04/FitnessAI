import { analyzeVideo } from '../../services/pose.service.js';
import { calculateJointAngles, isExerciseCorrect } from './biomechanics.js';
import path from 'path';

// Updated to match Flask's analyze endpoint
export const analyzePose = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No video file uploaded' });
    }

    const exerciseType = req.body.exercise || 'squat';
    const results = await analyzeVideo(req.file.path, { exerciseType });

    res.json({
      success: true,
      data: {
        ...results,
        videoUrl: `/uploads/${path.basename(req.file.path)}`
      }
    });
  } catch (error) {
    console.error('Video processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Error processing video',
      details: error.message
    });
  }
};

// New function to match Flask's workout plan generator
export const generateWorkoutPlan = async (req, res) => {
  try {
    const { goal = 'muscle_gain', level = 'beginner', days = 3, gender = 'male', weight = 70, height = 1.75, age = 30 } = req.body;

    // Simplified example - integrate your actual workout generator
    const workoutPlan = {
      goal,
      level,
      days,
      plan: []
    };

    for (let day = 1; day <= days; day++) {
      workoutPlan.plan.push({
        day: `Day ${day}`,
        exercises: [
          {
            name: `Exercise ${day}.1`,
            sets: "3x10",
            description: `${goal} focused exercise`
          },
          {
            name: `Exercise ${day}.2`,
            sets: "3x12",
            description: `${level} level exercise`
          }
        ],
        duration: 45
      });
    }

    res.json({ success: true, data: workoutPlan });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// New function to match Flask's diet plan generator
export const generateDietPlan = async (req, res) => {
  try {
    const { goal = 'muscle_gain', days = 7 } = req.body;

    const dietPlan = {
      goal,
      days,
      plan: []
    };

    for (let day = 1; day <= days; day++) {
      dietPlan.plan.push({
        day: `Day ${day}`,
        meals: [
          {
            meal: "breakfast",
            description: `High protein ${goal} breakfast`,
            calories: 500,
            protein: 30,
            carbs: 40,
            fat: 15
          },
          {
            meal: "lunch",
            description: `Balanced ${goal} lunch`,
            calories: 700,
            protein: 40,
            carbs: 60,
            fat: 25
          },
          {
            meal: "dinner",
            description: `Light ${goal} dinner`,
            calories: 600,
            protein: 35,
            carbs: 45,
            fat: 20
          }
        ]
      });
    }

    res.json({ success: true, data: dietPlan });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// New function to match Flask's health analysis
export const healthAnalysis = async (req, res) => {
  try {
    const { weight, height, age, gender, activity_level } = req.body;

    const bmi = weight / (height ** 2);
    let bmr;
    
    if (gender.toLowerCase() === 'male') {
      bmr = 10 * weight + 6.25 * (height * 100) - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * (height * 100) - 5 * age - 161;
    }

    const activity_multipliers = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'very_active': 1.9
    };

    const tdee = bmr * activity_multipliers[activity_level.toLowerCase()] || 1.2;

    let category;
    if (bmi < 18.5) {
      category = "Underweight";
    } else if (bmi < 25) {
      category = "Normal weight";
    } else if (bmi < 30) {
      category = "Overweight";
    } else {
      category = "Obese";
    }

    res.json({
      success: true,
      data: {
        bmi: parseFloat(bmi.toFixed(2)),
        tdee: parseFloat(tdee.toFixed(2)),
        category
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
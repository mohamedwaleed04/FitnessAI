import { analyzePose, getRealTimeFeedback } from './flaskService.js';
import { extractFrames } from './video.service.js';

export const analyzeVideo = async (filePath, options = {}) => {
  const { useFlask = true, exerciseType = 'squat' } = options;
  
  if (useFlask) {
    try {
      const results = await analyzePose(filePath, exerciseType);
      return {
        detectedWorkout: results.exercise_type || exerciseType,
        feedback: results.feedback || [],
        summary: {
          overallScore: results.score || 0,
          criticalIssues: results.critical_issues || 0,
          suggestions: results.suggestions || [],
          feedbackCount: results.feedback?.length || 0
        },
        keypoints: results.keypoints || [],
        angles: results.joint_angles || {}
      };
    } catch (error) {
      console.error('Falling back to local processing:', error);
      return localVideoAnalysis(filePath, exerciseType);
    }
  } else {
    return localVideoAnalysis(filePath, exerciseType);
  }
};

// Add this new function for frame-by-frame processing
export const processVideoFrames = async (filePath, callback) => {
  const frames = await extractFrames(filePath);
  for (const frame of frames) {
    const results = await getRealTimeFeedback(frame, 'squat'); // Default exercise
    callback(results);
  }
};
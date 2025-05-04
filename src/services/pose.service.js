import * as tf from '@tensorflow/tfjs-node';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { calculateJointAngles, checkBiomechanics } from '../modules/motion/biomechanics.js';
import { WorkoutClassifier } from './workout-classifier.service.js';
import { analyzePose } from './flaskService.js';
import { extractFrames, frameToTensor } from './video.service.js';

let detector = null;
const classifier = new WorkoutClassifier();

export const initializeModels = async () => {
  await tf.ready();
  const model = poseDetection.SupportedModels.MoveNet;
  detector = await poseDetection.createDetector(model, {
    modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
  });
  await classifier.initialize();
};

export const analyzeVideo = async (videoBuffer, options = {}) => {
  const { useFlask = true, exerciseType } = options;
  
  if (useFlask) {
    // Use Flask AI endpoint for processing
    try {
      const flaskResults = await analyzePose(videoBuffer, exerciseType);
      return {
        detectedWorkout: flaskResults.exercise_type || 'unknown',
        feedback: flaskResults.feedback || [],
        summary: flaskResults.summary || generateSummary([]),
        keypoints: flaskResults.keypoints || []
      };
    } catch (error) {
      console.error('Falling back to local processing due to Flask error:', error);
      // Fall back to local processing if Flask fails
      return localVideoAnalysis(videoBuffer);
    }
  } else {
    // Use local processing only
    return localVideoAnalysis(videoBuffer);
  }
};

async function localVideoAnalysis(videoBuffer) {
  if (!detector) await initializeModels();
  
  try {
    const frames = await extractFrames(videoBuffer);
    const feedback = [];
    let detectedWorkout = 'unknown';
    let keypoints = [];

    for (const frame of frames) {
      const tensor = frameToTensor(frame);
      const pose = await detector.estimatePoses(tensor);
      tensor.dispose();

      if (pose.length > 0) {
        keypoints = pose[0].keypoints;
        const angles = calculateJointAngles(keypoints);
        feedback.push(...checkBiomechanics(angles, Date.now()));
        
        // Only classify on first frame to save processing
        if (frames.indexOf(frame) === 0) {
          detectedWorkout = await classifier.classifyFromPose(keypoints);
        }
      }
    }

    return {
      detectedWorkout,
      feedback,
      summary: generateSummary(feedback),
      keypoints
    };
  } catch (error) {
    console.error('Local video analysis error:', error);
    throw new Error('Failed to analyze video');
  }
}

function generateSummary(feedback) {
  const criticalCount = feedback.filter(f => f.severity === 'high').length;
  const mediumCount = feedback.filter(f => f.severity === 'medium').length;
  const suggestions = [...new Set(feedback.map(f => f.correction))];
  
  // Calculate score (100 - 5 points per high issue, 2 per medium)
  const score = Math.max(0, 100 - (criticalCount * 5 + mediumCount * 2));
  
  return {
    overallScore: score,
    criticalIssues: criticalCount,
    suggestions,
    feedbackCount: feedback.length
  };
}
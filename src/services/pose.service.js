import * as tf from '@tensorflow/tfjs-node';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { calculateJointAngles } from '../modules/motion/biomechanics.js';
import { WorkoutClassifier } from './workout-classifier.service.js';
import { analyzePose } from './flaskService.js'; // Only import what's available
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
  const { useFlask = true, exerciseType = 'squat' } = options;
  
  if (useFlask) {
    try {
      // Save buffer to temp file for Flask processing
      const tempFilePath = `/tmp/workout_${Date.now()}.mp4`;
      require('fs').writeFileSync(tempFilePath, videoBuffer);
      
      const flaskResults = await analyzePose(tempFilePath, exerciseType);
      
      // Clean up temp file
      require('fs').unlinkSync(tempFilePath);
      
      return {
        detectedWorkout: flaskResults.data?.exercise_type || exerciseType,
        feedback: flaskResults.data?.feedback || [],
        summary: {
          overallScore: flaskResults.data?.score || 0,
          criticalIssues: flaskResults.data?.critical_issues || 0,
          suggestions: flaskResults.data?.suggestions || [],
          feedbackCount: flaskResults.data?.feedback?.length || 0
        },
        keypoints: flaskResults.data?.keypoints || []
      };
    } catch (error) {
      console.error('Falling back to local processing:', error);
      return localVideoAnalysis(videoBuffer, exerciseType);
    }
  } else {
    return localVideoAnalysis(videoBuffer, exerciseType);
  }
};

async function localVideoAnalysis(videoBuffer, exerciseType) {
  let tensors = [];
  try {
    if (!detector) {
      console.log('Initializing models...');
      await initializeModels();
    }

    console.log('Extracting frames...');
    const frames = await extractFrames(videoBuffer);
    if (frames.length === 0) throw new Error('No frames extracted');

    console.log(`Processing ${frames.length} frames...`);
    const feedback = [];
    
    for (const [i, frame] of frames.entries()) {
      try {
        console.log(`Processing frame ${i+1}/${frames.length}`);
        const tensor = frameToTensor(frame);
        const pose = await detector.estimatePoses(tensor);
        tensor.dispose();

        if (pose.length === 0) {
          console.warn(`No pose detected in frame ${i+1}`);
          continue;
        }

        const keypoints = pose[0].keypoints;
        console.log('Keypoints detected:', keypoints.length);

        const angles = calculateJointAngles(keypoints);
        const { correct, feedback: frameFeedback } = checkExerciseForm(angles, exerciseType);
        
        feedback.push(...frameFeedback);
      } catch (frameError) {
        console.error(`Error processing frame ${i+1}:`, frameError);
      
    for (const frame of frames) {
      const tensor = frameToTensor(frame);
      tensors.push(tensor); // Track for cleanup
      // ... processing ...
    }
  } finally {
    // Clean up all tensors
    tensors.forEach(t => t?.dispose());
    console.log('Cleaned up tensors');
      }
    }

    if (feedback.length === 0) {
      throw new Error('No valid poses detected in any frame');
    }

    return {
      detectedWorkout: exerciseType,
      feedback,
      summary: generateSummary(feedback),
      keypoints: []
    };
  } catch (error) {
    console.error('Full error stack:', error);
    throw new Error(`Video processing failed: ${error.message}`);
  }
}


// Add this new function for frame-by-frame processing
export const processVideoFrames = async (filePath, callback) => {
  const frames = await extractFrames(filePath);
  for (const frame of frames) {
    const results = await getRealTimeFeedback(frame, 'squat'); // Default exercise
    callback(results);
  }
};
import * as tf from '@tensorflow/tfjs-node';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { calculateJointAngles, isExerciseCorrect } from '../modules/motion/biomechanics.js';
import { extractFrames, frameToTensor } from './video.service.js';

let detector = null;

export const initializeModels = async () => {
  await tf.ready();
  const model = poseDetection.SupportedModels.MoveNet;
  detector = await poseDetection.createDetector(model, {
    modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
  });
};

export const analyzeVideo = async (videoPath, options = {}) => {
  const { exerciseType = 'squat' } = options;
  
  try {
    if (!detector) {
      await initializeModels();
    }

    const frames = await extractFrames(videoPath);
    if (frames.length === 0) throw new Error('No frames extracted');

    const feedback = [];
    let correctFrames = 0;

    for (const frame of frames) {
      const tensor = frameToTensor(frame);
      const pose = await detector.estimatePoses(tensor);
      tensor.dispose();

      if (pose.length === 0) continue;

      const keypoints = pose[0].keypoints;
      const angles = calculateJointAngles(keypoints);
      const { correct, feedback: frameFeedback } = isExerciseCorrect(keypoints, exerciseType);
      
      if (correct) correctFrames++;
      feedback.push(...frameFeedback);
    }

    const score = Math.round((correctFrames / frames.length) * 100);
    
    return {
      exercise_type: exerciseType,
      score,
      feedback,
      critical_issues: feedback.filter(f => f.includes('critical')).length,
      suggestions: feedback.filter(f => f.includes('suggestion'))
    };
  } catch (error) {
    console.error('Video analysis error:', error);
    throw error;
  }
};
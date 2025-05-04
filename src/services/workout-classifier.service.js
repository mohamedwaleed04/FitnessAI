import * as tf from '@tensorflow/tfjs-node';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class WorkoutClassifier {
  constructor() {
    this.model = null;
    this.classes = [
      'squat',
      'pushup',
      'lunge',
      'pullup',
      'deadlift',
      'shoulder_press'
    ];
    this.minConfidence = 0.7;
this.modelPath = path.join(__dirname, '../../db/models/workout-classifier/model.json');  }

  /**
   * Initialize classifier model
   */
  async initialize() {
    try {
      console.log(`Loading model from: ${this.modelPath}`);
      
      // Verify model files exist
      const fs = await import('fs');
      if (!fs.existsSync(this.modelPath)) {
        throw new Error(`Model file not found at ${this.modelPath}`);
      }

      this.model = await tf.loadGraphModel(`file://${this.modelPath}`);
      console.log('Classifier model loaded successfully');
    } catch (err) {
      console.error('Error loading classifier:', err);
      throw new Error(`Failed to load classifier model: ${err.message}`);
    }
  }

  /**
   * Classify exercise from pose keypoints
   * @param {Array} keypoints - Pose keypoints
   * @returns {Promise<string>} Detected exercise type
   */
  async classifyFromPose(keypoints) {
    if (!this.model) await this.initialize();

    try {
      const inputTensor = this.normalizeKeypoints(keypoints);
      const prediction = this.model.predict(inputTensor);
      const scores = await prediction.array();
      
      inputTensor.dispose();
      prediction.dispose();

      const maxScore = Math.max(...scores[0]);
      if (maxScore < this.minConfidence) return 'unknown';

      return this.classes[scores[0].indexOf(maxScore)];
    } catch (err) {
      console.error('Classification error:', err);
      return 'unknown';
    }
  }

  /**
   * Normalize keypoints for model input
   */
  normalizeKeypoints(keypoints) {
    const points = keypoints.flatMap(kp => [kp.x, kp.y, kp.score]);
    return tf.tensor2d([points], [1, keypoints.length * 3]);
  }
}
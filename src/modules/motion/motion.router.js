import express from 'express';
import { 
  processWorkout,
  realTimeAnalysis 
} from './motion.controller.js';
import { isAuthenticated } from '../../middleware/auth.middleware.js';
import { videoUpload } from '../../middleware/upload.middleware.js'; 

const router = express.Router();

// Standard analysis
router.post('/motion/analyze', 
  isAuthenticated,
  realTimeAnalysis.
  videoUpload,
  processWorkout,
  analyzePose
);
export default router;
import express from 'express';
import { 
  processWorkout,
  realTimeAnalysis 
} from './motion.controller.js';
import { isAuthenticated } from '../../middleware/auth.middleware.js';
import { videoUpload } from '../../middleware/upload.middleware.js'; 

const router = express.Router();

// Standard analysis
router.post('/analyze', 
  isAuthenticated,
  videoUpload, // Using the updated middleware
  processWorkout
);

// Frame-by-frame analysis
router.post('/analyze-realtime',
  isAuthenticated,
  videoUpload, // Using the updated middleware
  realTimeAnalysis
);

export default router;
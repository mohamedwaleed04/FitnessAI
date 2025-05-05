import express from 'express';
import { 
  processWorkout,
  realTimeAnalysis 
} from './motion.controller.js';
import { isAuthenticated } from '../../middleware/auth.middleware.js';
import upload from '../../middleware/upload.middleware.js';

const router = express.Router();

// Standard analysis (full video processing)
router.post('/analyze', 
  isAuthenticated,
  upload.single('video'),
  processWorkout
);

// Frame-by-frame analysis
router.post('/analyze-realtime',
  isAuthenticated,
  upload.single('video'),
  realTimeAnalysis
);

export default router;
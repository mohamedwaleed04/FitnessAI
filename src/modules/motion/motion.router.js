import express from 'express';
import { isAuthenticated } from '../../middleware/auth.middleware.js';
import { videoUpload } from '../../middleware/upload.middleware.js'; 

const router = express.Router();

// Standard analysis
router.post('/motion/analyze', 
  isAuthenticated,
  videoUpload,
  analyzePose
);
export default router;
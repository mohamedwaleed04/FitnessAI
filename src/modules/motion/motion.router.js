import express from 'express';
import { 
  analyzePose,
} from './motion.controller.js';
import { isAuthenticated } from '../../middleware/auth.middleware.js';
import { videoUpload } from '../../middleware/upload.middleware.js';

const router = express.Router();

router.post('/analyze', 
  isAuthenticated,
  videoUpload,
  analyzePose
);
export default router;
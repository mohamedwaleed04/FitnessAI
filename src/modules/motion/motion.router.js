import express from 'express';
import { processWorkout } from './motion.controller.js';
import { isAuthenticated } from '../../middleware/auth.middleware.js';
import upload from '../../middleware/upload.middleware.js';

const router = express.Router();

router.post('/analyze', 
  isAuthenticated,
  upload.single('video'),
  processWorkout
);

router.post('/analyze-local', 
  isAuthenticated,
  upload.single('video'),
  async (req, res, next) => {
    req.useFlask = false;
    next();
  },
  processWorkout
);

export default router;
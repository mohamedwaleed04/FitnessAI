import { analyzeVideo } from '../../services/pose.service.js';
import path from 'path';

export const processWorkout = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    const results = await analyzeVideo(req.file.path, {
      exerciseType: req.body.exerciseType || 'squat'
    });

    res.json({
      success: true,
      data: {
        ...results,
        videoUrl: `/uploads/${path.basename(req.file.path)}`
      }
    });
  } catch (error) {
    console.error('Video processing error:', error);
    res.status(500).json({
      error: 'Error processing video',
      details: error.message
    });
  }
};

// New endpoint for real-time processing
export const realTimeAnalysis = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    const frames = [];
    await processVideoFrames(req.file.path, (results) => {
      frames.push(results);
    });

    res.json({
      success: true,
      frameCount: frames.length,
      frames
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
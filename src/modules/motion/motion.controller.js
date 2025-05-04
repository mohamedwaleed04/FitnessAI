export const processWorkout = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    const options = {
      useFlask: true, 
      exerciseType: req.body.exerciseType || 'squat' 
    };

    const results = await analyzeVideo(req.file.buffer, options);
    
    // Save to database
    const motionAnalysis = new MotionAnalysis({
      user: req.user._id,
      videoPath: req.file.path,
      exerciseType: results.detectedWorkout,
      feedback: results.feedback,
      keypoints: results.keypoints,
      summary: results.summary
    });
    
    await motionAnalysis.save();
    
    res.json({
      success: true,
      data: {
        ...motionAnalysis.toObject(),
        description: exerciseRules[results.detectedWorkout]?.description || ''
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
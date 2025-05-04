import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  timestamp: Number,
  joint: String,
  issue: String,
  severity: {
    type: String,
    enum: ['low', 'moderate', 'high']
  },
  correction: String,
  score: Number
});

const motionAnalysisSchema = new mongoose.Schema({
  _id: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  videoPath: String,
  feedback: [feedbackSchema],
  summary: {
    overallScore: Number,
    criticalIssues: Number,
    suggestions: [String]
  }
}, { timestamps: true });

export default mongoose.model('MotionAnalysis', motionAnalysisSchema);
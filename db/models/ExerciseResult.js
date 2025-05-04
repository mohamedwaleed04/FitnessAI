import mongoose from 'mongoose';

const exerciseResultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    exercise: {
        type: String,
        required: true,
        enum: ['squat', 'push_up', 'deadlift', 'bench_press']
    },
    isCorrect: Boolean,
    feedback: [String],
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('ExerciseResult', exerciseResultSchema);
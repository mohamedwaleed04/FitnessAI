import mongoose from 'mongoose';

const nutritionLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    food: {
        type: String,
        required: true
    },
    nutrients: {
        calories: Number,
        protein: Number,
        carbs: Number,
        fat: Number
    },
    loggedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.model('NutritionLog', nutritionLogSchema);
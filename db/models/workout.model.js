import mongoose from 'mongoose';


  const exerciseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: Number, required: true },
    imageUrl: { type: String },   
    videoUrl: { type: String },  
  });
  

  const workoutSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String },
    exercises: [exerciseSchema],
    duration: { type: Number }, // in minutes
  }, { timestamps: true });
  
  const Workout = mongoose.model('Workout', workoutSchema);
  export { Workout };
  
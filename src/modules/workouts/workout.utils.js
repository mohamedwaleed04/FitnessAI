
/**
 * Calculates the total duration of a workout in minutes
 * @param {Array} exercises - Array of exercise objects
 * @returns {Number} Total duration in minutes
 */
export const calculateTotalDuration = (exercises) => {
    if (!Array.isArray(exercises)) return 0;
    
    return exercises.reduce((total, exercise) => {
      // Handle both object with duration property and array formats
      const duration = exercise.duration || exercise[2] || 0;
      return total + (Number(duration) || 0);
    }, 0);
  };
  
  /**
   * Calculates total calories burned in a workout
   * @param {Array} exercises - Array of exercise objects
   * @param {Number} userWeight - User's weight in kg
   * @returns {Number} Estimated total calories burned
   */
  export const calculateTotalCalories = (exercises, userWeight) => {
    if (!Array.isArray(exercises)) return 0;
    
    // MET values for common exercises (Metabolic Equivalent of Task)
    const MET_VALUES = {
      'squat': 5.0,
      'pushup': 3.8,
      'lunge': 5.0,
      'pullup': 4.0,
      'deadlift': 6.0,
      'shoulder_press': 4.5,
      'running': 8.0,
      'cycling': 7.5,
      'swimming': 6.8
    };
  
    return exercises.reduce((total, exercise) => {
      const name = exercise.name?.toLowerCase() || exercise[0]?.toLowerCase();
      const duration = exercise.duration || exercise[2] || 0;
      const met = MET_VALUES[name] || 4.0; // Default MET for unknown exercises
      
      // Calories = MET * weight in kg * time in hours
      return total + (met * userWeight * (duration / 60));
    }, 0);
  };
  
  /**
   * Formats workout duration to HH:MM:SS format
   * @param {Number} totalMinutes - Total duration in minutes
   * @returns {String} Formatted duration string
   */
  export const formatWorkoutDuration = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    const seconds = Math.floor((totalMinutes * 60) % 60);
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  };
  
  /**
   * Validates exercise objects in a workout
   * @param {Array} exercises - Array of exercise objects
   * @returns {Object} { valid: Boolean, errors: Array }
   */
  export const validateExercises = (exercises) => {
    if (!Array.isArray(exercises)) {
      return {
        valid: false,
        errors: ['Exercises must be an array']
      };
    }
  
    const errors = [];
    const requiredProps = ['name', 'sets', 'duration'];
  
    exercises.forEach((ex, index) => {
      // Check if exercise is an object with required properties
      if (typeof ex !== 'object' || Array.isArray(ex)) {
        errors.push(`Exercise at position ${index} must be an object`);
        return;
      }
  
      requiredProps.forEach(prop => {
        if (!(prop in ex)) {
          errors.push(`Exercise at position ${index} missing required property: ${prop}`);
        }
      });
  
      if (ex.duration && (typeof ex.duration !== 'number' || ex.duration <= 0)) {
        errors.push(`Exercise at position ${index} has invalid duration`);
      }
    });
  
    return {
      valid: errors.length === 0,
      errors
    };
  };
  
  /**
   * Groups exercises by muscle group
   * @param {Array} exercises - Array of exercise objects
   * @returns {Object} Exercises grouped by muscle group
   */
  export const groupByMuscleGroup = (exercises) => {
    const groups = {
      chest: [],
      back: [],
      legs: [],
      arms: [],
      shoulders: [],
      core: [],
      cardio: [],
      other: []
    };
  
    // Common exercise to muscle group mapping
    const MUSCLE_GROUP_MAP = {
      // Chest exercises
      'bench press': 'chest',
      'pushup': 'chest',
      'chest fly': 'chest',
      
      // Back exercises
      'pullup': 'back',
      'deadlift': 'back',
      'lat pulldown': 'back',
      
      // Leg exercises
      'squat': 'legs',
      'lunge': 'legs',
      'leg press': 'legs',
      
      // Arm exercises
      'bicep curl': 'arms',
      'tricep dip': 'arms',
      
      // Shoulder exercises
      'shoulder press': 'shoulders',
      'lateral raise': 'shoulders',
      
      // Core exercises
      'plank': 'core',
      'situp': 'core',
      
      // Cardio exercises
      'running': 'cardio',
      'cycling': 'cardio'
    };
  
    exercises.forEach(exercise => {
      const name = exercise.name?.toLowerCase();
      const group = MUSCLE_GROUP_MAP[name] || 'other';
      groups[group].push(exercise);
    });
  
    return groups;
  };
  
  export default {
    calculateTotalDuration,
    calculateTotalCalories,
    formatWorkoutDuration,
    validateExercises,
    groupByMuscleGroup
  };
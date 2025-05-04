import Userrouter from './src/modules/users/user.router.js';
import DietRouter from './src/modules/diet/diet.router.js';
import workoutRouter from './src/modules/workouts/workout.router.js';
import motionRouter from './src/modules/motion/motion.router.js';
import cors from 'cors';

export const appRouter = (app, express) => {
    app.use(cors({
        origin: process.env.FRONTEND_URL || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));

    app.use(express.json({ limit: '100mb' }));
    app.use(express.urlencoded({ extended: true, limit: '100mb' }));
    //Workout router
    app.use('/workout', workoutRouter);

    // User routes
    app.use('/user', Userrouter);

    // Diet routes
    app.use('/diet', DietRouter);

    // Routes
    app.use('/motion', motionRouter);;


    // Error handling middleware
    app.use((error, req, res, next) => {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message,
            stack: error.stack,
        });
    });

    // 404 route for undefined endpoints
    app.all('*', (req, res) => {
        return res.status(404).json({ success: false, message: 'Page not found' });
    });
};
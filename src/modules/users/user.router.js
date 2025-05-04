import { Router } from 'express';
import { signup, login, changepass, updateuser, deleteuser, logout } from './user.controller.js';
import { isAuthenticated } from "../../middleware/auth.middleware.js";
import { isValid } from "../../middleware/validation.middleware.js";
import { signupSchema, loginSchema, changePasswordSchema, updateUserSchema, deleteUserSchema } from './user.validation.js';

const router = Router();

// Signup route
router.post('/signup', isValid(signupSchema), signup);
// Login route
router.post('/login', isValid(loginSchema), login);
// Change password route
router.patch('/changepass', isValid(changePasswordSchema), isAuthenticated, changepass);
// Update user route
router.patch('/update', isAuthenticated, isValid(updateUserSchema), updateuser);
// Delete user route
router.delete('/delete', isAuthenticated, isValid(deleteUserSchema), deleteuser);
// Logout route
router.post('/logout', isAuthenticated, logout);
export default router;
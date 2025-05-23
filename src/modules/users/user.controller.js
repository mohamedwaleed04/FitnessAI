import { User } from "../../../db/models/users.model.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { catchError } from "../../utils/catch.error.js";
import { signupSchema, loginSchema, changePasswordSchema, updateUserSchema, deleteUserSchema } from './user.validation.js';

export const signup = catchError(async (req, res, next) => {
  // Validate request body
  const { error } = signupSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((err) => err.message);
    return res.status(400).json({ 
      success: false, 
      message: 'Validation error',
      errors 
    });
  }

  const { 
    userName, 
    email, 
    password, 
    confirmPassword, 
    age, 
    gender, 
    weight, 
    height, 
    activityLevel, // Now required
    goal // Now required
  } = req.body;

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ 
      success: false, 
      message: "Passwords do not match" 
    });
  }

  // Check if email exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ 
      success: false, 
      message: "Email already in use" 
    });
  }

  try {
    // Hash password
    const passwordHashed = await bcryptjs.hash(password, 12);

    // Create user - no more defaults needed since fields are required
    const user = await User.create({
      userName,
      email,
      password: passwordHashed,
      age,
      gender,
      weight,
      height,
      activityLevel, // Required
      goal // Required
    });

    // Return response without password
    const userResponse = { 
      userName: user.userName, 
      email: user.email,
      age: user.age,
      gender: user.gender,
      activityLevel: user.activityLevel, // Include in response
      goal: user.goal // Include in response
    };

    res.status(201).json({ 
      success: true, 
      data: userResponse 
    });
  } catch (err) {
    next(err);
  }
});
export const login = catchError(async (req, res, next) => {
  const { error } = loginSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((err) => err.message);
    return next(new Error(errors.join(', ')));
  }

  const { email, password } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("Invalid email"));
  }

  // Compare passwords
  const match = bcryptjs.compareSync(password, user.password);
  if (!match) {
    return next(new Error("Incorrect password"));
  }

  // Generate a JWT token
  const token = jwt.sign({ _id: user._id, email: user.email }, process.env.TOKEN_KEY, { expiresIn: '1h' });
  res.json({ success: true, message: "Login successful", token });
});

export const changepass = catchError(async (req, res, next) => {
  // Validate request body
  const { error } = changePasswordSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((err) => err.message);
    return next(new Error(errors.join(', ')));
  }

  const { password } = req.body;
  const userId = req.user._id;

  //hash
  const passwordHashed = bcryptjs.hashSync(password, 10);

  // Update the user's password
  await User.findByIdAndUpdate(userId, { password: passwordHashed });

  // Return success message
  res.json({ success: true, message: "Password updated successfully" });
});

export const updateuser = catchError(async (req, res, next) => {
  const { age, userName, activityLevel, goal } = req.body;

  if (!req.user || !req.user.id) {
    return next(new Error('Unauthorized: User not authenticated'));
  }

  const userId = req.user.id;

  // Update the user
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { age, userName, activityLevel, goal },
    { new: true }
  );
  if (!updatedUser) {
    return next(new Error('User not found'));
  }

  // Return success message
  res.json({ success: true, message: 'User updated successfully', data: updatedUser });
});
export const deleteuser = catchError(async (req, res, next) => {
  // Validate request body
  const { error } = deleteUserSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((err) => err.message);
    return next(new Error(errors.join(', ')));
  }

  const { email } = req.body;

  // Find and delete the user by email
  const user = await User.findOneAndDelete({ email });
  if (!user) {
    return next(new Error("User not found"));
  }

  // Return success message
  res.json({ success: true, message: "User deleted successfully" });
});

export const logout = catchError(async (req, res, next) => {
  // Ensure req.user is defined and contains the user's ID
  if (!req.user || !req.user._id) {
    return next(new Error('Unauthorized: User not authenticated'));
  }

  const userId = req.user._id;

  
  res.json({ success: true, message: 'Logout successful' });
});
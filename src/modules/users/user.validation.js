import Joi from 'joi';

// Validation schema for signup
export const signupSchema = Joi.object({
  userName: Joi.string().required().min(3).max(30).messages({
    'string.empty': 'Username is required',
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username cannot exceed 30 characters',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email address',
  }),
  password: Joi.string().required().min(6).messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'string.empty': 'Confirm password is required',
    'any.only': 'Passwords do not match',
  }),
  age: Joi.number().required().min(1).max(120).messages({
    'number.base': 'Age must be a number',
    'number.min': 'Age must be at least 1',
    'number.max': 'Age cannot exceed 120',
  }),
  gender: Joi.string().valid('male', 'female', 'other').required().messages({
    'string.empty': 'Gender is required',
    'any.only': 'Gender must be male, female, or other',
  }),
  weight: Joi.number().required().min(1).max(500).messages({
    'number.base': 'Weight must be a number',
    'number.min': 'Weight must be at least 1',
    'number.max': 'Weight cannot exceed 500',
  }),
  height: Joi.number().required().min(1).max(300).messages({
    'number.base': 'Height must be a number',
    'number.min': 'Height must be at least 1',
    'number.max': 'Height cannot exceed 300',
  }),
});

// Validation schema for login
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email address',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});

// Validation schema for change password
export const changePasswordSchema = Joi.object({
  password: Joi.string().required().min(6).messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
  }),
});

// Validation schema for update user
export const updateUserSchema = Joi.object({
  userName: Joi.string().min(3).max(30).messages({
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username cannot exceed 30 characters',
  }),
  age: Joi.number().min(1).max(120).messages({
    'number.base': 'Age must be a number',
    'number.min': 'Age must be at least 1',
    'number.max': 'Age cannot exceed 120',
  }),
});

// Validation schema for delete user
export const deleteUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email address',
  }),
});
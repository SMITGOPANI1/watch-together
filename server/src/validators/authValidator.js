import AppError from '../utils/AppError.js';

export const validateSignup = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = 'Name field is required';
  }

  if (!email || !email.trim()) {
    errors.email = 'Email address is required';
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = 'Please provide a valid email format';
  }

  if (!password) {
    errors.password = 'Password field is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation schema mismatch',
      errors,
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = 'Email address is required';
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = 'Invalid email address format';
  }

  if (!password) {
    errors.password = 'Password field is required';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation schema mismatch',
      errors,
    });
  }

  next();
};

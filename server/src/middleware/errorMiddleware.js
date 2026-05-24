import config from '../config/environment.js';

// Development Error responses (exposing full diagnostics)
const sendErrorDev = (err, req, res) => {
  return res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

// Production Error responses (keeping system details hidden)
const sendErrorProd = (err, req, res) => {
  // 1. Trusted operational error: send neat message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // 2. Untrusted system/programming errors: log and send generic response
  console.error('[CRITICAL SYSTEM ERROR]:', err);

  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong inside our hive. Please try again later!',
  });
};

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (config.nodeEnv === 'development') {
    sendErrorDev(err, req, res);
  } else {
    // Make a copy of the operational error or normalize standard MongoDB/Mongoose/JWT errors
    let error = { ...err };
    error.message = err.message;
    error.isOperational = err.isOperational;

    // Normalizing Mongoose CastError (e.g. invalid Room MongoDB Object ID)
    if (err.name === 'CastError') {
      error.message = `Invalid ${err.path}: ${err.value}`;
      error.statusCode = 400;
      error.isOperational = true;
    }

    // Normalizing Mongoose Duplicate Key Error
    if (err.code === 11000) {
      const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
      error.message = `Duplicate field value: ${value}. Please use another value!`;
      error.statusCode = 400;
      error.isOperational = true;
    }

    // Normalizing JWT Authentication errors
    if (err.name === 'JsonWebTokenError') {
      error.message = 'Invalid authentication token. Please sign in again.';
      error.statusCode = 401;
      error.isOperational = true;
    }

    if (err.name === 'TokenExpiredError') {
      error.message = 'Session expired. Please sign in again.';
      error.statusCode = 401;
      error.isOperational = true;
    }

    sendErrorProd(error, req, res);
  }
};

export default globalErrorHandler;

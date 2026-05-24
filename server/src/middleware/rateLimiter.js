import rateLimit from 'express-rate-limit';

const isDev = process.env.NODE_ENV !== 'production';

// Standard security rate limiter for generic APIs
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 10000 : 100, // Frictionless testing in development (10,000 requests)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: 'fail',
    message: 'Too many requests from this IP hive. Please try again after 15 minutes!',
  },
});

// Stricter rate limiter for authentication routes (login / register)
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isDev ? 1000 : 15, // Frictionless testing in development (1,000 requests)
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many credentials submission attempts. Please try again after an hour!',
  },
});

export default apiLimiter;

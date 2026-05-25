import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import config from './config/environment.js';
import v1Router from './routes/index.js';
import { requestLogger } from './middleware/requestLogger.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { globalErrorHandler } from './middleware/errorMiddleware.js';
import { AppError } from './utils/AppError.js';

const app = express();

// 1. GLOBAL HIGH-FIDELITY SECURITY HEADERS
app.use(helmet());

// 2. DYNAMIC CORS LINKAGE (ALLOWS COOKIES & MOCK CLIENT TOKENS)
app.use(
  cors({
    origin: (origin, callback) => {
      // Dynamically echo requesting origin to bypass environment mismatches
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// 3. CENTRALIZED REQUEST PARSERS
app.use(express.json({ limit: '10kb' })); // Limit body payload sizing to protect RAM
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// 4. REQUEST CONSOLE LOGGING
app.use(requestLogger);

// 5. SECURITY ROUTE RATE LIMITS
app.use('/api', apiLimiter);

// 6. CENTRAL GATEWAY ROUTING MOUNT
app.use('/api/v1', v1Router);

// 7. UNHANDLED ROUTE FALLBACK (404 OPERATIONAL ERROR)
app.all('*', (req, res, next) => {
  next(new AppError(`The endpoint ${req.originalUrl} does not exist on this watch server.`, 404));
});

// 8. GLOBAL CENTRALIZED ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

export default app;

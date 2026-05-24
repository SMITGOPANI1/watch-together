import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync.js';
import config from '../config/environment.js';

export const getHealth = catchAsync(async (req, res) => {
  // Check the Mongoose connection state: 1 = Connected, 0 = Disconnected, etc.
  const dbStatus = mongoose.connection.readyState === 1 ? 'UP' : 'DOWN';

  res.status(200).json({
    status: 'success',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    uptime: `${process.uptime().toFixed(1)}s`,
    services: {
      server: 'UP',
      database: dbStatus,
    },
    system: {
      memoryUsage: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
      platform: process.platform,
    }
  });
});

export default getHealth;

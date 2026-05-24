import mongoose from 'mongoose';
import config from '../config/environment.js';

let connectionRetries = 0;
const MAX_RETRIES = 5;
const RETRY_INTERVAL_MS = 5000;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: RETRY_INTERVAL_MS,
    });

    console.log(`[DATABASE]: MongoDB Connected: ${conn.connection.host}`);
    connectionRetries = 0; // Reset retries on success
  } catch (error) {
    console.error(`[DATABASE ERROR]: Connection failed: ${error.message}`);
    
    if (connectionRetries < MAX_RETRIES) {
      connectionRetries++;
      console.log(`[DATABASE]: Connection attempt ${connectionRetries}/${MAX_RETRIES} failed. Retrying in ${RETRY_INTERVAL_MS / 1000}s...`);
      setTimeout(connectDB, RETRY_INTERVAL_MS);
    } else {
      console.error('[DATABASE CRITICAL]: Maximum reconnection attempts reached. Continuing offline.');
    }
  }
};

// Event triggers for ongoing connection lifecycles
mongoose.connection.on('error', (err) => {
  console.error(`[DATABASE ERROR]: Active connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('[DATABASE WARNING]: Connection disconnected.');
});

mongoose.connection.on('reconnected', () => {
  console.log('[DATABASE]: Connection successfully reestablished.');
  connectionRetries = 0;
});

export default connectDB;

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the server root folder
dotenv.config({ path: path.join(__dirname, '../../.env') });

const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/watchhive',
  jwtSecret: process.env.JWT_SECRET || 'your_fallback_super_jwt_secret_key_watchhive_must_be_long',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};

// Auto validation on startup
const requiredKeys = ['JWT_SECRET'];

if (config.nodeEnv === 'production') {
  requiredKeys.forEach((key) => {
    if (!process.env[key]) {
      console.warn(`[WARNING]: Critical environment variable "${key}" is missing in production!`);
    }
  });
}

export default config;

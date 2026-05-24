import http from 'http';
import app from './src/app.js';
import connectDB from './src/database/connection.js';
import initSocketServer from './src/sockets/index.js';
import config from './src/config/environment.js';

// 1. UNCAUGHT EXCEPTION HANDLING (PREVENTS MUTE PROCESS CRASHES)
process.on('uncaughtException', (err) => {
  console.error('[CRITICAL UNCAUGHT EXCEPTION]: Server shutting down gracefully...', err);
  process.exit(1);
});

// 2. CONNECT TO DATABASE
connectDB();

// 3. CREATE NATIVE HTTP SERVER BINDING EXPRESS
const server = http.createServer(app);

// 4. ATTACH REAL-TIME WEBSOCKET EMITTERS
initSocketServer(server);

// 5. SPIN UP THE LISTENER ON TARGET ENVIRONMENT PORT
const PORT = config.port;
const expressServer = server.listen(PORT, () => {
  console.log(`[SERVER BOOT]: WatchHive Backend is live on Port: ${PORT}`);
  console.log(`[SERVER BOOT]: Active Environment: \x1b[35m${config.nodeEnv}\x1b[0m`);
});

// 6. UNHANDLED REJECTION MONITORING (Operational Errors Safety Net)
process.on('unhandledRejection', (err) => {
  console.error('[CRITICAL UNHANDLED REJECTION]: Shutting down server safely...', err);
  expressServer.close(() => {
    process.exit(1);
  });
});

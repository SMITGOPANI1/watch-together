import express from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import roomRoutes from './roomRoutes.js';
import userRoutes from './userRoutes.js';
import messageRoutes from './messageRoutes.js';

const router = express.Router();

// Register all modular child api routers
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/rooms', roomRoutes);
router.use('/users', userRoutes);
router.use('/messages', messageRoutes);

export default router;

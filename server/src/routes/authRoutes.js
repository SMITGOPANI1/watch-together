import express from 'express';
import { syncUser, getMe, logout } from '../controllers/authController.js';
import { verifyFirebaseToken, requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Sync User (only requires Firebase JWT decoding)
router.post('/sync-user', verifyFirebaseToken, syncUser);

// 2. Fetch authenticated MongoDB profile (requires token and existing DB profile)
router.get('/me', verifyFirebaseToken, requireAuth, getMe);

// 3. Close authenticated session (requires token and DB profile update)
router.post('/logout', verifyFirebaseToken, requireAuth, logout);

export default router;

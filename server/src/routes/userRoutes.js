import express from 'express';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { verifyFirebaseToken, requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth security guards globally across these profile paths
router.use(verifyFirebaseToken);
router.use(requireAuth);

router.route('/profile')
  .patch(updateProfile);

router.route('/:id')
  .get(getProfile);

export default router;

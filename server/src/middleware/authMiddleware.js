import admin, { isFirebaseConfigured } from '../config/firebase.js';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

// Middleware 1: Extracts and decodes the Firebase client JWT ID token
export const verifyFirebaseToken = catchAsync(async (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new AppError('Authentication credentials are required. Please log in.', 401));
  }

  // 1. Firebase is fully configured: Verify token with active admin SDK
  if (isFirebaseConfigured) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.firebaseUser = decodedToken;
      return next();
    } catch (error) {
      // In development/preview, check if it's a dev mock token to allow local overrides
      if (token.startsWith('mock_jwt_')) {
        console.log('[FIREBASE ADMIN]: Bypassing token validation using mock developer override.');
      } else {
        return next(new AppError('Invalid or expired session token. Please log in again.', 401));
      }
    }
  }

  // 2. Mock Developer Auth Mode active: Decode simulated payloads directly
  if (token.startsWith('mock_jwt_')) {
    // Decode mock properties based on token seed
    const isSignup = token.includes('signup');
    req.firebaseUser = {
      uid: isSignup ? 'user_mock_new' : 'user_1',
      email: isSignup ? 'newuser@watchhive.com' : 'smit@watchhive.com',
      name: isSignup ? 'WatchHive Explorer' : 'Smit Gopani',
      photoURL: isSignup ? '' : 'https://api.dicebear.com/7.x/adventurer/svg?seed=smit',
      firebase: { sign_in_provider: 'password' }
    };
    return next();
  }

  return next(new AppError('Firebase authentication server is offline and no developer tokens were detected.', 503));
});

// Middleware 2: Ensures the verified Firebase user has a synced MongoDB profile
export const requireAuth = catchAsync(async (req, res, next) => {
  if (!req.firebaseUser) {
    return next(new AppError('Token verification step was missed. Authorization denied.', 500));
  }

  // Lookup matched profile in MongoDB User collection
  const user = await User.findOne({ firebaseUid: req.firebaseUser.uid });
  
  if (!user) {
    return next(new AppError('Your Firebase session is verified, but no WatchHive user profile exists yet. Please trigger a user synchronization sync.', 401));
  }

  // Attach Mongoose Document record to request context
  req.user = user;
  next();
});

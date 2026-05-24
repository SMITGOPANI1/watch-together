import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import User from '../models/User.js';

// Synchronizes the Firebase Auth state with our MongoDB User document
export const syncUser = catchAsync(async (req, res, next) => {
  if (!req.firebaseUser) {
    return next(new AppError('Decoded session token not found. Synchronization aborted.', 401));
  }

  const { uid, email, name, photoURL } = req.firebaseUser;

  // 1. Check if user already exists in MongoDB
  let user = await User.findOne({ firebaseUid: uid });

  if (user) {
    // Update active connection metrics
    user.onlineStatus = 'online';
    user.lastSeen = new Date();
    await user.save();

    console.log(`[AUTH]: Synced existing user profile: ${user.username} (${user.email})`);
  } else {
    // 2. Register new profile document
    const username = name || email.split('@')[0] || 'Hive Explorer';
    user = await User.create({
      firebaseUid: uid,
      username,
      email,
      avatar: photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${uid}`,
      onlineStatus: 'online',
      lastSeen: new Date()
    });

    console.log(`[AUTH]: Registered and synced new user profile: ${user.username}`);
  }

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

// Retrieves the authenticated session profile directly from req.user
export const getMe = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError('No authenticated user profile loaded.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { user: req.user }
  });
});

// Logs out user, setting their MongoDB online status to offline
export const logout = catchAsync(async (req, res, next) => {
  // If the user has requireAuth verification, set offline status
  if (req.user) {
    req.user.onlineStatus = 'offline';
    req.user.lastSeen = new Date();
    await req.user.save();
    console.log(`[AUTH]: User logged out, set status to offline: ${req.user.username}`);
  }

  res.status(200).json({
    status: 'success',
    message: 'Session closed successfully.'
  });
});

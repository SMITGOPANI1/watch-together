import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import User from '../models/User.js';

// Retrieve profile by ObjectId or Firebase Uid
export const getProfile = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Search by MongoDB ID first, fallback to Firebase Uid query
  let user = null;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    user = await User.findById(id);
  } else {
    user = await User.findOne({ firebaseUid: id });
  }

  if (!user) {
    return next(new AppError(`WatchHive explorer with ID "${id}" was not found.`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

// Update profile properties for the active authenticated user
export const updateProfile = catchAsync(async (req, res, next) => {
  const { name, avatar, bio } = req.body;

  // Apply edits directly to req.user (Mongoose Document attached via requireAuth)
  if (name && name.trim()) {
    req.user.username = name.trim();
  }
  if (avatar !== undefined) {
    req.user.avatar = avatar;
  }
  if (bio !== undefined) {
    req.user.bio = bio;
  }

  await req.user.save();

  console.log(`[USER]: Profile properties updated for ${req.user.username}`);

  res.status(200).json({
    status: 'success',
    message: 'Profile configuration updated successfully.',
    data: { user: req.user }
  });
});

// Update watch time for the active authenticated user
export const updateWatchTime = catchAsync(async (req, res, next) => {
  const { hours } = req.body;

  if (hours && typeof hours === 'number') {
    req.user.hoursWatched = Number((req.user.hoursWatched || 0) + hours);
    await req.user.save();
  }

  res.status(200).json({
    status: 'success',
    data: { user: req.user }
  });
});

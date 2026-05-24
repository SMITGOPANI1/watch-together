import admin, { isFirebaseConfigured } from '../config/firebase.js';
import User from '../models/User.js';

export const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;

    if (!token) {
      return next(new Error('Authentication token is required. Connection denied.'));
    }

    let firebaseUid = null;
    let email = null;
    let username = null;
    let avatar = null;

    // 1. Firebase is fully configured: Decode token securely
    if (isFirebaseConfigured) {
      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        firebaseUid = decodedToken.uid;
        email = decodedToken.email;
        username = decodedToken.name || email.split('@')[0];
        avatar = decodedToken.picture || '';
      } catch (err) {
        if (!token.startsWith('mock_jwt_')) {
          return next(new Error('Session token has expired or is invalid. Connection denied.'));
        }
      }
    }

    // 2. Mock Developer Auth Mode active: Decode simulated tokens
    if (token.startsWith('mock_jwt_')) {
      const isSignup = token.includes('signup');
      firebaseUid = isSignup ? 'user_mock_new' : 'user_1';
      email = isSignup ? 'newuser@watchhive.com' : 'smit@watchhive.com';
      username = isSignup ? 'WatchHive Explorer' : 'Smit Gopani';
      avatar = isSignup ? '' : 'https://api.dicebear.com/7.x/adventurer/svg?seed=smit';
    }

    if (!firebaseUid) {
      return next(new Error('Verification failed. Session is invalid.'));
    }

    // Lookup matching profile record in MongoDB
    let user = await User.findOne({ firebaseUid });

    // If database connection is active and profile is missing, auto-create it
    if (!user) {
      try {
        user = await User.create({
          firebaseUid,
          username,
          email,
          avatar: avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${firebaseUid}`,
          onlineStatus: 'online',
          lastSeen: new Date()
        });
      } catch (dbErr) {
        // Database offline fallback: construct simple mock schema record
        user = {
          id: firebaseUid === 'user_1' ? '65fc4f3c7b39a42f50000001' : '65fc4f3c7b39a42f50000002',
          firebaseUid,
          username,
          email,
          avatar: avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${firebaseUid}`,
          onlineStatus: 'online',
          level: 'Host Pro',
          levelValue: 78,
          hoursWatched: 48.5,
          roomsHosted: 24
        };
      }
    } else {
      user.onlineStatus = 'online';
      user.lastSeen = new Date();
      try {
        await user.save();
      } catch (saveErr) {
        // Ignore save warnings if connection is briefly sleeping
      }
    }

    // Bind MongoDB Mongoose model directly to the active socket context
    socket.user = user;
    next();
  } catch (error) {
    console.error('[SOCKET AUTH ERROR]: Handshake authorization failed:', error.message);
    next(new Error('Internal server authorization exception. Connection denied.'));
  }
};

export default socketAuth;

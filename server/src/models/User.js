import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: [true, 'Firebase UID is required'],
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    favoriteRooms: [
      {
        type: String, // Stored as roomIds
      }
    ],
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }
    ],
    onlineStatus: {
      type: String,
      enum: ['online', 'offline'],
      default: 'online',
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Auto handles createdAt and updatedAt
  }
);

// Virtual for level fields matching client-side mock states
userSchema.virtual('level').get(function() {
  return 'Host Pro';
});

userSchema.virtual('levelValue').get(function() {
  return 78;
});

userSchema.virtual('hoursWatched').get(function() {
  return 48.5;
});

userSchema.virtual('roomsHosted').get(function() {
  return 24;
});

// Configure virtual to JSON maps
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

export const User = mongoose.model('User', userSchema);
export default User;

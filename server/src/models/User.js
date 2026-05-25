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
    hoursWatched: {
      type: Number,
      default: 0,
    },
    roomsHosted: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Auto handles createdAt and updatedAt
  }
);

// Virtual for level fields matching client-side mock states
userSchema.virtual('level').get(function() {
  const hours = this.hoursWatched || 0;
  if (hours < 2) return 'Newbie';
  if (hours < 10) return 'Stream Fan';
  if (hours < 25) return 'Watch Enthusiast';
  if (hours < 50) return 'Host Pro';
  return 'Master Streamer';
});

userSchema.virtual('levelValue').get(function() {
  const hours = this.hoursWatched || 0;
  if (hours < 2) return Math.round((hours / 2) * 100);
  if (hours < 10) return Math.round(((hours - 2) / 8) * 100);
  if (hours < 25) return Math.round(((hours - 10) / 15) * 100);
  if (hours < 50) return Math.round(((hours - 25) / 25) * 100);
  return 100;
});

// Configure virtual to JSON maps
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

export const User = mongoose.model('User', userSchema);
export default User;

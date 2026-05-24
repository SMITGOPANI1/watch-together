import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['Host', 'Member'], default: 'Member' },
  joinedAt: { type: Date, default: Date.now }
}, { _id: false });

const videoSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  youtubeId: { type: String, default: '' },
  duration: { type: String, default: '00:00' },
  thumbnail: { type: String, default: '' }
}, { _id: false });

const queueItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  duration: { type: String, default: '00:00' },
  addedBy: { type: String, required: true },
  youtubeId: { type: String, required: true },
  thumbnail: { type: String, default: '' }
}, { _id: false });

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: [true, 'Room ID is required'],
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Room title is required'],
      trim: true,
    },
    host: {
      name: { type: String, required: true },
      avatar: { type: String, default: '' },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    participants: [participantSchema],
    currentVideo: {
      type: videoSchema,
      default: () => ({
        title: "MKBHD - Apple Vision Pro Review: The Movie",
        youtubeId: "dtp6b76pMak",
        duration: "29:12",
        thumbnail: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=600&q=80"
      })
    },
    videoQueue: [queueItemSchema],
    privacy: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    activeStatus: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active',
      index: true,
    }
  },
  {
    timestamps: true,
  }
);

export const Room = mongoose.model('Room', roomSchema);
export default Room;

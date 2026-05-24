import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: [true, 'Room ID link is required'],
      index: true,
    },
    sender: {
      name: { type: String, required: true },
      avatar: { type: String, default: '' },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    message: {
      type: String,
      required: [true, 'Message text is required'],
      trim: true,
    },
    messageType: {
      type: String,
      enum: ['chat', 'system'],
      default: 'chat',
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    }
  },
  {
    timestamps: true,
  }
);

export const Message = mongoose.model('Message', messageSchema);
export default Message;

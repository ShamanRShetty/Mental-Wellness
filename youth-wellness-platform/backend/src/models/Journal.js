const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    default: 'Untitled Entry'
  },
  content: {
    type: String,
    required: true
  },
  mood: {
    type: String,
    enum: ['very_sad', 'sad', 'neutral', 'happy', 'very_happy']
  },
  tags: [String],
  isPrivate: {
    type: Boolean,
    default: true
  },
  prompt: {
    type: String // If responding to a prompt
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

journalSchema.index({ sessionId: 1, createdAt: -1 });

module.exports = mongoose.model('Journal', journalSchema);
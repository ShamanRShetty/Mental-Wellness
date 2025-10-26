const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  conversationHistory: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    sentiment: {
      score: Number,
      magnitude: Number
    }
  }],
  moodEntries: [{
    mood: {
      type: String,
      enum: ['very_sad', 'sad', 'neutral', 'happy', 'very_happy'],
      required: true
    },
    intensity: {
      type: Number,
      min: 1,
      max: 10
    },
    note: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    activities: [String],
    triggers: [String]
  }],
  crisisEvents: [{
    detected: {
      type: Boolean,
      default: false
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    },
    keywords: [String],
    timestamp: {
      type: Date,
      default: Date.now
    },
    responseProvided: Boolean
  }],
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    notifications: {
      type: Boolean,
      default: true
    }
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
sessionSchema.index({ lastActive: 1 });
sessionSchema.index({ createdAt: 1 });

// Update lastActive on any interaction
sessionSchema.pre('save', function(next) {
  this.lastActive = new Date();
  next();
});

module.exports = mongoose.model('Session', sessionSchema);
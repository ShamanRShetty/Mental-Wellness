const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['article', 'video', 'helpline', 'exercise', 'meditation', 'emergency'],
    required: true
  },
  content: {
    type: String
  },
  url: {
    type: String
  },
  language: {
    type: String,
    default: 'en'
  },
  tags: [String],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  duration: {
    type: Number // in minutes
  },
  isEmergency: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  helpful: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

resourceSchema.index({ category: 1, language: 1 });
resourceSchema.index({ tags: 1 });

module.exports = mongoose.models.Resource || mongoose.model('Resource', resourceSchema);

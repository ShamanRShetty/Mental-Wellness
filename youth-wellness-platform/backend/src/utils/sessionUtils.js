const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');
const Session = require('../models/Session');

// -------------------- Resource Schema --------------------
const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['article', 'video', 'helpline', 'exercise', 'meditation', 'emergency'], required: true },
  content: { type: String },
  url: { type: String },
  language: { type: String, default: 'en' },
  tags: [String],
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  duration: { type: Number },
  isEmergency: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  helpful: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

resourceSchema.index({ category: 1, language: 1 });
resourceSchema.index({ tags: 1 });

const Resource = mongoose.models.Resource || mongoose.model("Resource", resourceSchema);

// -------------------- Session Utilities --------------------
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 16);

// ✅ In-memory store (still used for fast access)
const activeSessions = new Map();

function generateSessionId() {
  const sessionId = `sess_${nanoid()}`;
  activeSessions.set(sessionId, { createdAt: Date.now() });
  return sessionId;
}

// ✅ Persistent validation via MongoDB
async function isValidSessionId(id) {
  if (!id) return false;

  // If active in memory, fast path
  if (activeSessions.has(id)) return true;

  // Check database for fallback
  const exists = await Session.exists({ sessionId: id });
  return !!exists;
}

function getSession(id) {
  return activeSessions.get(id);
}

function updateSession(id, data) {
  if (activeSessions.has(id)) {
    activeSessions.set(id, { ...activeSessions.get(id), ...data });
  }
}

module.exports = {
  Resource,
  generateSessionId,
  isValidSessionId,
  getSession,
  updateSession
};

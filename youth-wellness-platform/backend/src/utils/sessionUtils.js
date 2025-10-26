const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');

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

// ✅ In-memory session store
const activeSessions = new Map();

function generateSessionId() {
  const sessionId = `sess_${nanoid()}`;
  activeSessions.set(sessionId, { createdAt: Date.now() });
  return sessionId;
}

function isValidSessionId(id) {
  return activeSessions.has(id);
}

// ✅ Optional: Get session object if needed later
function getSession(id) {
  return activeSessions.get(id);
}

// ✅ Optional: Update session data
function updateSession(id, data) {
  if (activeSessions.has(id)) {
    activeSessions.set(id, { ...activeSessions.get(id), ...data });
  }
}

// -------------------- Exports --------------------
module.exports = {
  Resource,
  generateSessionId,
  isValidSessionId,
  getSession,
  updateSession
};

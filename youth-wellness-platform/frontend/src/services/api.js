import axios from "axios";
import { getSessionId } from "../utils/storage";

const API_BASE_URL = "https://mental-wellness-xpts.onrender.com";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

// ============================================
// CHAT ENDPOINTS
// ============================================

/**
 * Initialize a new chat session
 */
export const initializeSession = async (language = "en") => {
  const response = await api.post("/chat/init", { language });
  return response.data;
};

/**
 * Send a message in the chat
 */
export const sendMessage = async (sessionId, message) => {
  const response = await api.post("/chat/message", {
    sessionId,
    message,
  });
  return response.data;
};

/**
 * Get conversation history
 */
export const getConversationHistory = async (sessionId) => {
  const response = await api.get(`/chat/history/${sessionId}`);
  return response.data;
};

/**
 * Clear conversation history
 */
export const clearHistory = async (sessionId) => {
  const response = await api.post("/chat/clear", { sessionId });
  return response.data;
};

// ============================================
// MOOD ENDPOINTS (✅ Corrected)
// ============================================

/**
 * Log a mood entry
 */
export const logMood = async (data) => {
  const sessionId = getSessionId();
  if (!sessionId) throw new Error("Session ID missing — please refresh.");

  const payload = {
    sessionId,
    mood: data.mood,
    intensity: data.intensity || 5,
    note: data.note || "",
    activities: data.activities || [],
    triggers: data.triggers || [],
  };

  const response = await api.post("/mood/log", payload);
  return response.data;
};

/**
 * Get mood history
 */
export const getMoodHistory = async (days = 7) => {
  const sessionId = getSessionId();
  if (!sessionId) throw new Error("Session ID missing — please refresh.");

  const response = await api.get(`/mood/history/${sessionId}?days=${days}`);
  return response.data;
};

/**
 * Get mood insights
 */
export const getMoodInsights = async () => {
  const sessionId = getSessionId();
  if (!sessionId) throw new Error("Session ID missing — please refresh.");

  const response = await api.get(`/mood/insights/${sessionId}`);
  return response.data;
};

// ============================================
// RESOURCE ENDPOINTS
// ============================================

/**
 * Get all resources with optional filters
 */
export const getResources = async (filters = {}) => {
  const response = await api.get("/resources", { params: filters });
  return response.data;
};

/**
 * Get a single resource
 */
export const getResourceById = async (id) => {
  const response = await api.get(`/resources/${id}`);
  return response.data;
};

/**
 * Mark resource as helpful
 */
export const markResourceHelpful = async (id) => {
  const response = await api.post(`/resources/${id}/helpful`);
  return response.data;
};

/**
 * Get emergency helplines
 */
export const getEmergencyHelplines = async () => {
  const response = await api.get("/resources/emergency/helplines");
  return response.data;
};

// ============================================
// JOURNAL ENDPOINTS (🆕 Added)
// ============================================

/**
 * Create a journal entry
 */
export const createJournalEntry = async (entryData) => {
  const sessionId = getSessionId();
  if (!sessionId) throw new Error("Session ID missing — please refresh.");

  const payload = { sessionId, ...entryData };
  const response = await api.post("/journal", payload);
  return response.data;
};

/**
 * Get all journal entries
 */
export const getJournalEntries = async (limit = 10, skip = 0) => {
  const sessionId = getSessionId();
  if (!sessionId) throw new Error("Session ID missing — please refresh.");

  const params = { limit, skip };
  const response = await api.get(`/journal/${sessionId}`, { params });
  return response.data;
};

/**
 * Get single journal entry
 */
export const getJournalEntry = async (id) => {
  const response = await api.get(`/journal/entry/${id}`);
  return response.data;
};

/**
 * Update journal entry
 */
export const updateJournalEntry = async (id, updates) => {
  const response = await api.put(`/journal/${id}`, updates);
  return response.data;
};

/**
 * Delete journal entry
 */
export const deleteJournalEntry = async (id) => {
  const response = await api.delete(`/journal/${id}`);
  return response.data;
};

/**
 * Get random journal prompts
 */
export const getJournalPrompts = async () => {
  const response = await api.get("/journal/prompts/random");
  return response.data;
};

export default api;

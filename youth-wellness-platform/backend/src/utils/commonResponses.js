/**
 * Common responses to avoid API calls for frequent queries
 */
const commonResponses = {
  'hi': "Hello! I'm here to listen and support you. How are you feeling today?",
  'hello': "Hi there! This is a safe space. What would you like to talk about?",
  'hey': "Hey! I'm glad you're here. What's on your mind?",
  'how are you': "Thank you for asking! I'm here and ready to listen. More importantly, how are *you* doing?",
  'thank you': "You're very welcome! I'm here whenever you need support. Take care! 💙",
  'thanks': "You're welcome! Feel free to come back anytime you need to talk. 🌟",
  'bye': "Take care! Remember, I'm here whenever you need support. You're doing great! ✨",
  'goodbye': "Goodbye for now! Remember to be kind to yourself. I'm here when you need me. 💙",
};

function getCommonResponse(message) {
  const normalized = message.toLowerCase().trim();
  return commonResponses[normalized] || null;
}

module.exports = {
  getCommonResponse,
};
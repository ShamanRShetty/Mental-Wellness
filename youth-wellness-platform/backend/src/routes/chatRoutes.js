const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { getRateLimitStatus } = require('../services/geminiService');

// Initialize new session
router.post('/init', chatController.initializeSession);

// Send message
router.post('/message', chatController.sendMessage);

router.get('/rate-limit', (req, res) => {
  const status = getRateLimitStatus();
  res.json({
    success: true,
    ...status,
  });
});

// Get conversation history
router.get('/history/:sessionId', chatController.getConversationHistory);

// Clear history
router.post('/clear', chatController.clearHistory);

module.exports = router;
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Initialize new session
router.post('/init', chatController.initializeSession);

// Send message
router.post('/message', chatController.sendMessage);

// Get conversation history
router.get('/history/:sessionId', chatController.getConversationHistory);

// Clear history
router.post('/clear', chatController.clearHistory);

module.exports = router;
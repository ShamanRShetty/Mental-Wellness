const express = require('express');
const router = express.Router();
const moodController = require('../controllers/moodController');

// Log mood
router.post('/log', moodController.logMood);

// Get mood history
router.get('/history/:sessionId', moodController.getMoodHistory);

// Get insights
router.get('/insights/:sessionId', moodController.getMoodInsights);

module.exports = router;
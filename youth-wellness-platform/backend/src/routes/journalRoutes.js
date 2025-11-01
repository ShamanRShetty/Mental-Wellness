const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');

// Create entry
router.post('/', journalController.createEntry);

// Get all entries for session
router.get('/:sessionId', journalController.getEntries);

// Get single entry
router.get('/entry/:id', journalController.getEntry);

// Update entry
router.put('/:id', journalController.updateEntry);

// Delete entry
router.delete('/:id', journalController.deleteEntry);

// Get prompts
router.get('/prompts/random', journalController.getPrompts);

module.exports = router;
const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');

// Get all resources
router.get('/', resourceController.getResources);

// Get single resource
router.get('/:id', resourceController.getResourceById);

// Mark resource as helpful
router.post('/:id/helpful', resourceController.markHelpful);

// Get emergency helplines
router.get('/emergency/helplines', resourceController.getEmergencyHelplines);

// Seed initial resources (development only)
router.post('/seed', resourceController.seedResources);

module.exports = router;
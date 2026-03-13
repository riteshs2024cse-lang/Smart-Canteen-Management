const express = require('express');
const router = express.Router();
const bookingSettingsController = require('../controllers/bookingSettingsController');

// Get current settings
router.get('/', bookingSettingsController.getSettings);

// Update settings
router.put('/', bookingSettingsController.updateSettings);

// Toggle booking on/off
router.post('/toggle', bookingSettingsController.toggleBooking);

module.exports = router;

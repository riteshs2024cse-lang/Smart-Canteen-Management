const express = require('express');
const router = express.Router();
const bookingSettingsController = require('../controllers/bookingSettingsController');
const { protect, authorize } = require('../middleware/auth');

// Get current settings
router.get('/', protect, authorize('admin', 'user'), bookingSettingsController.getSettings);

// Update settings
router.put('/', protect, authorize('admin'), bookingSettingsController.updateSettings);

// Toggle booking on/off
router.post('/toggle', protect, authorize('admin'), bookingSettingsController.toggleBooking);

module.exports = router;

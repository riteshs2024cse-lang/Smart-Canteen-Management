const express = require('express');
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  getBookingsByUserId,
  getBookingById,
  cancelBooking,
  getBookingStats
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

// Booking routes
router.post('/', protect, authorize('user', 'admin'), createBooking);
router.get('/', protect, authorize('admin'), getAllBookings);
router.get('/stats', protect, authorize('admin'), getBookingStats);
router.get('/user/:userId', protect, authorize('user', 'admin'), getBookingsByUserId);
router.get('/:id', protect, authorize('admin'), getBookingById);
router.put('/:id/cancel', protect, authorize('user', 'admin'), cancelBooking);

module.exports = router;

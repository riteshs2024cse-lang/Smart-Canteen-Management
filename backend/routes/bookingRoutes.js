const express = require('express');
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  getBookingById,
  cancelBooking,
  getBookingStats
} = require('../controllers/bookingController');

// Booking routes
router.post('/', createBooking);
router.get('/', getAllBookings);
router.get('/stats', getBookingStats);
router.get('/:id', getBookingById);
router.put('/:id/cancel', cancelBooking);

module.exports = router;

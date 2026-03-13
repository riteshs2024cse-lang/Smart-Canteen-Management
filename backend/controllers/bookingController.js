const Booking = require('../models/Booking');
const BookingSettings = require('../models/BookingSettings');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Public
exports.createBooking = async (req, res, next) => {
  try {
    // Check if booking system is enabled
    const settings = await BookingSettings.getSettings();
    if (!settings.isBookingEnabled) {
      return res.status(403).json({
        success: false,
        message: settings.closureMessage || 'Pre-booking is currently closed'
      });
    }

    let { userId, userName, userEmail, userPhone, bookingDate, mealType, foodItems, specialRequests } = req.body;

    if (req.user && req.user.role === 'user') {
      userId = req.user.userId;
      userName = req.user.name;
      userEmail = req.user.email;
      userPhone = req.user.phone;
    }

    // Validation
    if (!userId || !userName || !bookingDate || !mealType || !foodItems || foodItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if booking already exists for this user, date, and meal type
    const existingBooking = await Booking.findOne({
      userId,
      bookingDate: new Date(bookingDate),
      mealType,
      status: 'confirmed'
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: `You already have a booking for ${mealType} on this date`
      });
    }

    const booking = await Booking.create({
      userId,
      userName,
      userEmail,
      userPhone,
      bookingDate,
      mealType,
      foodItems,
      specialRequests
    });

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Booking created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Public
exports.getAllBookings = async (req, res, next) => {
  try {
    const { startDate, endDate, mealType, status, userId, limit = 100, page = 1 } = req.query;

    // Build query
    let query = {};

    if (startDate || endDate) {
      query.bookingDate = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        query.bookingDate.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.bookingDate.$lte = end;
      }
    }

    if (mealType) {
      query.mealType = mealType;
    }

    if (status) {
      query.status = status;
    }

    if (userId) {
      query.userId = userId;
    }

    const skip = (page - 1) * limit;

    const bookings = await Booking.find(query)
      .sort({ bookingDate: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings by user ID
// @route   GET /api/bookings/user/:userId
// @access  Public
exports.getBookingsByUserId = async (req, res, next) => {
  try {
    const userId = (req.params.userId || '').trim();

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    if (req.user && req.user.role === 'user' && req.user.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own bookings'
      });
    }

    const bookings = await Booking.find({ userId })
      .sort({ bookingDate: -1, bookingTime: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Public
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Public
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (req.user && req.user.role === 'user' && req.user.userId !== booking.userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own bookings'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      data: booking,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking statistics
// @route   GET /api/bookings/stats
// @access  Public
exports.getBookingStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.bookingDate = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        dateFilter.bookingDate.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.bookingDate.$lte = end;
      }
    }

    const stats = await Booking.aggregate([
      { $match: { ...dateFilter, status: 'confirmed' } },
      {
        $group: {
          _id: '$mealType',
          totalBookings: { $sum: 1 },
          totalDiners: { $sum: 1 }
        }
      }
    ]);

    // Get food item breakdown
    const foodItemStats = await Booking.aggregate([
      { $match: { ...dateFilter, status: 'confirmed' } },
      { $unwind: '$foodItems' },
      {
        $group: {
          _id: '$foodItems.name',
          totalQuantity: { $sum: '$foodItems.quantity' },
          bookingCount: { $sum: 1 }
        }
      },
      { $sort: { totalQuantity: -1 } }
    ]);

    // Get summary statistics
    const totalBookings = await Booking.countDocuments({ status: 'confirmed' });
    
    // Get today's bookings (using hardcoded date for demo: March 12, 2026)
    const today = new Date('2026-03-12');
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayBookings = await Booking.countDocuments({
      status: 'confirmed',
      bookingDate: { $gte: today, $lt: tomorrow }
    });

    // Expected diners for today only (count each booking as 1 diner)
    const expectedDiners = todayBookings;

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        todayBookings,
        expectedDiners,
        mealTypeStats: stats,
        foodItemStats
      }
    });
  } catch (error) {
    next(error);
  }
};

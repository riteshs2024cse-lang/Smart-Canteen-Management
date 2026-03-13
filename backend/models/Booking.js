const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    trim: true
  },
  userName: {
    type: String,
    required: [true, 'User name is required'],
    trim: true
  },
  userEmail: {
    type: String,
    trim: true
  },
  userPhone: {
    type: String,
    trim: true
  },
  bookingDate: {
    type: Date,
    required: [true, 'Booking date is required']
  },
  mealType: {
    type: String,
    required: [true, 'Meal type is required'],
    enum: ['breakfast', 'lunch', 'dinner']
  },
  foodItems: [{
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  }],
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  bookingTime: {
    type: Date,
    default: Date.now
  },
  specialRequests: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
bookingSchema.index({ bookingDate: 1, mealType: 1 });
bookingSchema.index({ userId: 1 });

module.exports = mongoose.model('Booking', bookingSchema);

const mongoose = require('mongoose');

const foodLogSchema = new mongoose.Schema({
  foodItem: {
    type: String,
    required: [true, 'Food item name is required'],
    trim: true
  },
  preparedQty: {
    type: Number,
    required: [true, 'Prepared quantity is required'],
    min: [0, 'Prepared quantity cannot be negative']
  },
  consumedQty: {
    type: Number,
    required: [true, 'Consumed quantity is required'],
    min: [0, 'Consumed quantity cannot be negative']
  },
  wastedQty: {
    type: Number,
    required: [true, 'Wasted quantity is required'],
    min: [0, 'Wasted quantity cannot be negative']
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
foodLogSchema.index({ date: -1 });
foodLogSchema.index({ foodItem: 1 });

module.exports = mongoose.model('FoodLog', foodLogSchema);

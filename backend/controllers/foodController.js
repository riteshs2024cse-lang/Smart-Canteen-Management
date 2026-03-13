const FoodLog = require('../models/FoodLog');

// @desc    Create a new food log entry
// @route   POST /api/food-log
// @access  Public
exports.createFoodLog = async (req, res, next) => {
  try {
    const { foodItem, preparedQty, consumedQty, wastedQty, date } = req.body;

    // Validation
    if (!foodItem || preparedQty === undefined || consumedQty === undefined || wastedQty === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const foodLog = await FoodLog.create({
      foodItem,
      preparedQty,
      consumedQty,
      wastedQty,
      date: date || new Date()
    });

    res.status(201).json({
      success: true,
      data: foodLog,
      message: 'Food log created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all food logs
// @route   GET /api/food-log
// @access  Public
exports.getAllFoodLogs = async (req, res, next) => {
  try {
    const { startDate, endDate, foodItem, limit = 100, page = 1 } = req.query;

    // Build query
    let query = {};

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        query.date.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    if (foodItem) {
      query.foodItem = { $regex: foodItem, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    const foodLogs = await FoodLog.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await FoodLog.countDocuments(query);

    res.status(200).json({
      success: true,
      count: foodLogs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: foodLogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a specific food log by ID
// @route   GET /api/food-log/:id
// @access  Public
exports.getFoodLogById = async (req, res, next) => {
  try {
    const foodLog = await FoodLog.findById(req.params.id);

    if (!foodLog) {
      return res.status(404).json({
        success: false,
        message: 'Food log not found'
      });
    }

    res.status(200).json({
      success: true,
      data: foodLog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a food log
// @route   PUT /api/food-log/:id
// @access  Public
exports.updateFoodLog = async (req, res, next) => {
  try {
    const foodLog = await FoodLog.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!foodLog) {
      return res.status(404).json({
        success: false,
        message: 'Food log not found'
      });
    }

    res.status(200).json({
      success: true,
      data: foodLog,
      message: 'Food log updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a food log
// @route   DELETE /api/food-log/:id
// @access  Public
exports.deleteFoodLog = async (req, res, next) => {
  try {
    const foodLog = await FoodLog.findByIdAndDelete(req.params.id);

    if (!foodLog) {
      return res.status(404).json({
        success: false,
        message: 'Food log not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Food log deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

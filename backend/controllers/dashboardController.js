const FoodLog = require('../models/FoodLog');

// @desc    Get dashboard analytics
// @route   GET /api/dashboard
// @access  Public
exports.getDashboardStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        dateFilter.date.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateFilter.date.$lte = end;
      }
    }

    // Aggregation pipeline for dashboard statistics
    const stats = await FoodLog.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalPrepared: { $sum: '$preparedQty' },
          totalConsumed: { $sum: '$consumedQty' },
          totalWasted: { $sum: '$wastedQty' },
          logsCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          totalPrepared: 1,
          totalConsumed: 1,
          totalWasted: 1,
          logsCount: 1,
          wastePercentage: {
            $cond: {
              if: { $eq: ['$totalPrepared', 0] },
              then: 0,
              else: {
                $multiply: [
                  { $divide: ['$totalWasted', '$totalPrepared'] },
                  100
                ]
              }
            }
          }
        }
      }
    ]);

    // Get food item breakdown
    const foodItemBreakdown = await FoodLog.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$foodItem',
          totalPrepared: { $sum: '$preparedQty' },
          totalConsumed: { $sum: '$consumedQty' },
          totalWasted: { $sum: '$wastedQty' }
        }
      },
      {
        $project: {
          foodItem: '$_id',
          _id: 0,
          totalPrepared: 1,
          totalConsumed: 1,
          totalWasted: 1,
          wastePercentage: {
            $cond: {
              if: { $eq: ['$totalPrepared', 0] },
              then: 0,
              else: {
                $multiply: [
                  { $divide: ['$totalWasted', '$totalPrepared'] },
                  100
                ]
              }
            }
          }
        }
      },
      { $sort: { totalWasted: -1 } }
    ]);

    // Get daily trends
    const dailyTrends = await FoodLog.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' }
          },
          totalPrepared: { $sum: '$preparedQty' },
          totalConsumed: { $sum: '$consumedQty' },
          totalWasted: { $sum: '$wastedQty' }
        }
      },
      {
        $project: {
          date: '$_id',
          _id: 0,
          totalPrepared: 1,
          totalConsumed: 1,
          totalWasted: 1,
          wastePercentage: {
            $cond: {
              if: { $eq: ['$totalPrepared', 0] },
              then: 0,
              else: {
                $multiply: [
                  { $divide: ['$totalWasted', '$totalPrepared'] },
                  100
                ]
              }
            }
          }
        }
      },
      { $sort: { date: -1 } },
      { $limit: 30 }
    ]);

    const dashboardData = {
      success: true,
      data: {
        summary: stats.length > 0 ? stats[0] : {
          totalPrepared: 0,
          totalConsumed: 0,
          totalWasted: 0,
          logsCount: 0,
          wastePercentage: 0
        },
        foodItemBreakdown,
        dailyTrends
      }
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    next(error);
  }
};

// @desc    Get waste analysis
// @route   GET /api/dashboard/waste-analysis
// @access  Public
exports.getWasteAnalysis = async (req, res, next) => {
  try {
    const wasteAnalysis = await FoodLog.aggregate([
      {
        $group: {
          _id: '$foodItem',
          totalPrepared: { $sum: '$preparedQty' },
          totalConsumed: { $sum: '$consumedQty' },
          avgWasted: { $avg: '$wastedQty' },
          maxWasted: { $max: '$wastedQty' },
          minWasted: { $min: '$wastedQty' },
          totalWasted: { $sum: '$wastedQty' },
          occurrences: { $sum: 1 }
        }
      },
      {
        $project: {
          foodItem: '$_id',
          _id: 0,
          totalPrepared: 1,
          totalConsumed: 1,
          avgWasted: { $round: ['$avgWasted', 2] },
          maxWasted: 1,
          minWasted: 1,
          totalWasted: 1,
          occurrences: 1,
          wastePercentage: {
            $cond: {
              if: { $eq: ['$totalPrepared', 0] },
              then: 0,
              else: {
                $multiply: [
                  { $divide: ['$totalWasted', '$totalPrepared'] },
                  100
                ]
              }
            }
          }
        }
      },
      { $sort: { totalWasted: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: wasteAnalysis
    });
  } catch (error) {
    next(error);
  }
};

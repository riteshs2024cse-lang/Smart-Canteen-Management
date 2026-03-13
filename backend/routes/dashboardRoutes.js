const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getWasteAnalysis
} = require('../controllers/dashboardController');
const predictionService = require('../services/predictionService');

// Dashboard routes
router.get('/', getDashboardStats);
router.get('/waste-analysis', getWasteAnalysis);

// Prediction route
router.get('/predict-demand', async (req, res, next) => {
  try {
    const prediction = await predictionService.predictDemand();
    res.status(200).json({
      success: true,
      data: prediction
    });
  } catch (error) {
    next(error);
  }
});

// Weekly trends route
router.get('/weekly-trends', async (req, res, next) => {
  try {
    const trends = await predictionService.getWeeklyTrends();
    res.status(200).json({
      success: true,
      data: trends
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

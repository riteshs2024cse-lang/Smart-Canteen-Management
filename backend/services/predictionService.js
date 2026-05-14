const FoodLog = require('../models/FoodLog');

// Configuration for AI model API
const AI_API_URL = process.env.AI_API_URL || 'http://localhost:5001';
const USE_AI_MODEL = process.env.USE_AI_MODEL !== 'false'; // Default: enabled

/**
 * Call Python AI model for demand prediction
 * @param {Object} itemsData - Formatted data for AI model
 * @returns {Promise<Object|null>} AI prediction results or null if failed
 */
async function callAIModel(itemsData) {
  try {
    // Dynamic import for node-fetch (ESM module)
    const fetch = (await import('node-fetch')).default;
    
    console.log(`🤖 Calling AI Model at ${AI_API_URL}/predict-demand...`);
    
    const response = await fetch(`${AI_API_URL}/predict-demand`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: itemsData }),
      timeout: 10000
    });

    if (!response.ok) {
      throw new Error(`AI API responded with status ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ AI Model prediction successful');
      return {
        method: 'AI Model (RandomForest)',
        expectedDiners: data.expected_diners,
        recommendedFoodQuantity: data.recommended_food_quantity,
        totalPredictedConsumption: data.total_predicted_consumption,
        wasteRiskScore: data.waste_risk_score,
        predictionDate: data.prediction_date,
        forDate: data.for_date,
        foodItemPredictions: Object.values(data.items).map(item => ({
          foodItem: item.food_item,
          predictedConsumption: item.predicted_consumption,
          recommendedQty: item.recommended_quantity,
          wasteRisk: item.waste_risk_score,
          confidence: item.confidence
        })),
        aiEnabled: true
      };
    } else {
      throw new Error('AI prediction returned unsuccessful response');
    }
  } catch (error) {
    console.error('❌ AI Model Error:', error.message);
    console.log('   Falling back to statistical method...');
    return null;
  }
}

function parseTargetDate(dateInput) {
  if (dateInput) {
    const parsed = new Date(dateInput);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  const fallback = new Date();
  fallback.setDate(fallback.getDate() + 1);
  return fallback;
}

/**
 * Prepare data from MongoDB for AI model
 * @param {Array} logs - Food logs from database
 * @returns {Object} Formatted data for AI model
 */
function formatDataForAI(logs, targetDate) {
  const itemsData = {};
  const predictionDate = targetDate || parseTargetDate();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = dayNames[predictionDate.getDay()];

  // Group logs by food item
  const itemLogs = {};
  logs.forEach(log => {
    if (!itemLogs[log.foodItem]) {
      itemLogs[log.foodItem] = [];
    }
    itemLogs[log.foodItem].push(log);
  });

  // Format data for each food item
  Object.keys(itemLogs).forEach(foodItem => {
    const itemLogsArray = itemLogs[foodItem].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Get last 7 days of consumption
    const recentConsumption = itemLogsArray.slice(-7).map(log => log.consumedQty);
    
    // Calculate averages
    const totalPrepared = itemLogsArray.reduce((sum, log) => sum + log.preparedQty, 0);
    const totalWasted = itemLogsArray.reduce((sum, log) => sum + log.wastedQty, 0);
    const totalConsumed = itemLogsArray.reduce((sum, log) => sum + log.consumedQty, 0);
    
    const avgPrepared = totalPrepared / itemLogsArray.length;
    const avgWasteRatio = totalPrepared > 0 ? totalWasted / totalPrepared : 0.1;
    
    // Calculate day-of-week average
    const targetDayNum = predictionDate.getDay();
    const sameDayLogs = itemLogsArray.filter(log => new Date(log.date).getDay() === targetDayNum);
    const dayAvg = sameDayLogs.length > 0
      ? sameDayLogs.reduce((sum, log) => sum + log.consumedQty, 0) / sameDayLogs.length
      : totalConsumed / itemLogsArray.length;

    itemsData[foodItem] = {
      recent_consumption: recentConsumption,
      day_of_week: dayOfWeek,
      avg_prepared: Math.round(avgPrepared),
      avg_waste_ratio: avgWasteRatio,
      day_avg: Math.round(dayAvg)
    };
  });

  return itemsData;
}

/**
 * Statistical fallback prediction method
 * @param {Array} logs - Food logs from database
 * @returns {Object} Statistical prediction results
 */
async function statisticalPrediction(logs, targetDate) {
  // Calculate daily consumption statistics
  const dailyStats = {};
  const dayOfWeekStats = {
    0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
  };

  logs.forEach(log => {
    const dateKey = log.date.toISOString().split('T')[0];
    const dayOfWeek = new Date(log.date).getDay();

    if (!dailyStats[dateKey]) {
      dailyStats[dateKey] = {
        totalConsumed: 0,
        totalPrepared: 0,
        totalWasted: 0
      };
    }

    dailyStats[dateKey].totalConsumed += log.consumedQty;
    dailyStats[dateKey].totalPrepared += log.preparedQty;
    dailyStats[dateKey].totalWasted += log.wastedQty;
    dayOfWeekStats[dayOfWeek].push(log.consumedQty);
  });

  // Calculate averages
  const dailyConsumption = Object.values(dailyStats).map(day => day.totalConsumed);
  const avgDailyConsumption = dailyConsumption.reduce((a, b) => a + b, 0) / dailyConsumption.length;

  // Predict for selected target date (defaults to tomorrow)
  const predictionDate = targetDate || parseTargetDate();
  const targetDayOfWeek = predictionDate.getDay();

  const targetDayData = dayOfWeekStats[targetDayOfWeek];
  const avgForTargetDay = targetDayData.length > 0
    ? targetDayData.reduce((a, b) => a + b, 0) / targetDayData.length
    : avgDailyConsumption;

  // Find peak day
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayAverages = Object.keys(dayOfWeekStats).map(day => ({
    day: dayNames[day],
    avg: dayOfWeekStats[day].length > 0
      ? dayOfWeekStats[day].reduce((a, b) => a + b, 0) / dayOfWeekStats[day].length
      : 0
  }));
  
  const peakDay = dayAverages.reduce((max, day) => day.avg > max.avg ? day : max, dayAverages[0]);

  const expectedDiners = Math.round(avgForTargetDay);
  const recommendedFoodQuantity = Math.round(avgForTargetDay * 1.1);
  const confidence = Math.min(95, (logs.length / 30) * 100);
  const avgWastePercentage = calculateAvgWastePercentage(dailyStats);
  const wasteRiskScore = Math.max(0, Math.min(1, avgWastePercentage / 100));

  // Food item specific predictions from current log set
  const groupedItems = logs.reduce((acc, log) => {
    if (!acc[log.foodItem]) {
      acc[log.foodItem] = {
        totalConsumed: 0,
        totalWasted: 0,
        count: 0
      };
    }

    acc[log.foodItem].totalConsumed += log.consumedQty;
    acc[log.foodItem].totalWasted += log.wastedQty;
    acc[log.foodItem].count += 1;
    return acc;
  }, {});

  const foodItemPredictions = Object.entries(groupedItems)
    .map(([foodItem, itemStats]) => {
      const avgConsumed = itemStats.totalConsumed / itemStats.count;
      const avgWasted = itemStats.totalWasted / itemStats.count;
      const wasteRisk = avgConsumed > 0 ? Math.min(1, avgWasted / avgConsumed) : 0;

      return {
        foodItem,
        recommendedQty: Math.round(avgConsumed * 1.1),
        predictedConsumption: Math.round(avgConsumed * 100) / 100,
        avgWasted: Math.round(avgWasted * 100) / 100,
        wasteRisk: Math.round(wasteRisk * 1000) / 1000,
        confidence: 'Medium',
        frequency: itemStats.count
      };
    })
    .sort((a, b) => b.frequency - a.frequency);

  return {
    method: 'Statistical Analysis',
    expectedDiners,
    recommendedFoodQuantity,
    wasteRiskScore,
    peakDayPrediction: peakDay.day,
    confidence: Math.round(confidence),
    avgDailyConsumption: Math.round(avgDailyConsumption),
    tomorrowPrediction: Math.round(avgForTargetDay),
    forDate: predictionDate.toISOString().split('T')[0],
    foodItemPredictions,
    dataPoints: logs.length,
    analysis: {
      totalDaysAnalyzed: Object.keys(dailyStats).length,
      avgWastePercentage
    },
    aiEnabled: false
  };
}

// @desc    Predict demand for next day (AI + Statistical fallback)
exports.predictDemand = async (dateInput) => {
  try {
    const targetDate = parseTargetDate(dateInput);

    // Get data from the last 30 days
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    let logs = await FoodLog.find({
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: -1 });

    // If synthetic/demo data is older than 30 days, use the latest available 30-day window.
    if (logs.length === 0) {
      const latestLog = await FoodLog.findOne().sort({ date: -1 });

      if (latestLog) {
        const latestDate = new Date(latestLog.date);
        const fallbackStart = new Date(latestDate);
        fallbackStart.setDate(fallbackStart.getDate() - 30);

        logs = await FoodLog.find({
          date: { $gte: fallbackStart, $lte: latestDate }
        }).sort({ date: -1 });
      }
    }

    if (logs.length === 0) {
      return {
        method: 'None',
        expectedDiners: 0,
        recommendedFoodQuantity: 0,
        peakDayPrediction: 'No data available',
        confidence: 0,
        message: 'Insufficient data for prediction',
        forDate: targetDate.toISOString().split('T')[0],
        aiEnabled: false
      };
    }

    // Try AI model first if enabled
    if (USE_AI_MODEL) {
      const itemsData = formatDataForAI(logs, targetDate);
      const aiPrediction = await callAIModel(itemsData);
      
      if (aiPrediction) {
        aiPrediction.forDate = targetDate.toISOString().split('T')[0];
        return aiPrediction;
      }
    }

    // Fallback to statistical method
    console.log('📊 Using statistical prediction method');
    return await statisticalPrediction(logs, targetDate);

  } catch (error) {
    console.error('Prediction error:', error);
    throw error;
  }
};

// Helper function to calculate average waste percentage
function calculateAvgWastePercentage(dailyStats) {
  const wastePercentages = Object.values(dailyStats).map(day => {
    if (day.totalPrepared === 0) return 0;
    return (day.totalWasted / day.totalPrepared) * 100;
  });

  if (wastePercentages.length === 0) return 0;

  const avgWaste = wastePercentages.reduce((a, b) => a + b, 0) / wastePercentages.length;
  return Math.round(avgWaste * 100) / 100;
}

// @desc    Get weekly trends for prediction
exports.getWeeklyTrends = async () => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    let weeklyData = await FoodLog.aggregate([
      { $match: { date: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' }
          },
          totalConsumed: { $sum: '$consumedQty' },
          totalPrepared: { $sum: '$preparedQty' },
          totalWasted: { $sum: '$wastedQty' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    if (weeklyData.length === 0) {
      const latestLog = await FoodLog.findOne().sort({ date: -1 });

      if (latestLog) {
        const latestDate = new Date(latestLog.date);
        const fallbackStart = new Date(latestDate);
        fallbackStart.setDate(fallbackStart.getDate() - 30);

        weeklyData = await FoodLog.aggregate([
          { $match: { date: { $gte: fallbackStart, $lte: latestDate } } },
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$date' }
              },
              totalConsumed: { $sum: '$consumedQty' },
              totalPrepared: { $sum: '$preparedQty' },
              totalWasted: { $sum: '$wastedQty' }
            }
          },
          { $sort: { _id: 1 } }
        ]);
      }
    }

    return weeklyData;
  } catch (error) {
    throw error;
  }
};

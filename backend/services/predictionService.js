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

/**
 * Prepare data from MongoDB for AI model
 * @param {Array} logs - Food logs from database
 * @returns {Object} Formatted data for AI model
 */
function formatDataForAI(logs) {
  const itemsData = {};
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = dayNames[tomorrow.getDay()];

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
    const tomorrowDayNum = tomorrow.getDay();
    const sameDayLogs = itemLogsArray.filter(log => new Date(log.date).getDay() === tomorrowDayNum);
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
async function statisticalPrediction(logs) {
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

  // Predict for tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDayOfWeek = tomorrow.getDay();

  const tomorrowDayData = dayOfWeekStats[tomorrowDayOfWeek];
  const avgForTomorrowDay = tomorrowDayData.length > 0
    ? tomorrowDayData.reduce((a, b) => a + b, 0) / tomorrowDayData.length
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

  const expectedDiners = Math.round(avgForTomorrowDay);
  const recommendedFoodQuantity = Math.round(avgForTomorrowDay * 1.1);
  const confidence = Math.min(95, (logs.length / 30) * 100);

  // Food item specific predictions
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const foodItemPredictions = await FoodLog.aggregate([
    { $match: { date: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: '$foodItem',
        avgConsumed: { $avg: '$consumedQty' },
        avgWasted: { $avg: '$wastedQty' },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        foodItem: '$_id',
        _id: 0,
        recommendedQty: {
          $round: [{ $multiply: ['$avgConsumed', 1.1] }, 0]
        },
        avgWasted: { $round: ['$avgWasted', 2] },
        frequency: '$count'
      }
    },
    { $sort: { frequency: -1 } }
  ]);

  return {
    method: 'Statistical Analysis',
    expectedDiners,
    recommendedFoodQuantity,
    peakDayPrediction: peakDay.day,
    confidence: Math.round(confidence),
    avgDailyConsumption: Math.round(avgDailyConsumption),
    tomorrowPrediction: Math.round(avgForTomorrowDay),
    foodItemPredictions,
    dataPoints: logs.length,
    analysis: {
      totalDaysAnalyzed: Object.keys(dailyStats).length,
      avgWastePercentage: calculateAvgWastePercentage(dailyStats)
    },
    aiEnabled: false
  };
}

// @desc    Predict demand for next day (AI + Statistical fallback)
exports.predictDemand = async () => {
  try {
    // Get data from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const logs = await FoodLog.find({
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: -1 });

    if (logs.length === 0) {
      return {
        method: 'None',
        expectedDiners: 0,
        recommendedFoodQuantity: 0,
        peakDayPrediction: 'No data available',
        confidence: 0,
        message: 'Insufficient data for prediction',
        aiEnabled: false
      };
    }

    // Try AI model first if enabled
    if (USE_AI_MODEL) {
      const itemsData = formatDataForAI(logs);
      const aiPrediction = await callAIModel(itemsData);
      
      if (aiPrediction) {
        return aiPrediction;
      }
    }

    // Fallback to statistical method
    console.log('📊 Using statistical prediction method');
    return await statisticalPrediction(logs);

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

    const weeklyData = await FoodLog.aggregate([
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

    return weeklyData;
  } catch (error) {
    throw error;
  }
};

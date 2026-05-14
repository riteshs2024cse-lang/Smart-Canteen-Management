/**
 * API Test Script for Smart Canteen Management System
 * Run this after starting the server with: node backend/server.js
 */

const BASE_URL = 'http://localhost:5000';

// Test configuration
const testData = {
  foodLogs: [
    {
      foodItem: 'Rice',
      preparedQty: 100,
      consumedQty: 85,
      wastedQty: 15,
      date: new Date('2026-03-10')
    },
    {
      foodItem: 'Dal',
      preparedQty: 80,
      consumedQty: 70,
      wastedQty: 10,
      date: new Date('2026-03-10')
    },
    {
      foodItem: 'Chapati',
      preparedQty: 200,
      consumedQty: 180,
      wastedQty: 20,
      date: new Date('2026-03-11')
    },
    {
      foodItem: 'Rice',
      preparedQty: 120,
      consumedQty: 100,
      wastedQty: 20,
      date: new Date('2026-03-11')
    },
    {
      foodItem: 'Sabzi',
      preparedQty: 90,
      consumedQty: 82,
      wastedQty: 8,
      date: new Date('2026-03-12')
    }
  ]
};

async function testAPI() {
  try {
    console.log('🧪 Starting API Tests...\n');

    // Test 1: Check server is running
    console.log('1️⃣  Testing Base Route...');
    const baseResponse = await fetch(`${BASE_URL}/`);
    const baseData = await baseResponse.json();
    console.log('✅ Server is running:', baseData.message);
    console.log('   Available endpoints:', baseData.endpoints);
    console.log();

    // Test 2: Create food logs
    console.log('2️⃣  Creating Food Logs...');
    const createdLogs = [];
    for (const log of testData.foodLogs) {
      const response = await fetch(`${BASE_URL}/api/food-log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log)
      });
      const data = await response.json();
      if (data.success) {
        createdLogs.push(data.data);
        console.log(`✅ Created: ${log.foodItem} (${log.date.toISOString().split('T')[0]})`);
      }
    }
    console.log(`   Total logs created: ${createdLogs.length}`);
    console.log();

    // Test 3: Get all food logs
    console.log('3️⃣  Fetching All Food Logs...');
    const logsResponse = await fetch(`${BASE_URL}/api/food-log`);
    const logsData = await logsResponse.json();
    console.log(`✅ Retrieved ${logsData.count} logs`);
    console.log(`   Total in database: ${logsData.total}`);
    console.log();

    // Test 4: Get food log by ID
    if (createdLogs.length > 0) {
      console.log('4️⃣  Fetching Food Log by ID...');
      const logId = createdLogs[0]._id;
      const logResponse = await fetch(`${BASE_URL}/api/food-log/${logId}`);
      const logData = await logResponse.json();
      console.log(`✅ Retrieved log: ${logData.data.foodItem}`);
      console.log();
    }

    // Test 5: Update food log
    if (createdLogs.length > 0) {
      console.log('5️⃣  Updating Food Log...');
      const logId = createdLogs[0]._id;
      const updateResponse = await fetch(`${BASE_URL}/api/food-log/${logId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consumedQty: 90, wastedQty: 10 })
      });
      const updateData = await updateResponse.json();
      console.log(`✅ Updated: ${updateData.data.foodItem}`);
      console.log(`   New consumed qty: ${updateData.data.consumedQty}`);
      console.log();
    }

    // Test 6: Get dashboard statistics
    console.log('6️⃣  Fetching Dashboard Statistics...');
    const dashResponse = await fetch(`${BASE_URL}/api/dashboard`);
    const dashData = await dashResponse.json();
    console.log('✅ Dashboard Stats:');
    console.log(`   Total Prepared: ${dashData.data.summary.totalPrepared}`);
    console.log(`   Total Consumed: ${dashData.data.summary.totalConsumed}`);
    console.log(`   Total Wasted: ${dashData.data.summary.totalWasted}`);
    console.log(`   Waste Percentage: ${dashData.data.summary.wastePercentage.toFixed(2)}%`);
    console.log(`   Logs Count: ${dashData.data.summary.logsCount}`);
    console.log();

    // Test 7: Get waste analysis
    console.log('7️⃣  Fetching Waste Analysis...');
    const wasteResponse = await fetch(`${BASE_URL}/api/dashboard/waste-analysis`);
    const wasteData = await wasteResponse.json();
    console.log(`✅ Retrieved waste analysis for ${wasteData.data.length} food items`);
    if (wasteData.data.length > 0) {
      console.log(`   Top wasted item: ${wasteData.data[0].foodItem} (${wasteData.data[0].totalWasted} units)`);
    }
    console.log();

    // Test 8: Get demand prediction
    console.log('8️⃣  Fetching AI Demand Prediction...');
    const predResponse = await fetch(`${BASE_URL}/api/predict-demand`);
    const predData = await predResponse.json();
    console.log('✅ Prediction Results:');
    console.log(`   Expected Diners: ${predData.data.expectedDiners}`);
    console.log(`   Recommended Food Quantity: ${predData.data.recommendedFoodQuantity}`);
    console.log(`   Peak Day: ${predData.data.peakDayPrediction}`);
    console.log(`   Confidence: ${predData.data.confidence}%`);
    console.log(`   Data Points: ${predData.data.dataPoints}`);
    console.log();

    // Test 9: Get weekly trends
    console.log('9️⃣  Fetching Weekly Trends...');
    const trendsResponse = await fetch(`${BASE_URL}/api/dashboard/weekly-trends`);
    const trendsData = await trendsResponse.json();
    console.log(`✅ Retrieved trends for ${trendsData.data.length} days`);
    console.log();

    console.log('🎉 All tests completed successfully!\n');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\n⚠️  Make sure the server is running on http://localhost:5000');
  }
}

// Run tests
testAPI();

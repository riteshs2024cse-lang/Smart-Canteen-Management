const axios = require('axios');

console.log('============================================================');
console.log(' Smart Canteen System - Connection Verification');
console.log('============================================================\n');

const tests = [];

// Test 1: Backend Server
async function testBackend() {
  try {
    console.log('[1/5] Testing Backend Server...');
    const response = await axios.get('http://localhost:5000', { timeout: 5000 });
    if (response.data.success) {
      console.log('✅ Backend Server: RUNNING');
      console.log(`   Version: ${response.data.version}`);
      return true;
    } else {
      console.log('❌ Backend Server: UNEXPECTED RESPONSE');
      return false;
    }
  } catch (error) {
    console.log('❌ Backend Server: NOT RUNNING');
    console.log(`   Error: ${error.message}`);
    console.log('   → Start with: npm start');
    return false;
  }
}

// Test 2: AI Server
async function testAIServer() {
  try {
    console.log('\n[2/5] Testing AI Prediction Server...');
    const response = await axios.get('http://localhost:5001', { timeout: 5000 });
    if (response.data.success) {
      console.log('✅ AI Server: RUNNING');
      console.log(`   Status: ${response.data.status}`);
      return true;
    } else {
      console.log('❌ AI Server: UNEXPECTED RESPONSE');
      return false;
    }
  } catch (error) {
    console.log('❌ AI Server: NOT RUNNING');
    console.log(`   Error: ${error.message}`);
    console.log('   → Start with: cd AI-model && python app.py');
    return false;
  }
}

// Test 3: Database Connection
async function testDatabase() {
  try {
    console.log('\n[3/5] Testing MongoDB Connection...');
    const response = await axios.get('http://localhost:5000/api/dashboard', { timeout: 10000 });
    if (response.data.success !== false) {
      console.log('✅ MongoDB: CONNECTED');
      return true;
    } else {
      console.log('❌ MongoDB: CONNECTION FAILED');
      return false;
    }
  } catch (error) {
    console.log('❌ MongoDB: CONNECTION ERROR');
    console.log(`   Error: ${error.message}`);
    console.log('   → Check MONGO_URI in .env file');
    console.log('   → Ensure MongoDB Atlas IP whitelist includes your IP');
    return false;
  }
}

// Test 4: AI Prediction Integration
async function testPrediction() {
  try {
    console.log('\n[4/5] Testing AI Prediction Integration...');
    const response = await axios.get('http://localhost:5000/api/predict-demand', { timeout: 15000 });
    if (response.data.success || response.data.expectedDiners !== undefined) {
      console.log('✅ Prediction API: WORKING');
      console.log(`   Method: ${response.data.method || 'Unknown'}`);
      console.log(`   AI Enabled: ${response.data.aiEnabled ? 'Yes' : 'No (using statistical fallback)'}`);
      return true;
    } else {
      console.log('❌ Prediction API: FAILED');
      return false;
    }
  } catch (error) {
    console.log('❌ Prediction API: ERROR');
    console.log(`   Error: ${error.message}`);
    console.log('   → Ensure AI server is running');
    console.log('   → Check AI_API_URL in .env matches AI server port');
    return false;
  }
}

// Test 5: Frontend Build
async function testFrontend() {
  try {
    console.log('\n[5/5] Checking Frontend Setup...');
    const fs = require('fs');
    const path = require('path');
    
    const frontendEnvExists = fs.existsSync(path.join(__dirname, 'frontend', '.env'));
    const buildExists = fs.existsSync(path.join(__dirname, 'frontend', 'build'));
    const nodeModulesExists = fs.existsSync(path.join(__dirname, 'frontend', 'node_modules'));
    
    if (nodeModulesExists) {
      console.log('✅ Frontend Dependencies: INSTALLED');
    } else {
      console.log('❌ Frontend Dependencies: NOT INSTALLED');
      console.log('   → Run: cd frontend && npm install');
    }
    
    if (frontendEnvExists) {
      console.log('✅ Frontend Config: CONFIGURED');
    } else {
      console.log('⚠️  Frontend Config: MISSING');
      console.log('   → Create frontend/.env with REACT_APP_API_URL=http://localhost:5000/api');
    }
    
    if (buildExists) {
      console.log('✅ Frontend Build: EXISTS (Production ready)');
      return true;
    } else {
      console.log('⚠️  Frontend Build: NOT BUILT');
      console.log('   → Run: cd frontend && npm run build (for production)');
      console.log('   → Or run: cd frontend && npm start (for development)');
      return nodeModulesExists && frontendEnvExists;
    }
  } catch (error) {
    console.log('❌ Frontend Check: ERROR');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  const results = {
    backend: await testBackend(),
    aiServer: await testAIServer(),
    database: await testDatabase(),
    prediction: await testPrediction(),
    frontend: await testFrontend()
  };
  
  console.log('\n============================================================');
  console.log(' Test Summary');
  console.log('============================================================\n');
  
  const passed = Object.values(results).filter(r => r === true).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([name, passed]) => {
    const icon = passed ? '✅' : '❌';
    const label = name.charAt(0).toUpperCase() + name.slice(1);
    console.log(`${icon} ${label.padEnd(20)} ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  console.log('\n============================================================');
  console.log(` Results: ${passed}/${total} tests passed`);
  console.log('============================================================\n');
  
  if (passed === total) {
    console.log('🎉 All systems operational! Your Smart Canteen is ready to use.');
    console.log('\nNext steps:');
    console.log('  1. Access frontend: http://localhost:3000 (dev) or serve the build folder');
    console.log('  2. Test the dashboard and add food logs');
    console.log('  3. Check AI predictions');
  } else {
    console.log('⚠️  Some systems are not operational.');
    console.log('   Review the errors above and fix the issues.');
    console.log('\nCommon fixes:');
    console.log('  • Run: npm start (for backend)');
    console.log('  • Run: cd AI-model && python app.py (for AI server)');
    console.log('  • Check .env file for correct MongoDB URI');
    console.log('  • Run: cd AI-model && python train_model.py (to train model)');
  }
  
  console.log('\n============================================================\n');
}

// Execute with proper error handling
runAllTests().catch(error => {
  console.error('\n❌ Verification failed with error:', error.message);
  process.exit(1);
});

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Import routes
const foodRoutes = require('./routes/foodRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const bookingSettingsRoutes = require('./routes/bookingSettingsRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Base route - serve HTML dashboard
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API info route
app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Smart Canteen Backend API",
    version: "1.0.0",
    endpoints: {
      foodLogs: "/api/food-log",
      dashboard: "/api/dashboard",
      prediction: "/api/predict-demand",
      bookings: "/api/bookings"
    }
  });
});

// API Routes
app.use('/api/food-log', foodRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/booking-settings', bookingSettingsRoutes);

// Demand prediction endpoint
app.get('/api/predict-demand', async (req, res, next) => {
  try {
    const predictionService = require('./services/predictionService');
    const prediction = await predictionService.predictDemand();
    res.status(200).json({
      success: true,
      data: prediction
    });
  } catch (error) {
    next(error);
  }
});

// Error handling middleware (must be last)
app.use(errorHandler);

// MongoDB connection
mongoose.connect(
"mongodb://admin:admin123@ac-sk9nyft-shard-00-00.iicfbwa.mongodb.net:27017,ac-sk9nyft-shard-00-01.iicfbwa.mongodb.net:27017,ac-sk9nyft-shard-00-02.iicfbwa.mongodb.net:27017/?ssl=true&replicaSet=atlas-8qcoji-shard-0&authSource=admin&retryWrites=true&w=majority&appName=smart-canteen-cluster"
)
.then(() => console.log("✅ MongoDB Connected Successfully"))
.catch(err => {
  console.error("❌ MongoDB Connection Error:", err);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Dashboard API: http://localhost:${PORT}/api/dashboard`);
  console.log(`🍽️  Food Log API: http://localhost:${PORT}/api/food-log`);
  console.log(`🤖 Prediction API: http://localhost:${PORT}/api/predict-demand`);
});
# Smart Canteen Management System - Backend

An AI-powered Smart Canteen Management System built with Node.js, Express.js, and MongoDB that helps canteen staff track food preparation, consumption, and waste data while providing intelligent demand predictions.

## 🚀 Features

- **Food Log Management**: Create, read, update, and delete food preparation logs
- **Dashboard Analytics**: Real-time insights on food consumption and waste
- **AI Demand Prediction**: Statistical analysis for next-day food demand forecasting
- **Waste Analysis**: Track and analyze food waste patterns
- **MongoDB Aggregation**: Efficient data processing and analytics

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn package manager

## 🛠️ Installation

1. Clone the repository
```bash
cd Smart-canteen-management
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB connection string

5. Start the server
```bash
# Production
npm start

# Development with nodemon
npm run dev
```

The server will run on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000
```

### 1. Food Log APIs

#### Create Food Log
```http
POST /api/food-log
Content-Type: application/json

{
  "foodItem": "Rice",
  "preparedQty": 100,
  "consumedQty": 85,
  "wastedQty": 15,
  "date": "2026-03-12"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "660a1b2c3d4e5f6g7h8i9j0k",
    "foodItem": "Rice",
    "preparedQty": 100,
    "consumedQty": 85,
    "wastedQty": 15,
    "date": "2026-03-12T00:00:00.000Z",
    "createdAt": "2026-03-12T10:30:00.000Z",
    "updatedAt": "2026-03-12T10:30:00.000Z"
  },
  "message": "Food log created successfully"
}
```

#### Get All Food Logs
```http
GET /api/food-log

# With query parameters
GET /api/food-log?startDate=2026-03-01&endDate=2026-03-12&foodItem=Rice&limit=50&page=1
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5,
  "data": [...]
}
```

#### Get Food Log by ID
```http
GET /api/food-log/:id
```

#### Update Food Log
```http
PUT /api/food-log/:id
Content-Type: application/json

{
  "consumedQty": 90,
  "wastedQty": 10
}
```

#### Delete Food Log
```http
DELETE /api/food-log/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Food log deleted successfully",
  "data": {}
}
```

### 2. Dashboard APIs

#### Get Dashboard Statistics
```http
GET /api/dashboard

# With date filter
GET /api/dashboard?startDate=2026-03-01&endDate=2026-03-12
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalPrepared": 1500,
      "totalConsumed": 1275,
      "totalWasted": 225,
      "logsCount": 45,
      "wastePercentage": 15
    },
    "foodItemBreakdown": [
      {
        "foodItem": "Rice",
        "totalPrepared": 500,
        "totalConsumed": 450,
        "totalWasted": 50,
        "wastePercentage": 10
      }
    ],
    "dailyTrends": [...]
  }
}
```

#### Get Waste Analysis
```http
GET /api/dashboard/waste-analysis
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "foodItem": "Rice",
      "avgWasted": 12.5,
      "maxWasted": 25,
      "minWasted": 5,
      "totalWasted": 150,
      "occurrences": 12
    }
  ]
}
```

#### Get Weekly Trends
```http
GET /api/dashboard/weekly-trends
```

### 3. AI Prediction APIs

#### Predict Demand
```http
GET /api/predict-demand
```

**Response:**
```json
{
  "success": true,
  "data": {
    "expectedDiners": 125,
    "recommendedFoodQuantity": 138,
    "peakDayPrediction": "Friday",
    "confidence": 85,
    "avgDailyConsumption": 115,
    "tomorrowPrediction": 125,
    "foodItemPredictions": [
      {
        "foodItem": "Rice",
        "recommendedQty": 50,
        "avgWasted": 5.5,
        "frequency": 15
      }
    ],
    "dataPoints": 30,
    "analysis": {
      "totalDaysAnalyzed": 25,
      "avgWastePercentage": 12.5
    }
  }
}
```

## 🏗️ Project Structure

```
backend/
│
├── controllers/
│   ├── foodController.js       # Food log CRUD operations
│   └── dashboardController.js  # Dashboard analytics
│
├── models/
│   └── FoodLog.js             # MongoDB schema
│
├── routes/
│   ├── foodRoutes.js          # Food log endpoints
│   └── dashboardRoutes.js     # Dashboard & prediction endpoints
│
├── services/
│   └── predictionService.js   # AI prediction logic
│
├── middleware/
│   └── errorHandler.js        # Centralized error handling
│
└── server.js                  # Express app & MongoDB connection
```

## 🧪 Testing with cURL

### Create a food log
```bash
curl -X POST http://localhost:5000/api/food-log \
  -H "Content-Type: application/json" \
  -d '{
    "foodItem": "Rice",
    "preparedQty": 100,
    "consumedQty": 85,
    "wastedQty": 15
  }'
```

### Get dashboard stats
```bash
curl http://localhost:5000/api/dashboard
```

### Get demand prediction
```bash
curl http://localhost:5000/api/predict-demand
```

## 🎯 Key Features Explained

### 1. Statistical Demand Prediction
- Analyzes last 30 days of food consumption data
- Calculates day-of-week patterns (e.g., Fridays are busier)
- Provides confidence score based on data availability
- Recommends food quantities with 10% buffer to minimize waste

### 2. Dashboard Analytics
- Real-time aggregation using MongoDB pipelines
- Food item breakdown with waste percentages
- Daily trend analysis
- Customizable date range filtering

### 3. Waste Analysis
- Track average, min, max waste per food item
- Identify high-waste items for optimization
- Statistical insights for better planning

## 🔧 Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
```

## 📊 Database Schema

### FoodLog Model
```javascript
{
  foodItem: String,      // Name of food item
  preparedQty: Number,   // Quantity prepared
  consumedQty: Number,   // Quantity consumed
  wastedQty: Number,     // Quantity wasted
  date: Date,            // Log date
  timestamps: true       // createdAt, updatedAt
}
```

## 🚦 Error Handling

All errors are handled centrally and return consistent JSON responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Server Error

## 🤝 Contributing

Contributions are welcome! Please follow the existing code style and MVC architecture.

## 📝 License

ISC

## 👨‍💻 Author

Smart Canteen Management Team

---

**Built with ❤️ using Node.js, Express.js, and MongoDB**

# 🚀 Quick Start Guide - Smart Canteen Management System

## ✅ What Was Built

A complete Node.js backend with the following structure:

```
backend/
├── controllers/
│   ├── foodController.js          ✅ CRUD operations for food logs
│   └── dashboardController.js     ✅ Dashboard analytics & waste analysis
├── models/
│   └── FoodLog.js                 ✅ MongoDB schema with validation
├── routes/
│   ├── foodRoutes.js             ✅ Food logging endpoints
│   └── dashboardRoutes.js        ✅ Dashboard & prediction endpoints
├── services/
│   └── predictionService.js      ✅ AI demand prediction logic
├── middleware/
│   └── errorHandler.js           ✅ Centralized error handling
└── server.js                     ✅ Express app with MongoDB connection

Additional Files:
├── README.md                     ✅ Complete API documentation
├── test-api.js                   ✅ Automated API testing script
├── .env.example                  ✅ Environment variables template
└── package.json                  ✅ Updated with npm scripts
```

## 📦 Installation & Setup

### Step 1: Install Dependencies
```bash
npm install
```

If you need nodemon for development:
```bash
npm install --save-dev nodemon
```

### Step 2: Environment Configuration
Your `.env` file should already be configured with MongoDB connection.
If not, create one based on `.env.example`

### Step 3: Start the Server

**Production Mode:**
```bash
npm start
```

**Development Mode (with auto-reload):**
```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
📊 Dashboard API: http://localhost:5000/api/dashboard
🍽️  Food Log API: http://localhost:5000/api/food-log
🤖 Prediction API: http://localhost:5000/api/predict-demand
```

## 🧪 Testing the API

### Option 1: Automated Test Script
```bash
node test-api.js
```

This will:
- Create sample food logs
- Test all CRUD operations
- Generate dashboard statistics
- Run AI predictions
- Display comprehensive results

### Option 2: Manual Testing with cURL

**1. Create a food log:**
```bash
curl -X POST http://localhost:5000/api/food-log ^
  -H "Content-Type: application/json" ^
  -d "{\"foodItem\":\"Rice\",\"preparedQty\":100,\"consumedQty\":85,\"wastedQty\":15}"
```

**2. Get all logs:**
```bash
curl http://localhost:5000/api/food-log
```

**3. Get dashboard:**
```bash
curl http://localhost:5000/api/dashboard
```

**4. Get AI prediction:**
```bash
curl http://localhost:5000/api/predict-demand
```

### Option 3: Using Postman or Thunder Client
Import the following endpoints:

**Base URL:** `http://localhost:5000`

**Endpoints:**
- `POST /api/food-log` - Create food log
- `GET /api/food-log` - Get all logs
- `GET /api/food-log/:id` - Get specific log
- `PUT /api/food-log/:id` - Update log
- `DELETE /api/food-log/:id` - Delete log
- `GET /api/dashboard` - Dashboard stats
- `GET /api/dashboard/waste-analysis` - Waste analysis
- `GET /api/predict-demand` - AI prediction

## 📊 API Endpoints Summary

### Food Log Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/food-log` | Create new food log |
| GET | `/api/food-log` | Get all food logs (with filters) |
| GET | `/api/food-log/:id` | Get specific log by ID |
| PUT | `/api/food-log/:id` | Update existing log |
| DELETE | `/api/food-log/:id` | Delete a log |

### Dashboard & Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Complete dashboard statistics |
| GET | `/api/dashboard/waste-analysis` | Detailed waste analysis |
| GET | `/api/dashboard/weekly-trends` | Last 7 days trends |

### AI Predictions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/predict-demand` | AI-powered demand prediction |

## 🎯 Key Features Implemented

### 1. Food Logging System
- ✅ Complete CRUD operations
- ✅ Input validation
- ✅ Date-based filtering
- ✅ Pagination support
- ✅ Search by food item

### 2. Dashboard Analytics
- ✅ Total prepared/consumed/wasted quantities
- ✅ Waste percentage calculation
- ✅ Food item breakdown
- ✅ Daily trends (last 30 days)
- ✅ MongoDB aggregation pipelines

### 3. AI Demand Prediction
- ✅ Statistical analysis of historical data
- ✅ Day-of-week pattern recognition
- ✅ Expected diners calculation
- ✅ Recommended food quantities
- ✅ Peak day prediction
- ✅ Confidence scoring
- ✅ Food-item-specific predictions

### 4. Waste Analysis
- ✅ Average waste per food item
- ✅ Min/max waste tracking
- ✅ Occurrence frequency
- ✅ Waste percentage trends

### 5. Error Handling & Security
- ✅ Centralized error middleware
- ✅ MongoDB error handling
- ✅ Input validation
- ✅ CORS enabled
- ✅ Environment variable support

## 📝 Sample Request/Response

### Create Food Log Request:
```json
POST /api/food-log
{
  "foodItem": "Rice",
  "preparedQty": 100,
  "consumedQty": 85,
  "wastedQty": 15,
  "date": "2026-03-12"
}
```

### Dashboard Response Example:
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
    "foodItemBreakdown": [...],
    "dailyTrends": [...]
  }
}
```

### AI Prediction Response Example:
```json
{
  "success": true,
  "data": {
    "expectedDiners": 125,
    "recommendedFoodQuantity": 138,
    "peakDayPrediction": "Friday",
    "confidence": 85,
    "foodItemPredictions": [...]
  }
}
```

## 🔧 Troubleshooting

### Server won't start
- Check MongoDB connection string in `.env`
- Ensure MongoDB Atlas allowed IP addresses
- Verify port 5000 is not in use

### Cannot create logs
- Check request body format
- Ensure all required fields are provided
- Verify MongoDB connection is active

### Prediction returns no data
- Add at least 5-10 food logs first
- Ensure logs have dates within last 30 days
- Check MongoDB connection

## 📚 Next Steps

1. **Frontend Integration**: Connect React/Vue/Angular frontend
2. **Authentication**: Add JWT-based user authentication
3. **Real-time Updates**: Implement WebSocket for live dashboard
4. **Advanced AI**: Integrate ML models for better predictions
5. **Reports**: Generate PDF/Excel reports
6. **Notifications**: Email/SMS alerts for high waste

## 🎉 You're Ready to Go!

Your Smart Canteen Management System backend is fully operational. Start the server and begin testing the APIs!

For detailed API documentation, see [README.md](README.md)

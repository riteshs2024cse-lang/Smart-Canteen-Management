# 🚀 Quick Start Guide - Smart Canteen Management System

## Complete Full-Stack System with React UI

This guide will help you get the complete system running in minutes with the beautiful eco-friendly dashboard!

---

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- ✅ **Python** (v3.8 or higher) - [Download](https://www.python.org/)
- ✅ **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/)
- ✅ **Git** (optional) - [Download](https://git-scm.com/)

---

## 🎯 One-Click Startup (Windows)

### Option 1: Automated Startup Script

```bash
# Simply run this command:
start-all.bat
```

This will:
1. Install all backend dependencies
2. Install all frontend dependencies  
3. Install Python AI model dependencies
4. Start MongoDB
5. Start Backend Server (port 5000)
6. Start AI Model Server (port 5001)
7. Start React Frontend (port 3000)
8. Open browser automatically

---

## 📦 Manual Installation

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Step 3: Install AI Model Dependencies

```bash
cd ai-model
pip install -r requirements.txt
```

### Step 4: Configure Environment

Create `.env` file in the `backend` folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-canteen
AI_API_URL=http://localhost:5001
USE_AI_MODEL=true
```

---

## ▶️ Starting the System

### Terminal 1: Start MongoDB

```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

### Terminal 2: Start Backend Server

```bash
cd backend
node server.js
```

Expected output:
```
✓ Server running on port 5000
✓ MongoDB connected successfully
```

### Terminal 3: Start AI Model Server

```bash
cd ai-model
python app.py
```

Expected output:
```
✓ AI Model loaded successfully
✓ Running on http://localhost:5001
```

### Terminal 4: Start React Frontend

```bash
cd frontend
npm start
```

Expected output:
```
Compiled successfully!
Local: http://localhost:3000
```

---

## 🌐 Access the Application

Once all services are running:

- **React Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **AI Model API**: http://localhost:5001

The browser will automatically open the React dashboard!

---

## 🎨 Dashboard Features

### 1. **Dashboard Overview** (`/dashboard`)
- Real-time statistics cards
- Weekly trends chart
- Food item breakdown
- Eco-friendly metrics

### 2. **Food Logs** (`/food-logs`)
- Add/edit/delete food logs
- Search and filter
- Waste percentage tracking
- Beautiful modal forms

### 3. **AI Predictions** (`/predictions`)
- ML-powered demand forecasting
- Confidence levels
- Waste risk indicators
- Historical trends comparison

### 4. **Analytics** (`/analytics`)
- Comprehensive charts (Bar, Line, Pie)
- Waste distribution analysis
- Weekly trends visualization
- Export data to CSV

---

## 🧪 Testing the System

### 1. Add Sample Food Log

```bash
# Using cURL
curl -X POST http://localhost:5000/api/food-logs \
  -H "Content-Type: application/json" \
  -d '{
    "foodItem": "Rice",
    "preparedQty": 50,
    "consumedQty": 42,
    "wastedQty": 8,
    "date": "2024-01-15"
  }'
```

### 2. Get AI Prediction

```bash
curl "http://localhost:5000/api/dashboard/prediction?date=2024-01-16"
```

### 3. View Dashboard Stats

```bash
curl http://localhost:5000/api/dashboard/stats
```

---

## 🎨 UI Theme Colors

The dashboard uses an eco-friendly green theme:

- **Primary**: `#10b981` (Green)
- **Background**: Linear gradient from `#f0fdf4` to `#dcfce7`
- **Success**: `#059669`
- **Warning**: `#f59e0b`
- **Danger**: `#ef4444`

---

## 📱 Responsive Design

The UI is fully responsive and works on:
- 💻 Desktop (1200px+)
- 📱 Tablet (768px - 1199px)
- 📱 Mobile (< 768px)

---

## 🔧 Troubleshooting

### MongoDB Connection Error

```bash
# Check if MongoDB is running
mongosh

# If not, start it:
net start MongoDB  # Windows
sudo systemctl start mongod  # Linux
```

### Port Already in Use

```bash
# Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in .env file
PORT=5001
```

### AI Model Not Loading

```bash
# Train the model first
cd ai-model
python train_model.py

# Then start the server
python app.py
```

### React Build Errors

```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

---

## 📊 System Architecture

```
┌─────────────────┐
│  React Frontend │ (Port 3000)
│   Axios API     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Node.js Backend│ (Port 5000)
│  Express + MVC  │
└────┬────────┬───┘
     │        │
     ▼        ▼
┌─────────┐ ┌──────────────┐
│ MongoDB │ │ Python Flask │ (Port 5001)
│ Database│ │  AI Model    │
└─────────┘ └──────────────┘
```

---

## 🚀 Next Steps

1. **Add More Data**: Use the Food Logs page to add historical data
2. **Train AI Model**: Run `python train_model.py` with more data
3. **View Predictions**: Check AI Predictions page for demand forecasting
4. **Analyze Trends**: Use Analytics page for insights
5. **Export Reports**: Download CSV reports from Analytics

---

## 🌟 Features Overview

| Feature | Backend | Frontend | AI Model |
|---------|---------|----------|----------|
| Food Log Management | ✅ | ✅ | - |
| Dashboard Stats | ✅ | ✅ | - |
| Waste Analysis | ✅ | ✅ | - |
| AI Predictions | ✅ | ✅ | ✅ |
| Charts & Visualization | - | ✅ | - |
| CSV Export | - | ✅ | - |
| Responsive Design | - | ✅ | - |

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the console logs in each terminal
3. Ensure all dependencies are installed correctly

---

## 🎉 You're All Set!

Your complete Smart Canteen Management System with beautiful React UI is now running!

Visit **http://localhost:3000** to see your eco-friendly dashboard in action! 🌱

---

**Built with ❤️ using:**
- React 18.2.0
- Node.js + Express.js
- Python + Flask + Scikit-learn
- MongoDB
- Recharts for beautiful visualizations

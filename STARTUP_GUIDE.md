# 🚀 Smart Canteen Management — Local Startup Guide

## Services & Ports

| Service | Port | Command | Status |
|---------|------|---------|--------|
| **Backend (Express)** | 5000 | `npm --prefix backend start` | Starting... |
| **Frontend (React)** | 3000 | `npm --prefix frontend start` | Starting... |
| **AI Model (Flask)** | 5001 | `cd ai-model && python app.py` | Starting... |

---

## 🔧 Prerequisites Status

✅ **Node.js**: v11.6.2  
✅ **npm**: v11.6.2  
✅ **Python**: 3.14.2  
✅ **Frontend dependencies**: installed  
✅ **Backend dependencies**: installed  
✅ **Python packages**: installed (pandas, numpy, scikit-learn, Flask, etc.)  

---

## 📋 Startup Instructions

### **Terminal 1: Backend Server**
```bash
cd smart-canteen-management
npm --prefix backend start
```
Access: http://localhost:5000

### **Terminal 2: Frontend React App**
```bash
cd smart-canteen-management
npm --prefix frontend start
```
Access: http://localhost:3000

### **Terminal 3: AI Model Server**
```bash
cd smart-canteen-management/ai-model
python app.py
```
Access: http://localhost:5001

---

## 📝 Environment Setup

Create `.env` file in backend folder with:
```
MONGO_URI=mongodb://localhost:27017/smart-canteen
JWT_SECRET=your-secret-key
NODE_ENV=development
```

Create `.env` file in frontend folder with:
```
REACT_APP_API_BASE_URL=http://localhost:5000
```

---

## ✅ Access Points

Once all services are running:
- **Frontend UI**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **AI API**: http://localhost:5001

---

## 🐛 Troubleshooting

- **Port already in use**: Change port in respective config files
- **MongoDB not running**: Install MongoDB or use MongoDB Atlas
- **Python dependencies missing**: Run `py -m pip install pandas numpy scikit-learn joblib Flask Flask-Cors`
- **Frontend errors**: Run `cd frontend && npm install` again

---

Generated: 2026-05-14

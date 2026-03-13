# 📋 Smart Canteen - Pre-Deployment Checklist

## ✅ Before You Deploy

Use this checklist to ensure everything is ready for deployment.

---

## 🔧 Environment Setup

### 1. Required Software
- [ ] Node.js v14+ installed (`node --version`)
- [ ] Python 3.8+ installed (`python --version` or `python3 --version`)
- [ ] Git installed (optional) (`git --version`)
- [ ] MongoDB Atlas account created OR local MongoDB running

### 2. Project Files
- [ ] Project downloaded/cloned
- [ ] Navigate to project directory
- [ ] All project files present

---

## 📦 Installation

### 3. Backend Setup
- [ ] Run `npm install` in root directory
- [ ] Check for any installation errors
- [ ] `.env` file created in root
- [ ] MongoDB connection string added to `.env`

### 4. Frontend Setup
- [ ] Run `cd frontend && npm install`
- [ ] Check for any installation errors
- [ ] `frontend/.env` file created
- [ ] API URL configured in `frontend/.env`

### 5. Python/AI Setup
- [ ] Python virtual environment created (`.venv` folder exists)
- [ ] Virtual environment activated
- [ ] Run `pip install -r AI-model/requirements.txt`
- [ ] All Python packages installed successfully

---

## 🤖 AI Model

### 6. Training Data
- [ ] `AI-model/data/food_logs.csv` file exists
- [ ] File contains valid data (check first few rows)
- [ ] Data covers at least 7 days

### 7. Model Training
- [ ] Run `cd AI-model && python train_model.py`
- [ ] Training completed without errors
- [ ] `AI-model/models/demand_model.pkl` file created
- [ ] Model metadata file created

---

## ⚙️ Configuration

### 8. Backend Configuration (.env)
```env
PORT=5000
NODE_ENV=production
MONGO_URI=<your-mongodb-connection-string>
AI_API_URL=http://localhost:5001
USE_AI_MODEL=true
```
- [ ] All variables present
- [ ] MongoDB URI is correct
- [ ] Ports don't conflict with other services

### 9. Frontend Configuration (frontend/.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```
- [ ] Variable present
- [ ] URL matches backend port

### 10. MongoDB Setup
- [ ] Database connection string obtained
- [ ] IP address whitelisted (0.0.0.0/0 for testing, specific IP for production)
- [ ] Database user created with read/write permissions
- [ ] Connection tested

---

## 🧪 Testing

### 11. Service Tests (Before Starting All Services)
- [ ] Backend dependencies installed
- [ ] AI model trained
- [ ] Configuration files ready

### 12. Start Services
```batch
# Windows
start_all.bat

# Linux/Mac
./start_all.sh
```
- [ ] AI Server started on port 5001
- [ ] Backend started on port 5000
- [ ] No startup errors in console

### 13. Verification Tests
Run: `npm run verify`

- [ ] Backend server responding (http://localhost:5000)
- [ ] AI server responding (http://localhost:5001)
- [ ] MongoDB connection working
- [ ] Prediction API working
- [ ] Frontend dependencies installed

### 14. Manual API Tests
- [ ] http://localhost:5000 returns success
- [ ] http://localhost:5001 returns success
- [ ] http://localhost:5000/api/dashboard returns data
- [ ] http://localhost:5000/api/predict-demand returns predictions

### 15. Frontend Test
- [ ] Run `cd frontend && npm start`
- [ ] Frontend opens at http://localhost:3000
- [ ] No console errors
- [ ] Can navigate between pages
- [ ] Can see dashboard
- [ ] API calls working

---

## 🚀 Production Build

### 16. Frontend Production Build
- [ ] Run `cd frontend && npm run build`
- [ ] Build completes without errors
- [ ] `frontend/build` directory created
- [ ] Build folder contains index.html and assets

---

## 🔒 Security

### 17. Security Checks (Production)
- [ ] `.env` files NOT committed to git
- [ ] `.gitignore` includes `.env` files
- [ ] Strong MongoDB password
- [ ] IP whitelist configured (not 0.0.0.0/0 in production)
- [ ] HTTPS configured (production deployment)

---

## 📊 Functionality Tests

### 18. Core Features
- [ ] Dashboard loads and displays stats
- [ ] Can create food logs
- [ ] Can view food logs
- [ ] Can edit food logs
- [ ] Can delete food logs
- [ ] Predictions page shows forecasts
- [ ] Analytics page displays charts
- [ ] All charts render correctly

---

## 🌐 Deployment Ready

### 19. Final Checks
- [ ] All services start without errors
- [ ] All API endpoints responding
- [ ] Frontend communicates with backend
- [ ] AI predictions working
- [ ] No console errors
- [ ] Mobile responsiveness checked
- [ ] All navigation working

### 20. Documentation
- [ ] README.md reviewed
- [ ] DEPLOYMENT_GUIDE.md reviewed
- [ ] Know how to start/stop services
- [ ] Know troubleshooting steps

---

## 🎯 Deployment Methods

Choose your deployment method:

### Option A: Development Server
```batch
# Terminal 1: AI Server
cd AI-model && python app.py

# Terminal 2: Backend
npm start

# Terminal 3: Frontend
cd frontend && npm start
```
- [ ] All services running
- [ ] Access at http://localhost:3000

### Option B: Production (Local)
```batch
# Windows
deploy.bat
start_production.bat

# Linux/Mac
./deploy.sh
./start_production.sh
```
- [ ] All services running
- [ ] Frontend built and served

### Option C: Cloud Deployment
- [ ] Choose platform (Heroku, AWS, Azure, etc.)
- [ ] Configure environment variables
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Configure custom domain (optional)
- [ ] Setup SSL certificate

---

## ✅ Post-Deployment

### 21. Monitoring
- [ ] Check logs for errors
- [ ] Monitor system performance
- [ ] Test all features in production
- [ ] Verify database operations
- [ ] Check prediction accuracy

### 22. Backup
- [ ] Database backup configured
- [ ] Regular backup schedule set
- [ ] Backup restoration tested

---

## 🆘 Troubleshooting Reference

### Common Issues:

**Services won't start:**
- Check port availability
- Verify all dependencies installed
- Check .env configuration

**MongoDB connection fails:**
- Verify connection string
- Check IP whitelist
- Ensure network connectivity

**AI predictions fail:**
- Ensure model is trained
- Check AI server is running
- Verify AI_API_URL is correct

**Frontend can't connect:**
- Check REACT_APP_API_URL
- Verify backend is running
- Check CORS configuration

---

## 📞 Quick Commands

```batch
# Verify everything
npm run verify

# Test API
npm test

# Start everything (dev mode)
npm start

# Build frontend
npm run frontend:build

# Check logs
# (varies by platform)
```

---

## 🎉 Ready to Deploy!

If all items are checked, your Smart Canteen Management System is ready for deployment!

### Final Command:
```batch
# Windows
start_production.bat

# Linux/Mac  
./start_production.sh
```

### Access Points:
- **Backend API:** http://localhost:5000
- **AI Server:** http://localhost:5001
- **Frontend:** http://localhost:3000 (dev) or serve build folder (production)

---

**Last Updated:** March 12, 2026
**Version:** 1.0.0

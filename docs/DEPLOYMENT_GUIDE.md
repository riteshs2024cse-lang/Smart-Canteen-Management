# 🚀 Smart Canteen Management System - Complete Deployment Guide

## 📋 Table of Contents
1. [System Requirements](#system-requirements)
2. [Quick Start (Windows)](#quick-start-windows)
3. [Quick Start (Linux/Mac)](#quick-start-linuxmac)
4. [Manual Deployment](#manual-deployment)
5. [Configuration](#configuration)
6. [Verification](#verification)
7. [Troubleshooting](#troubleshooting)
8. [Production Deployment](#production-deployment)

---

## 🖥️ System Requirements

### Minimum Requirements:
- **Node.js**: v14.0 or higher
- **Python**: 3.8 or higher
- **MongoDB**: Atlas account (free tier works) or local installation
- **RAM**: 4GB minimum
- **Storage**: 1GB free space

### Software to Install:
1. **Node.js** - [Download](https://nodejs.org/)
2. **Python** - [Download](https://www.python.org/downloads/)
3. **Git** (optional) - [Download](https://git-scm.com/)

---

## 🚀 Quick Start (Windows)

### Option 1: Automated Deployment (Recommended)
```batch
# Run the deployment script
deploy.bat

# Start the application
start_production.bat
```

### Option 2: Development Mode
```batch
# Install dependencies and setup
deploy.bat

# Start in development mode
start_all.bat
```

That's it! The system will be running at:
- Backend API: http://localhost:5000
- AI Server: http://localhost:5001
- Frontend: http://localhost:3000 (dev mode)

---

## 🐧 Quick Start (Linux/Mac)

### Option 1: Automated Deployment (Recommended)
```bash
# Make scripts executable
chmod +x deploy.sh start_production.sh

# Run deployment
./deploy.sh

# Start the application
./start_production.sh
```

### Option 2: Development Mode
```bash
# Make scripts executable
chmod +x deploy.sh

# Deploy
./deploy.sh

# Start development mode
./start_all.sh
```

---

## 🔧 Manual Deployment

If automated scripts don't work, follow these steps:

### Step 1: Install Node.js Dependencies

```bash
# Backend dependencies
npm install

# Frontend dependencies
cd frontend
npm install
cd ..
```

### Step 2: Setup Python Environment

**Windows:**
```batch
python -m venv .venv
.venv\Scripts\activate.bat
cd ai-model
pip install -r requirements.txt
cd ..
```

**Linux/Mac:**
```bash
python3 -m venv .venv
source .venv/bin/activate
cd ai-model
pip install -r requirements.txt
cd ..
```

### Step 3: Configure Environment

Create `.env` file in the root directory:
```env
PORT=5000
NODE_ENV=production
MONGO_URI=your_mongodb_connection_string
AI_API_URL=http://localhost:5001
USE_AI_MODEL=true
```

Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 4: Train AI Model

```bash
cd ai-model
python train_model.py
cd ..
```

### Step 5: Build Frontend (Production)

```bash
cd frontend
npm run build
cd ..
```

### Step 6: Start Services

**Terminal 1 - AI Server:**
```bash
cd ai-model
python app.py
```

**Terminal 2 - Backend:**
```bash
npm start
```

**Terminal 3 - Frontend (Development):**
```bash
cd frontend
npm start
```

---

## ⚙️ Configuration

### MongoDB Setup

1. **Option A: MongoDB Atlas (Recommended for deployment)**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get connection string
   - Update `MONGO_URI` in `.env`

2. **Option B: Local MongoDB**
   ```env
   MONGO_URI=mongodb://localhost:27017/smart-canteen
   ```

### Environment Variables

**Backend (.env):**
```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGO_URI=your_mongodb_connection_string

# AI Configuration
AI_API_URL=http://localhost:5001
USE_AI_MODEL=true
```

**Frontend (frontend/.env):**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## ✅ Verification

### 1. Check Backend
```bash
curl http://localhost:5000
```
Expected response:
```json
{
  "success": true,
  "message": "Smart Canteen Backend Running",
  "version": "1.0.0"
}
```

### 2. Check AI Server
```bash
curl http://localhost:5001
```
Expected response:
```json
{
  "success": true,
  "message": "Smart Canteen AI Prediction API",
  "status": "Model loaded"
}
```

### 3. Test Prediction
```bash
curl http://localhost:5000/api/predict-demand
```

### 4. Access Frontend
Open browser: http://localhost:3000 (dev) or http://localhost:5000 (production)

---

## 🔍 Troubleshooting

### Issue: "Model not found" error

**Solution:**
```bash
cd ai-model
python train_model.py
cd ..
```

### Issue: MongoDB connection failed

**Solutions:**
- Verify MongoDB is running
- Check connection string in `.env`
- Ensure IP is whitelisted in MongoDB Atlas
- Check network/firewall settings

### Issue: Python dependencies fail to install

**Solutions:**
```bash
# Upgrade pip
python -m pip install --upgrade pip

# Install dependencies one at a time
cd ai-model
pip install pandas numpy scikit-learn joblib Flask Flask-Cors
cd ..
```

### Issue: Port already in use

**Solutions:**
- Change PORT in `.env` file
- Kill process using the port:
  
  **Windows:**
  ```batch
  netstat -ano | findstr :5000
  taskkill /PID <process_id> /F
  ```
  
  **Linux/Mac:**
  ```bash
  lsof -i :5000
  kill -9 <process_id>
  ```

### Issue: CORS errors in browser

**Solution:**
- Ensure `REACT_APP_API_URL` is correct in `frontend/.env`
- Verify backend CORS is enabled
- Clear browser cache

### Issue: Frontend build fails

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
cd ..
```

---

## 🌐 Production Deployment

### Deployment Checklist

- [ ] All dependencies installed
- [ ] `.env` files configured correctly
- [ ] MongoDB connection string updated
- [ ] AI model trained
- [ ] Frontend built (`npm run build`)
- [ ] All services tested

### Deployment Options

#### Option 1: Traditional Server

1. **Setup server** (Ubuntu/Debian):
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Python
sudo apt install -y python3 python3-pip python3-venv

# Clone/upload project
git clone <your-repo> smart-canteen
cd smart-canteen
```

2. **Deploy:**
```bash
chmod +x deploy.sh start_production.sh
./deploy.sh
```

3. **Use PM2 for process management:**
```bash
# Install PM2
sudo npm install -g pm2

# Start backend
pm2 start npm --name "canteen-backend" -- start

# Start AI server
cd ai-model
pm2 start app.py --name "canteen-ai" --interpreter python3
cd ..

# Save PM2 config
pm2 save
pm2 startup
```

4. **Setup Nginx reverse proxy:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/smart-canteen/frontend/build;
        try_files $uri /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Option 2: Docker Deployment

Create `Dockerfile` for each service and use `docker-compose.yml`:

```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=${MONGO_URI}
      - AI_API_URL=http://ai-server:5001
    depends_on:
      - ai-server

  ai-server:
    build: ./ai-model
    ports:
      - "5001:5001"
    volumes:
      - ./ai-model/models:/app/models
      - ./ai-model/data:/app/data

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

#### Option 3: Cloud Platforms

**Heroku:**
```bash
# Install Heroku CLI
heroku login
heroku create smart-canteen-app

# Deploy backend
git push heroku main

# Setup MongoDB
heroku addons:create mongolab:sandbox

# Configure env vars
heroku config:set NODE_ENV=production
heroku config:set USE_AI_MODEL=true
```

**AWS / Azure / Google Cloud:**
- Use Elastic Beanstalk / App Service / App Engine
- Configure environment variables
- Setup MongoDB Atlas connection
- Deploy using platform-specific CLI tools

---

## 📊 Performance Optimization

### Backend
- Enable compression
- Use caching (Redis)
- Optimize database queries
- Use connection pooling

### Frontend
- Use production build
- Enable CDN for static assets
- Implement lazy loading
- Optimize images

### AI Model
- Cache predictions
- Batch processing
- Model optimization
- Use GPU if available

---

## 🔒 Security Best Practices

1. **Environment Variables:**
   - Never commit `.env` files
   - Use secrets management tools
   - Rotate credentials regularly

2. **MongoDB:**
   - Use strong passwords
   - Enable IP whitelisting
   - Use SSL/TLS connections
   - Regular backups

3. **API:**
   - Implement rate limiting
   - Add authentication (JWT)
   - Validate all inputs
   - Use HTTPS in production

4. **Frontend:**
   - Sanitize user inputs
   - Implement CSP headers
   - Keep dependencies updated

---

## 📈 Monitoring & Maintenance

### Logs
- Backend: Check console output or log files
- AI Server: `logs/ai-server.log`
- MongoDB: Atlas monitoring dashboard

### Health Checks
```bash
# Backend
curl http://localhost:5000/

# AI Server
curl http://localhost:5001/health
```

### Updates
```bash
# Update dependencies
npm update
cd frontend && npm update && cd ..
pip install --upgrade -r ai-model/requirements.txt

# Retrain model with new data
cd ai-model
python train_model.py
cd ..
```

---

## 🆘 Support

### Common Commands

**Restart Services:**
```batch
# Windows
taskkill /F /IM node.exe
taskkill /F /IM python.exe
start_production.bat
```

```bash
# Linux/Mac
pkill node
pkill python
./start_production.sh
```

**View Logs:**
```bash
# Backend logs
pm2 logs canteen-backend

# AI server logs
pm2 logs canteen-ai
```

**Database Operations:**
```bash
# MongoDB shell
mongosh "your_connection_string"

# Backup
mongodump --uri="your_connection_string"

# Restore
mongorestore --uri="your_connection_string" dump/
```

---

## 📝 Next Steps

1. ✅ Complete deployment
2. ✅ Verify all services running
3. ✅ Test all features
4. 📊 Add sample data
5. 🎨 Customize UI/branding
6. 🔐 Implement authentication
7. 🚀 Deploy to production server
8. 📈 Monitor and optimize

---

## 📞 Quick Reference

| Service | URL | Purpose |
|---------|-----|---------|
| Backend | http://localhost:5000 | Main API server |
| AI Server | http://localhost:5001 | Prediction service |
| Frontend (Dev) | http://localhost:3000 | React development |
| MongoDB Atlas | cloud.mongodb.com | Database |

**Default Ports:**
- Backend: 5000
- AI Server: 5001
- Frontend: 3000

**Important Files:**
- `.env` - Backend configuration
- `frontend/.env` - Frontend configuration
- `ai-model/models/demand_model.pkl` - Trained AI model
- `ai-model/data/food_logs.csv` - Training data

---

## ✅ Deployment Complete!

Your Smart Canteen Management System is now ready for use! 🎉

For any issues or questions, refer to the troubleshooting section above.

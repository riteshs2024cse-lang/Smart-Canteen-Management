@echo off
REM Smart Canteen Management System - Start All Services
REM This script starts both Node.js backend and Python AI server

echo ============================================================
echo  Smart Canteen Management System - Starting Services
echo ============================================================
echo.

REM Check if model is trained
if not exist AI-model\models\demand_model.pkl (
    echo [WARNING] AI model not found!
    echo Please run: cd ai-model ^&^& python train_model.py
    echo.
    echo Starting without AI model (will use statistical fallback)...
    timeout /t 3
)

echo Starting Python AI Server (Port 5001)...
start "Python AI Server" cmd /k "cd ai-model && python app.py"
timeout /t 3

echo Starting Node.js Backend (Port 5000)...
start "Node.js Backend" cmd /k "npm start"
timeout /t 3

echo.
echo ============================================================
echo  Services Started!
echo ============================================================
echo.
echo Python AI Server: http://localhost:5001
echo Node.js Backend:  http://localhost:5000
echo.
echo Dashboard:   http://localhost:5000/api/dashboard
echo Prediction:  http://localhost:5000/api/predict-demand
echo.
echo To test the system:
echo   node test-api.js
echo.
echo To stop services: Close the terminal windows
echo ============================================================
echo.
pause

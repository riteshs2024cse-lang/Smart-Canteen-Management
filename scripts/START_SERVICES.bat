@echo off
echo ========================================
echo   Smart Canteen Management System
echo   Starting All Services
echo ========================================
echo.

REM Start Backend
echo [1/3] Starting Backend Server (Port 5000)...
start "Backend Server" cmd /k "node backend\server.js"
timeout /t 3 /nobreak >nul
echo Backend started!
echo.

REM Start Frontend
echo [2/3] Starting Frontend React App (Port 3000)...
cd frontend
start "Frontend React" cmd /k "npx --yes react-scripts start"
cd ..
timeout /t 3 /nobreak >nul
echo Frontend starting...
echo.

REM AI Service (skip if Python not configured)
echo [3/3] AI Service (Port 5001) - Manual start required
echo.
echo ========================================
echo   SERVICES STARTING
echo ========================================
echo.
echo Backend Server:  http://localhost:5000
echo Frontend UI:     http://localhost:3000
echo.
echo NOTE: Frontend will open automatically in your browser.
echo Wait 20-30 seconds for the React app to compile.
echo.
echo To start AI service manually:
echo   cd ai-model
echo   py -m pip install -r requirements.txt
echo   py app.py
echo.
pause

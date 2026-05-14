@echo off
echo ========================================
echo Smart Canteen Management System
echo Complete Startup Script
echo ========================================
echo.

REM Check if node_modules exists in backend
if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
    echo.
)

REM Check if node_modules exists in frontend  
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
    echo.
)

REM Check MongoDB connection
echo Checking MongoDB connection...
timeout /t 2 /nobreak >nul
echo.

echo ========================================
echo Starting all services...
echo ========================================
echo.

REM Start MongoDB (if not running)
echo Starting MongoDB...
net start MongoDB 2>nul
if %errorlevel% equ 0 (
    echo MongoDB started successfully
) else (
    echo MongoDB is already running or could not be started
)
echo.

REM Start Backend Server
echo Starting Backend Server on port 5000...
start "Backend Server" cmd /k "cd backend && node server.js"
timeout /t 3 /nobreak >nul
echo.

REM Start Python AI Model
echo Starting AI Model Server on port 5001...
start "AI Model Server" cmd /k "cd ai-model && python app.py"
timeout /t 3 /nobreak >nul
echo.

REM Start React Frontend
echo Starting React Frontend on port 3000...
start "React Frontend" cmd /k "cd frontend && npm start"
timeout /t 2 /nobreak >nul
echo.

echo ========================================
echo All Services Started!
echo ========================================
echo.
echo Backend API: http://localhost:5000
echo AI Model API: http://localhost:5001
echo React Frontend: http://localhost:3000
echo.
echo The browser will open automatically in a few seconds...
echo.
echo Press any key to view service status...
pause >nul

echo.
echo ========================================
echo Service Status
echo ========================================
netstat -ano | findstr ":5000" >nul && echo Backend (5000): RUNNING || echo Backend (5000): NOT RUNNING
netstat -ano | findstr ":5001" >nul && echo AI Model (5001): RUNNING || echo AI Model (5001): NOT RUNNING
netstat -ano | findstr ":3000" >nul && echo Frontend (3000): RUNNING || echo Frontend (3000): NOT RUNNING
echo.
echo To stop all services, close all command windows
echo or press Ctrl+C in each window.
echo.
pause

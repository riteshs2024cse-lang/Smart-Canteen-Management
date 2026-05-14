@echo off
REM ============================================================
REM  Smart Canteen Management System - Production Startup
REM ============================================================

echo ============================================================
echo  Smart Canteen Management System - Production Mode
echo ============================================================
echo.

REM Activate Python virtual environment
if exist .venv\Scripts\activate.bat (
    call .venv\Scripts\activate.bat
) else (
    echo WARNING: Virtual environment not found
    echo Please run 'deploy.bat' first
    pause
    exit /b 1
)

REM Check .env file
if not exist .env (
    echo ERROR: .env file not found
    echo Creating from .env.example...
    copy .env.example .env
)

REM Check AI model
if not exist ai-model\models\demand_model.pkl (
    echo WARNING: AI model not found!
    echo Run 'cd ai-model && python train_model.py' to train the model
    echo.
    echo Continuing with statistical fallback...
    timeout /t 3
)

echo Starting services in production mode...
echo.

REM Start Python AI Server
echo [1/2] Starting Python AI Server (Port 5001)...
start "AI Server - Smart Canteen" cmd /k "cd ai-model && python app.py"
timeout /t 3

REM Start Node.js Backend
echo [2/2] Starting Node.js Backend (Port 5000)...
start "Backend - Smart Canteen" cmd /k "set NODE_ENV=production && npm start"
timeout /t 3

echo.
echo ============================================================
echo  Services Started Successfully!
echo ============================================================
echo.
echo Backend API:       http://localhost:5000
echo AI Server:         http://localhost:5001
echo Dashboard API:     http://localhost:5000/api/dashboard
echo Food Logs API:     http://localhost:5000/api/food-log
echo Predictions API:   http://localhost:5000/api/predict-demand
echo.
echo Frontend:          Serve the 'frontend/build' folder with a web server
echo                    or run 'cd frontend && npm start' for dev mode
echo.
echo To stop services: Close the terminal windows
echo ============================================================
echo.

REM Open browser after 5 seconds
timeout /t 5
start http://localhost:5000

pause

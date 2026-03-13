@echo off
echo ============================================================
echo Smart Canteen - Quick System Check
echo ============================================================
echo.

echo Checking file structure...
echo.

REM Check backend
if exist backend\server.js (
    echo [OK] Backend server file found
) else (
    echo [ERROR] Backend server file missing
)

REM Check AI model
if exist AI-model\app.py (
    echo [OK] AI server file found
) else (
    echo [ERROR] AI server file missing
)

if exist AI-model\models\demand_model.pkl (
    echo [OK] AI model trained
) else (
    echo [WARNING] AI model not trained - run: cd AI-model ^&^& python train_model.py
)

REM Check frontend
if exist frontend\package.json (
    echo [OK] Frontend found
) else (
    echo [ERROR] Frontend missing
)

REM Check config
if exist .env (
    echo [OK] Backend .env configured
) else (
    echo [WARNING] Backend .env missing - copied from .env.example
    copy .env.example .env
)

if exist frontend\.env (
    echo [OK] Frontend .env configured
) else (
    echo [WARNING] Frontend .env missing - creating...
    echo REACT_APP_API_URL=http://localhost:5000/api > frontend\.env
)

REM Check dependencies
if exist node_modules (
    echo [OK] Backend dependencies installed
) else (
    echo [WARNING] Backend dependencies not installed - run: npm install
)

if exist frontend\node_modules (
    echo [OK] Frontend dependencies installed
) else (
    echo [WARNING] Frontend dependencies not installed - run: cd frontend ^&^& npm install
)

if exist .venv (
    echo [OK] Python virtual environment created
) else (
    echo [WARNING] Python venv not created - run: python -m venv .venv
)

echo.
echo ============================================================
echo File Structure Check Complete
echo ============================================================
echo.
echo To deploy: run deploy.bat
echo To start: run start_production.bat
echo.
pause

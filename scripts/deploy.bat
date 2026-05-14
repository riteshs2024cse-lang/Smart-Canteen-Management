@echo off
REM ============================================================
REM  Smart Canteen Management System - Production Deployment
REM ============================================================

echo ============================================================
echo  Smart Canteen Management System - Production Deployment
echo ============================================================
echo.

REM Step 1: Install Node.js Dependencies
echo [1/6] Installing Node.js backend dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install Node.js dependencies
    pause
    exit /b 1
)
echo SUCCESS: Node.js dependencies installed
echo.

REM Step 2: Install Frontend Dependencies
echo [2/6] Installing React frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..
echo SUCCESS: Frontend dependencies installed
echo.

REM Step 3: Setup Python Virtual Environment
echo [3/6] Setting up Python virtual environment...
if not exist .venv (
    python -m venv .venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        echo Please ensure Python 3.8+ is installed
        pause
        exit /b 1
    )
)
call .venv\Scripts\activate.bat
echo SUCCESS: Virtual environment activated
echo.

REM Step 4: Install Python Dependencies
echo [4/6] Installing Python AI model dependencies...
cd ai-model
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install Python dependencies
    cd ..
    pause
    exit /b 1
)
cd ..
echo SUCCESS: Python dependencies installed
echo.

REM Step 5: Train AI Model
echo [5/6] Training AI model...
cd ai-model
if not exist models\demand_model.pkl (
    echo Training model for the first time...
    python train_model.py
    if errorlevel 1 (
        echo WARNING: Model training failed
        echo System will use statistical fallback
    ) else (
        echo SUCCESS: AI model trained successfully
    )
) else (
    echo Model already exists. Skipping training...
)
cd ..
echo.

REM Step 6: Build Frontend (Production)
echo [6/6] Building React frontend for production...
cd frontend
call npm run build
if errorlevel 1 (
    echo WARNING: Frontend build failed
    echo You can still run in development mode
    cd ..
) else (
    echo SUCCESS: Frontend built successfully
    cd ..
)
echo.

echo ============================================================
echo  Deployment Complete!
echo ============================================================
echo.
echo Next steps:
echo   1. Ensure MongoDB is accessible (check .env file)
echo   2. Run 'start_production.bat' to start all services
echo   3. Access the application at http://localhost:5000
echo.
echo For development mode, run 'start_all.bat' instead
echo ============================================================
pause

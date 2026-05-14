@echo off
REM Smart Canteen Management System - Complete Installation Script
REM This script installs all dependencies and sets up the complete system

echo ============================================================
echo  Smart Canteen Management System - Installation
echo ============================================================
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Python is installed
where python >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python is not installed!
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

echo [1/4] Installing Node.js dependencies...
echo.
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install Node.js dependencies
    pause
    exit /b 1
)
echo.
echo [OK] Node.js dependencies installed successfully!
echo.

echo [2/4] Installing Python dependencies...
echo.
cd ai-model
call python -m pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install Python dependencies
    cd ..
    pause
    exit /b 1
)
cd ..
echo.
echo [OK] Python dependencies installed successfully!
echo.

echo [3/4] Training AI model (this may take 1-2 minutes)...
echo.
cd AI-model
call python train_model.py
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to train AI model
    cd ..
    pause
    exit /b 1
)
cd ..
echo.
echo [OK] AI model trained successfully!
echo.

echo [4/4] Creating environment file...
echo.
if not exist .env (
    copy .env.example .env
    echo [OK] .env file created from .env.example
    echo Please update MongoDB connection string in .env
) else (
    echo [INFO] .env file already exists
)
echo.

echo ============================================================
echo  Installation Complete!
echo ============================================================
echo.
echo Next steps:
echo.
echo 1. Update MongoDB connection in .env file
echo.
echo 2. Start the system using one of these methods:
echo.
echo    Option A - Start both services:
echo       start_all.bat
echo.
echo    Option B - Start manually:
echo       Terminal 1: cd ai-model ^&^& python app.py
echo       Terminal 2: npm start
echo.
echo 3. Test the system:
echo       node test-api.js
echo.
echo 4. Access the APIs:
echo       Node.js Backend: http://localhost:5000
echo       Python AI API:   http://localhost:5001
echo.
echo ============================================================
pause

#!/bin/bash
# Smart Canteen Management System - Complete Installation Script (Linux/Mac)
# This script installs all dependencies and sets up the complete system

echo "============================================================"
echo " Smart Canteen Management System - Installation"
echo "============================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python is not installed!"
    echo "Please install Python from https://www.python.org/"
    exit 1
fi

echo "[1/4] Installing Node.js dependencies..."
echo ""
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install Node.js dependencies"
    exit 1
fi
echo ""
echo "[OK] Node.js dependencies installed successfully!"
echo ""

echo "[2/4] Installing Python dependencies..."
echo ""
cd ai-model
python3 -m pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install Python dependencies"
    cd ..
    exit 1
fi
cd ..
echo ""
echo "[OK] Python dependencies installed successfully!"
echo ""

echo "[3/4] Training AI model (this may take 1-2 minutes)..."
echo ""
cd ai-model
python3 train_model.py
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to train AI model"
    cd ..
    exit 1
fi
cd ..
echo ""
echo "[OK] AI model trained successfully!"
echo ""

echo "[4/4] Creating environment file..."
echo ""
if [ ! -f .env ]; then
    cp .env.example .env
    echo "[OK] .env file created from .env.example"
    echo "Please update MongoDB connection string in .env"
else
    echo "[INFO] .env file already exists"
fi
echo ""

echo "============================================================"
echo " Installation Complete!"
echo "============================================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Update MongoDB connection in .env file"
echo ""
echo "2. Start the system:"
echo "   Terminal 1: cd ai-model && python3 app.py"
echo "   Terminal 2: npm start"
echo ""
echo "3. Test the system:"
echo "   node test-api.js"
echo ""
echo "4. Access the APIs:"
echo "   Node.js Backend: http://localhost:5000"
echo "   Python AI API:   http://localhost:5001"
echo ""
echo "============================================================"

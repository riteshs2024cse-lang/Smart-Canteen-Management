#!/bin/bash
# ============================================================
#  Smart Canteen Management System - Production Deployment
# ============================================================

echo "============================================================"
echo " Smart Canteen Management System - Production Deployment"
echo "============================================================"
echo ""

# Step 1: Install Node.js Dependencies
echo "[1/6] Installing Node.js backend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install Node.js dependencies"
    exit 1
fi
echo "SUCCESS: Node.js dependencies installed"
echo ""

# Step 2: Install Frontend Dependencies
echo "[2/6] Installing React frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies"
    cd ..
    exit 1
fi
cd ..
echo "SUCCESS: Frontend dependencies installed"
echo ""

# Step 3: Setup Python Virtual Environment
echo "[3/6] Setting up Python virtual environment..."
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to create virtual environment"
        echo "Please ensure Python 3.8+ is installed"
        exit 1
    fi
fi
source .venv/bin/activate
echo "SUCCESS: Virtual environment activated"
echo ""

# Step 4: Install Python Dependencies
echo "[4/6] Installing Python AI model dependencies..."
cd ai-model
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install Python dependencies"
    cd ..
    exit 1
fi
cd ..
echo "SUCCESS: Python dependencies installed"
echo ""

# Step 5: Train AI Model
echo "[5/6] Training AI model..."
cd ai-model
if [ ! -f "models/demand_model.pkl" ]; then
    echo "Training model for the first time..."
    python train_model.py
    if [ $? -ne 0 ]; then
        echo "WARNING: Model training failed"
        echo "System will use statistical fallback"
    else
        echo "SUCCESS: AI model trained successfully"
    fi
else
    echo "Model already exists. Skipping training..."
fi
cd ..
echo ""

# Step 6: Build Frontend (Production)
echo "[6/6] Building React frontend for production..."
cd frontend
npm run build
if [ $? -ne 0 ]; then
    echo "WARNING: Frontend build failed"
    echo "You can still run in development mode"
    cd ..
else
    echo "SUCCESS: Frontend built successfully"
    cd ..
fi
echo ""

# Create .env if not exists
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
fi

echo "============================================================"
echo " Deployment Complete!"
echo "============================================================"
echo ""
echo "Next steps:"
echo "  1. Ensure MongoDB is accessible (check .env file)"
echo "  2. Run './start_production.sh' to start all services"
echo "  3. Access the application at http://localhost:5000"
echo ""
echo "For development mode, run './start_all.sh' instead"
echo "============================================================"

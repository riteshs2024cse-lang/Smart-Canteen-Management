#!/bin/bash
# ============================================================
#  Smart Canteen Management System - Production Startup
# ============================================================

echo "============================================================"
echo " Smart Canteen Management System - Production Mode"
echo "============================================================"
echo ""

# Activate Python virtual environment
if [ -f ".venv/bin/activate" ]; then
    source .venv/bin/activate
else
    echo "WARNING: Virtual environment not found"
    echo "Please run './deploy.sh' first"
    exit 1
fi

# Check .env file
if [ ! -f ".env" ]; then
    echo "ERROR: .env file not found"
    echo "Creating from .env.example..."
    cp .env.example .env
fi

# Check AI model
if [ ! -f "AI-model/models/demand_model.pkl" ]; then
    echo "WARNING: AI model not found!"
    echo "Run 'cd AI-model && python train_model.py' to train the model"
    echo ""
    echo "Continuing with statistical fallback..."
    sleep 3
fi

echo "Starting services in production mode..."
echo ""

# Start Python AI Server
echo "[1/2] Starting Python AI Server (Port 5001)..."
cd AI-model
python app.py > ../logs/ai-server.log 2>&1 &
AI_PID=$!
cd ..
echo "AI Server started (PID: $AI_PID)"
sleep 3

# Start Node.js Backend
echo "[2/2] Starting Node.js Backend (Port 5000)..."
NODE_ENV=production npm start > logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend started (PID: $BACKEND_PID)"
sleep 3

echo ""
echo "============================================================"
echo " Services Started Successfully!"
echo "============================================================"
echo ""
echo "Backend API:       http://localhost:5000"
echo "AI Server:         http://localhost:5001"
echo "Dashboard API:     http://localhost:5000/api/dashboard"
echo "Food Logs API:     http://localhost:5000/api/food-log"
echo "Predictions API:   http://localhost:5000/api/predict-demand"
echo ""
echo "Frontend:          Serve the 'frontend/build' folder with a web server"
echo "                   or run 'cd frontend && npm start' for dev mode"
echo ""
echo "Process IDs:"
echo "  AI Server: $AI_PID"
echo "  Backend:   $BACKEND_PID"
echo ""
echo "Logs:"
echo "  AI Server: logs/ai-server.log"
echo "  Backend:   logs/backend.log"
echo ""
echo "To stop services:"
echo "  kill $AI_PID $BACKEND_PID"
echo "============================================================"
echo ""

# Save PIDs to file for easy stopping
echo $AI_PID > .ai-server.pid
echo $BACKEND_PID > .backend.pid

echo "PIDs saved to .ai-server.pid and .backend.pid"

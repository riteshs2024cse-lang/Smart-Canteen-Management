#!/bin/bash
# Run from repository root. Creates target directories if missing.
set -e
mkdir -p docs scripts ai-model data data/models duplicates_archive/Smart-canteen-management

# Docs
git mv -f WORKING_SOLUTION.md docs/WORKING_SOLUTION.md || true
git mv -f VERCEL_DEPLOYMENT.md docs/VERCEL_DEPLOYMENT.md || true
git mv -f UI_ENHANCEMENTS.md docs/UI_ENHANCEMENTS.md || true
git mv -f UI_COMPONENT_GUIDE.md docs/UI_COMPONENT_GUIDE.md || true
git mv -f START_HERE.md docs/START_HERE.md || true
git mv -f GET_STARTED.md docs/GET_STARTED.md || true
git mv -f COMPLETE_SETUP_GUIDE.md docs/COMPLETE_SETUP_GUIDE.md || true
git mv -f DEPLOYMENT_GUIDE.md docs/DEPLOYMENT_GUIDE.md || true
git mv -f DEPLOYMENT_RECTIFICATION_SUMMARY.md docs/DEPLOYMENT_RECTIFICATION_SUMMARY.md || true
git mv -f FIGMA_UI_IMPLEMENTATION.md docs/FIGMA_UI_IMPLEMENTATION.md || true
git mv -f FILES_CREATED.md docs/FILES_CREATED.md || true
git mv -f QUICK_ACCESS.html docs/QUICK_ACCESS.html || true
git mv -f dashboard.html docs/dashboard.html || true
git mv -f QUICKSTART.md docs/QUICKSTART.md || true
git mv -f PROJECT_SUMMARY.md docs/PROJECT_SUMMARY.md || true
git mv -f PRE_DEPLOYMENT_CHECKLIST.md docs/PRE_DEPLOYMENT_CHECKLIST.md || true
git mv -f PREBOOKING_GUIDE.md docs/PREBOOKING_GUIDE.md || true
git mv -f INSTALLATION_STATUS.md docs/INSTALLATION_STATUS.md || true

# Scripts
git mv -f verify-deployment.js scripts/verify-deployment.js || true
git mv -f test-api.js scripts/test-api.js || true
git mv -f deploy.sh scripts/deploy.sh || true
git mv -f deploy.bat scripts/deploy.bat || true
git mv -f install.sh scripts/install.sh || true
git mv -f install.bat scripts/install.bat || true
git mv -f start_all.bat scripts/start_all.bat || true
git mv -f start-all.bat scripts/start-all.bat || true
git mv -f start_production.sh scripts/start_production.sh || true
git mv -f start_production.bat scripts/start_production.bat || true
git mv -f START_SERVICES.bat scripts/START_SERVICES.bat || true
git mv -f check-system.bat scripts/check-system.bat || true

# AI model -> ai-model and data
git mv -f "AI-model/app.py" ai-model/app.py || true
git mv -f "AI-model/predict.py" ai-model/predict.py || true
git mv -f "AI-model/train_model.py" ai-model/train_model.py || true
git mv -f "AI-model/generate_synthetic_data.py" ai-model/generate_synthetic_data.py || true
git mv -f "AI-model/requirements.txt" ai-model/requirements.txt || true
git mv -f "AI-model/README.md" ai-model/README.md || true
mkdir -p data/models
git mv -f "AI-model/data/food_logs.csv" data/food_logs.csv || true
git mv -f "AI-model/models/demand_model.pkl" data/models/demand_model.pkl || true
git mv -f "AI-model/models/model_metadata.txt" data/models/model_metadata.txt || true

# Frontend (keep in place but ensure folders exist)
mkdir -p frontend/public frontend/src
# Backend (keep in place)
mkdir -p backend/controllers backend/models backend/routes backend/middleware backend/public backend/services

# Archive duplicate mirror
if [ -d "Smart-canteen-management" ]; then
  mkdir -p duplicates_archive/Smart-canteen-management
  git mv -f Smart-canteen-management/* duplicates_archive/Smart-canteen-management/ || true
fi

# Update paths in backend/loadData.js and verify-deployment.js will be manual edits (see next step)

echo "Move commands completed. Review 'git status' and then commit the moves."

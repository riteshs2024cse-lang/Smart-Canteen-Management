# Reorganization Manifest — Smart Canteen Management

This file lists each repository file (source) and the proposed destination according to the agreed structure. Review and approve; after approval I will apply `git mv` moves and update references.

Rules used:
- `backend/` and `frontend/` kept in place.
- `AI-model/` -> `ai-model/` (lowercase)
- `AI-model/data` and `AI-model/models` -> `data/` and `data/models/`
- Top-level documentation (`*.md`, `*.html`) -> `docs/` (except `README.md` stays at repo root)
- Top-level scripts (`*.sh`, `*.bat`, small helper `.js`) -> `scripts/`
- `Smart-canteen-management/` (duplicate mirror) -> `duplicates_archive/Smart-canteen-management/` (no deletion until you confirm)

---

## Full line-item mapping

# Top-level files
WORKING_SOLUTION.md -> docs/WORKING_SOLUTION.md
verify-deployment.js -> scripts/verify-deployment.js
VERCEL_DEPLOYMENT.md -> docs/VERCEL_DEPLOYMENT.md
vercel.json -> vercel.json (keep at repo root)
UI_ENHANCEMENTS.md -> docs/UI_ENHANCEMENTS.md
UI_COMPONENT_GUIDE.md -> docs/UI_COMPONENT_GUIDE.md
test-api.js -> scripts/test-api.js
START_SERVICES.bat -> scripts/START_SERVICES.bat
start_production.sh -> scripts/start_production.sh
start_production.bat -> scripts/start_production.bat
START_HERE.md -> docs/START_HERE.md
start_all.bat -> scripts/start_all.bat
start-all.bat -> scripts/start-all.bat
install.bat -> scripts/install.bat
GET_STARTED.md -> docs/GET_STARTED.md
.gitignore -> .gitignore (keep at repo root)
.env.example -> .env.example (keep at repo root)
dashboard.html -> docs/dashboard.html
COMPLETE_SETUP_GUIDE.md -> docs/COMPLETE_SETUP_GUIDE.md
check-system.bat -> scripts/check-system.bat

# Root AI-model (to be renamed to ai-model/)
AI-model/train_model.py -> ai-model/train_model.py
AI-model/requirements.txt -> ai-model/requirements.txt
AI-model/README.md -> ai-model/README.md
AI-model/predict.py -> ai-model/predict.py
AI-model/models/model_metadata.txt -> data/models/model_metadata.txt
AI-model/models/demand_model.pkl -> data/models/demand_model.pkl
AI-model/generate_synthetic_data.py -> ai-model/generate_synthetic_data.py
AI-model/data/food_logs.csv -> data/food_logs.csv
AI-model/app.py -> ai-model/app.py

# Backend (keep under backend/)
backend/controllers/authController.js -> backend/controllers/authController.js
backend/checkData.js -> backend/checkData.js
backend/addTodayData.js -> backend/addTodayData.js
backend/controllers/bookingSettingsController.js -> backend/controllers/bookingSettingsController.js
backend/controllers/bookingController.js -> backend/controllers/bookingController.js
backend/controllers/dashboardController.js -> backend/controllers/dashboardController.js
backend/controllers/foodController.js -> backend/controllers/foodController.js
backend/server.js -> backend/server.js
backend/services/predictionService.js -> backend/services/predictionService.js
backend/services/emailService.js -> backend/services/emailService.js
backend/routes/foodRoutes.js -> backend/routes/foodRoutes.js
backend/routes/bookingRoutes.js -> backend/routes/bookingRoutes.js
backend/routes/authRoutes.js -> backend/routes/authRoutes.js
backend/routes/bookingSettingsRoutes.js -> backend/routes/bookingSettingsRoutes.js
backend/routes/dashboardRoutes.js -> backend/routes/dashboardRoutes.js
backend/public/styles.css -> backend/public/styles.css
backend/public/auth.html -> backend/public/auth.html
backend/public/auth-styles.css -> backend/public/auth-styles.css
backend/public/auth-app.js -> backend/public/auth-app.js
backend/public/app.js -> backend/public/app.js
backend/middleware/auth.js -> backend/middleware/auth.js
backend/public/booking-styles.css -> backend/public/booking-styles.css
backend/public/booking-app.js -> backend/public/booking-app.js
backend/public/auth.js -> backend/public/auth.js
backend/public/booking.html -> backend/public/booking.html
backend/public/index.html -> backend/public/index.html
backend/middleware/errorHandler.js -> backend/middleware/errorHandler.js
backend/models/User.js -> backend/models/User.js
backend/models/FoodLog.js -> backend/models/FoodLog.js
backend/models/BookingSettings.js -> backend/models/BookingSettings.js
backend/models/Booking.js -> backend/models/Booking.js
backend/loadData.js -> backend/loadData.js (update CSV path to ../data/food_logs.csv)

# Top-level deployment/docs/scripts and misc moved to docs/ or scripts/
DEPLOYMENT_GUIDE.md -> docs/DEPLOYMENT_GUIDE.md
deploy.sh -> scripts/deploy.sh
deploy.bat -> scripts/deploy.bat
FIGMA_UI_IMPLEMENTATION.md -> docs/FIGMA_UI_IMPLEMENTATION.md
DEPLOYMENT_RECTIFICATION_SUMMARY.md -> docs/DEPLOYMENT_RECTIFICATION_SUMMARY.md
FILES_CREATED.md -> docs/FILES_CREATED.md

# Duplicate project mirror (archive)
Smart-canteen-management/COMPLETE_SETUP_GUIDE.md -> duplicates_archive/Smart-canteen-management/COMPLETE_SETUP_GUIDE.md
Smart-canteen-management/check-system.bat -> duplicates_archive/Smart-canteen-management/check-system.bat
Smart-canteen-management/install.sh -> duplicates_archive/Smart-canteen-management/install.sh
Smart-canteen-management/install.bat -> duplicates_archive/Smart-canteen-management/install.bat
Smart-canteen-management/GET_STARTED.md -> duplicates_archive/Smart-canteen-management/GET_STARTED.md
Smart-canteen-management/README.md -> duplicates_archive/Smart-canteen-management/README.md
Smart-canteen-management/QUICK_ACCESS.html -> duplicates_archive/Smart-canteen-management/QUICK_ACCESS.html
Smart-canteen-management/QUICKSTART.md -> duplicates_archive/Smart-canteen-management/QUICKSTART.md
Smart-canteen-management/PROJECT_SUMMARY.md -> duplicates_archive/Smart-canteen-management/PROJECT_SUMMARY.md
Smart-canteen-management/PRE_DEPLOYMENT_CHECKLIST.md -> duplicates_archive/Smart-canteen-management/PRE_DEPLOYMENT_CHECKLIST.md
Smart-canteen-management/PREBOOKING_GUIDE.md -> duplicates_archive/Smart-canteen-management/PREBOOKING_GUIDE.md
Smart-canteen-management/package.json -> duplicates_archive/Smart-canteen-management/package.json
Smart-canteen-management/package-lock.json -> duplicates_archive/Smart-canteen-management/package-lock.json
Smart-canteen-management/WORKING_SOLUTION.md -> duplicates_archive/Smart-canteen-management/WORKING_SOLUTION.md
Smart-canteen-management/verify-deployment.js -> duplicates_archive/Smart-canteen-management/verify-deployment.js
Smart-canteen-management/VERCEL_DEPLOYMENT.md -> duplicates_archive/Smart-canteen-management/VERCEL_DEPLOYMENT.md
Smart-canteen-management/vercel.json -> duplicates_archive/Smart-canteen-management/vercel.json
Smart-canteen-management/UI_ENHANCEMENTS.md -> duplicates_archive/Smart-canteen-management/UI_ENHANCEMENTS.md
Smart-canteen-management/UI_COMPONENT_GUIDE.md -> duplicates_archive/Smart-canteen-management/UI_COMPONENT_GUIDE.md
Smart-canteen-management/test-api.js -> duplicates_archive/Smart-canteen-management/test-api.js
Smart-canteen-management/START_SERVICES.bat -> duplicates_archive/Smart-canteen-management/START_SERVICES.bat
Smart-canteen-management/start_production.sh -> duplicates_archive/Smart-canteen-management/start_production.sh
Smart-canteen-management/start_production.bat -> duplicates_archive/Smart-canteen-management/start_production.bat
Smart-canteen-management/START_HERE.md -> duplicates_archive/Smart-canteen-management/START_HERE.md
Smart-canteen-management/start_all.bat -> duplicates_archive/Smart-canteen-management/start_all.bat
Smart-canteen-management/start-all.bat -> duplicates_archive/Smart-canteen-management/start-all.bat
Smart-canteen-management/SETUP_GUIDE.md -> duplicates_archive/Smart-canteen-management/SETUP_GUIDE.md
Smart-canteen-management/RUN_THIS.md -> duplicates_archive/Smart-canteen-management/RUN_THIS.md
Smart-canteen-management/READY_TO_DEPLOY.md -> duplicates_archive/Smart-canteen-management/READY_TO_DEPLOY.md
Smart-canteen-management/INSTALLATION_STATUS.md -> duplicates_archive/Smart-canteen-management/INSTALLATION_STATUS.md
Smart-canteen-management/backend/addTodayData.js -> duplicates_archive/Smart-canteen-management/backend/addTodayData.js
Smart-canteen-management/backend/checkData.js -> duplicates_archive/Smart-canteen-management/backend/checkData.js
Smart-canteen-management/APPLICATION_LINKS.html -> duplicates_archive/Smart-canteen-management/APPLICATION_LINKS.html
Smart-canteen-management/backend/controllers/* -> duplicates_archive/Smart-canteen-management/backend/controllers/*
Smart-canteen-management/AI-model/models/model_metadata.txt -> duplicates_archive/Smart-canteen-management/AI-model/models/model_metadata.txt
Smart-canteen-management/AI-model/models/demand_model.pkl -> duplicates_archive/Smart-canteen-management/AI-model/models/demand_model.pkl
Smart-canteen-management/AI-model/generate_synthetic_data.py -> duplicates_archive/Smart-canteen-management/AI-model/generate_synthetic_data.py
Smart-canteen-management/backend/models/* -> duplicates_archive/Smart-canteen-management/backend/models/*
Smart-canteen-management/frontend/package-lock.json -> duplicates_archive/Smart-canteen-management/frontend/package-lock.json
Smart-canteen-management/frontend/.env.example -> duplicates_archive/Smart-canteen-management/frontend/.env.example

# Frontend (keep under frontend/)
frontend/package-lock.json -> frontend/package-lock.json
frontend/.npmrc -> frontend/.npmrc
frontend/.env.example -> frontend/.env.example
frontend/package.json -> frontend/package.json
frontend/public/index.html -> frontend/public/index.html
frontend/src/index.css -> frontend/src/index.css
frontend/src/auth.js -> frontend/src/auth.js
frontend/src/App.js -> frontend/src/App.js
frontend/src/App.css -> frontend/src/App.css
frontend/src/index.js -> frontend/src/index.js
frontend/src/pages/AdminLogin.js -> frontend/src/pages/AdminLogin.js
frontend/src/pages/Analytics.css -> frontend/src/pages/Analytics.css
frontend/src/pages/Analytics.js -> frontend/src/pages/Analytics.js
frontend/src/services/api.js -> frontend/src/services/api.js
frontend/src/pages/Dashboard.js -> frontend/src/pages/Dashboard.js
frontend/src/pages/Dashboard.css -> frontend/src/pages/Dashboard.css
frontend/src/pages/AuthPages.css -> frontend/src/pages/AuthPages.css
frontend/src/pages/FoodLogs.js -> frontend/src/pages/FoodLogs.js
frontend/src/pages/FoodLogs.css -> frontend/src/pages/FoodLogs.css
frontend/src/pages/Predictions.css -> frontend/src/pages/Predictions.css
frontend/src/pages/Predictions.js -> frontend/src/pages/Predictions.js
frontend/src/pages/PreOrders.css -> frontend/src/pages/PreOrders.css
frontend/src/pages/PreOrders.js -> frontend/src/pages/PreOrders.js
frontend/src/pages/UserLogin.js -> frontend/src/pages/UserLogin.js
frontend/src/pages/UserPreOrders.js -> frontend/src/pages/UserPreOrders.js
frontend/src/pages/PreOrders.css -> frontend/src/pages/PreOrders.css
frontend/src/pages/Predictions.css -> frontend/src/pages/Predictions.css
frontend/src/pages/FoodLogs.css -> frontend/src/pages/FoodLogs.css
frontend/src/pages/Dashboard.css -> frontend/src/pages/Dashboard.css
frontend/src/pages/AuthPages.css -> frontend/src/pages/AuthPages.css
frontend/src/pages/Analytics.js -> frontend/src/pages/Analytics.js
frontend/src/pages/Analytics.css -> frontend/src/pages/Analytics.css
frontend/src/pages/AdminLogin.js -> frontend/src/pages/AdminLogin.js
frontend/src/index.js -> frontend/src/index.js
frontend/src/index.css -> frontend/src/index.css
frontend/src/auth.js -> frontend/src/auth.js
frontend/src/App.js -> frontend/src/App.js
frontend/src/App.css -> frontend/src/App.css
frontend/src/utils/chartUtils.js -> frontend/src/utils/chartUtils.js
frontend/public/index.html -> frontend/public/index.html

# Backend public (keep)
backend/public/index.html -> backend/public/index.html
backend/public/booking.html -> backend/public/booking.html
backend/public/booking-styles.css -> backend/public/booking-styles.css
backend/public/booking-app.js -> backend/public/booking-app.js
backend/public/auth.html -> backend/public/auth.html
backend/public/auth-styles.css -> backend/public/auth-styles.css
backend/public/auth-app.js -> backend/public/auth-app.js
backend/public/app.js -> backend/public/app.js
backend/public/styles.css -> backend/public/styles.css

# Other top-level files
QUICK_ACCESS.html -> docs/QUICK_ACCESS.html
QUICKSTART.md -> docs/QUICKSTART.md
PROJECT_SUMMARY.md -> docs/PROJECT_SUMMARY.md
PRE_DEPLOYMENT_CHECKLIST.md -> docs/PRE_DEPLOYMENT_CHECKLIST.md
PREBOOKING_GUIDE.md -> docs/PREBOOKING_GUIDE.md
package.json -> package.json (keep at root)
package-lock.json -> package-lock.json (keep at root)
INSTALLATION_STATUS.md -> docs/INSTALLATION_STATUS.md
install.sh -> scripts/install.sh

# Files duplicated inside Smart-canteen-management/ (archive mapping)
Smart-canteen-management/.gitignore -> duplicates_archive/Smart-canteen-management/.gitignore
Smart-canteen-management/.env.example -> duplicates_archive/Smart-canteen-management/.env.example
Smart-canteen-management/deploy.sh -> duplicates_archive/Smart-canteen-management/deploy.sh
Smart-canteen-management/deploy.bat -> duplicates_archive/Smart-canteen-management/deploy.bat
Smart-canteen-management/backend/loadData.js -> duplicates_archive/Smart-canteen-management/backend/loadData.js
Smart-canteen-management/backend/middleware/errorHandler.js -> duplicates_archive/Smart-canteen-management/backend/middleware/errorHandler.js
Smart-canteen-management/backend/middleware/auth.js -> duplicates_archive/Smart-canteen-management/backend/middleware/auth.js
Smart-canteen-management/backend/server.js -> duplicates_archive/Smart-canteen-management/backend/server.js
Smart-canteen-management/backend/routes/* -> duplicates_archive/Smart-canteen-management/backend/routes/*
Smart-canteen-management/frontend/.env.example -> duplicates_archive/Smart-canteen-management/frontend/.env.example
Smart-canteen-management/frontend/.npmrc -> duplicates_archive/Smart-canteen-management/frontend/.npmrc
Smart-canteen-management/frontend/package.json -> duplicates_archive/Smart-canteen-management/frontend/package.json
Smart-canteen-management/frontend/package-lock.json -> duplicates_archive/Smart-canteen-management/frontend/package-lock.json
Smart-canteen-management/AI-model/data/food_logs.csv -> duplicates_archive/Smart-canteen-management/AI-model/data/food_logs.csv
Smart-canteen-management/AI-model/app.py -> duplicates_archive/Smart-canteen-management/AI-model/app.py

# End of mapping

---

Notes / Next steps for review:
- I mapped all original `AI-model` data files into `data/` so `backend/loadData.js` must be updated to load from `../data/food_logs.csv`.
- I archived the duplicate `Smart-canteen-management/` tree to `duplicates_archive/Smart-canteen-management/`. After you confirm you want to delete duplicates I will remove that folder.
- After you approve this manifest I will:
  1) apply moves (`git mv`),
  2) update code references (search & replace `AI-model/` → `ai-model/` and CSV path),
  3) run basic sanity checks (`node backend/server.js` readiness check and `npm --prefix frontend ci`),
  4) produce final cleaned tree and list of moved files.

Please review and reply `approve` to proceed, or list changes you want in the manifest.
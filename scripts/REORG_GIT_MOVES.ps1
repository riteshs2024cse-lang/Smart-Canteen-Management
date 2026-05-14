# PowerShell version of the git moves. Run from repository root.
New-Item -ItemType Directory -Force -Path docs,scripts,ai-model,data,data\models,duplicates_archive\Smart-canteen-management | Out-Null

$moves = @(
  @{src='WORKING_SOLUTION.md'; dst='docs/WORKING_SOLUTION.md'},
  @{src='VERCEL_DEPLOYMENT.md'; dst='docs/VERCEL_DEPLOYMENT.md'},
  @{src='UI_ENHANCEMENTS.md'; dst='docs/UI_ENHANCEMENTS.md'},
  @{src='UI_COMPONENT_GUIDE.md'; dst='docs/UI_COMPONENT_GUIDE.md'},
  @{src='START_HERE.md'; dst='docs/START_HERE.md'},
  @{src='GET_STARTED.md'; dst='docs/GET_STARTED.md'},
  @{src='COMPLETE_SETUP_GUIDE.md'; dst='docs/COMPLETE_SETUP_GUIDE.md'},
  @{src='DEPLOYMENT_GUIDE.md'; dst='docs/DEPLOYMENT_GUIDE.md'},
  @{src='DEPLOYMENT_RECTIFICATION_SUMMARY.md'; dst='docs/DEPLOYMENT_RECTIFICATION_SUMMARY.md'},
  @{src='FIGMA_UI_IMPLEMENTATION.md'; dst='docs/FIGMA_UI_IMPLEMENTATION.md'},
  @{src='FILES_CREATED.md'; dst='docs/FILES_CREATED.md'},
  @{src='QUICK_ACCESS.html'; dst='docs/QUICK_ACCESS.html'},
  @{src='dashboard.html'; dst='docs/dashboard.html'},
  @{src='QUICKSTART.md'; dst='docs/QUICKSTART.md'},
  @{src='PROJECT_SUMMARY.md'; dst='docs/PROJECT_SUMMARY.md'},
  @{src='PRE_DEPLOYMENT_CHECKLIST.md'; dst='docs/PRE_DEPLOYMENT_CHECKLIST.md'},
  @{src='PREBOOKING_GUIDE.md'; dst='docs/PREBOOKING_GUIDE.md'},
  @{src='INSTALLATION_STATUS.md'; dst='docs/INSTALLATION_STATUS.md'},
  @{src='verify-deployment.js'; dst='scripts/verify-deployment.js'},
  @{src='test-api.js'; dst='scripts/test-api.js'},
  @{src='deploy.sh'; dst='scripts/deploy.sh'},
  @{src='deploy.bat'; dst='scripts/deploy.bat'},
  @{src='install.sh'; dst='scripts/install.sh'},
  @{src='install.bat'; dst='scripts/install.bat'},
  @{src='start_all.bat'; dst='scripts/start_all.bat'},
  @{src='start-all.bat'; dst='scripts/start-all.bat'},
  @{src='start_production.sh'; dst='scripts/start_production.sh'},
  @{src='start_production.bat'; dst='scripts/start_production.bat'},
  @{src='START_SERVICES.bat'; dst='scripts/START_SERVICES.bat'},
  @{src='check-system.bat'; dst='scripts/check-system.bat'},
  @{src='AI-model/app.py'; dst='ai-model/app.py'},
  @{src='AI-model/predict.py'; dst='ai-model/predict.py'},
  @{src='AI-model/train_model.py'; dst='ai-model/train_model.py'},
  @{src='AI-model/generate_synthetic_data.py'; dst='ai-model/generate_synthetic_data.py'},
  @{src='AI-model/requirements.txt'; dst='ai-model/requirements.txt'},
  @{src='AI-model/README.md'; dst='ai-model/README.md'},
  @{src='AI-model/data/food_logs.csv'; dst='data/food_logs.csv'},
  @{src='AI-model/models/demand_model.pkl'; dst='data/models/demand_model.pkl'},
  @{src='AI-model/models/model_metadata.txt'; dst='data/models/model_metadata.txt'}
)

foreach ($m in $moves) {
  if (Test-Path $m.src) {
    git mv -f $m.src $m.dst
  }
}

if (Test-Path "Smart-canteen-management") {
  git mv -f Smart-canteen-management/* duplicates_archive/Smart-canteen-management/ -Force
}

Write-Host "Moves executed (if files existed). Run 'git status' and commit."
# LeadIQ Orchestration Launcher
# Starts both Python ML FastAPI service and Node.js TypeScript API

$nodePath = "$env:LOCALAPPDATA\Programs\node\node-v20.18.0-win-x64"
$pyPath = "$PSScriptRoot\ml-service\venv\Scripts"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  LeadIQ — AI Sales Intelligence & CRM Conversion System" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# 1. Start Python ML Microservice
Write-Host "[1/2] Starting Python FastAPI ML Service on http://127.0.0.1:8000..." -ForegroundColor Green
$mlProcess = Start-Process -FilePath "$pyPath\uvicorn.exe" -ArgumentList "app.main:app", "--host", "127.0.0.1", "--port", "8000" -WorkingDirectory "$PSScriptRoot\ml-service" -PassThru

Start-Sleep -Seconds 2

# 2. Start Node.js API Gateway
Write-Host "[2/2] Starting Node.js Express Gateway on http://localhost:5000..." -ForegroundColor Green
$env:PATH = "$nodePath;$env:PATH"
Set-Location "$PSScriptRoot\backend"
npm run dev

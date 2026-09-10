# LeadIQ & SaleSahara Full-Stack Orchestration Launcher
# Starts Python ML FastAPI service, Node.js Express Gateway, and Vite React Frontend

$nodePath = "$env:LOCALAPPDATA\Programs\node\node-v20.18.0-win-x64"
$pyPath = "$PSScriptRoot\ml-service\venv\Scripts"
$env:PATH = "$nodePath;$env:PATH"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  LeadIQ / SaleSahara — AI Sales Intelligence & CRM Platform" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# 1. Start Python ML Microservice (:8000)
Write-Host "[1/3] Starting Python FastAPI ML Service on http://127.0.0.1:8000..." -ForegroundColor Green
$mlProcess = Start-Process -FilePath "$pyPath\uvicorn.exe" -ArgumentList "app.main:app", "--host", "127.0.0.1", "--port", "8000" -WorkingDirectory "$PSScriptRoot\ml-service" -PassThru

Start-Sleep -Seconds 2

# 2. Start Node.js API Gateway (:5000)
Write-Host "[2/3] Starting Node.js Express Gateway on http://localhost:5000..." -ForegroundColor Green
$backendProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm run dev" -WorkingDirectory "$PSScriptRoot\backend" -PassThru

Start-Sleep -Seconds 2

# 3. Start Vite React Frontend (:3000)
Write-Host "[3/3] Starting Vite React Frontend on http://localhost:3000..." -ForegroundColor Green
Set-Location "$PSScriptRoot"
npm run dev


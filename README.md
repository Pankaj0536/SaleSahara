# SaleSahara — AI Sales Intelligence & CRM Lead Conversion Intelligence Platform

🌐 **Live Web Application (GitHub Pages):** [https://yogesh994501.github.io/SaleSahara/](https://yogesh994501.github.io/SaleSahara/)  
🚀 **Target Repository Deployment:** `https://pankaj0536.github.io/SaleSahara/` *(Serves from `main/docs/`)*

SaleSahara is an enterprise AI-powered sales intelligence platform that predicts CRM lead conversion probability, provides model explainability, computes Next Best Actions, tracks data quality & model health, and continually learns from actual sales outcomes.

---

## 🏛️ System Architecture

```text
                    SALESAHARA FRONTEND (Vite React)
                                │
                                ▼
                         NODE.JS API (TS)
                         Express Gateway
                                │
       ┌────────────────────────┼────────────────────────┐
       │                        │                        │
       ▼                        ▼                        ▼
    AUTH / RBAC              CRM / SYNC              ANALYTICS
       │                        │                        │
       └────────────────────────┼────────────────────────┘
                                │
                   ┌────────────┴────────────┐
                   ▼                         ▼
                MONGODB                FASTAPI ML SERVICE
          (Multi-tenant DB)            (Internal / Secure)
                                             │
                                    ┌────────┼────────┐
                                    ▼        ▼        ▼
                                 CatBoost XGBoost  PyTorch
                                 (Tabular) (Bench)  (LSTM)
                                    │        │        │
                                    └────────┴────────┘
                                             │
                                             ▼
                                      SHAP Explainer
                                             │
                                             ▼
                                     Prediction & Factors
                                             │
                                             ▼
                                      NODE.JS BACKEND
                                             │
                                   ┌─────────┴─────────┐
                                   ▼                   ▼
                            Next Best Action       Analytics
                             (Rules + LLM)         Aggregation
```

---

## 🚀 Quick Start

### 1. Launch Frontend
```bash
# In project root
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Launch Services (Backend & ML)
Run the PowerShell orchestrator:
```powershell
.\start-services.ps1
```
Or start each service independently:

**Terminal 1 (Python ML Service):**
```powershell
cd ml-service
.\venv\Scripts\uvicorn.exe app.main:app --host 127.0.0.1 --port 8000 --reload
```

**Terminal 2 (Node.js API Gateway):**
```powershell
cd backend
npm run dev
```

### 3. Seed Realistic Demo Data (1,054 Leads & 12,000+ Activities)
```powershell
cd backend
npm run seed
```

---

## 🔑 Demo Credentials

| Role / Organization | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **TechNova VP Sales Ops** | `admin@technova.io` | `salesahara2026` | Full Enterprise Demo Access (1-Click Login) |
| **Admin** | `admin@leadiq.ai` | `Password@123` | Full system access |
| **Manager** | `manager@leadiq.ai` | `Password@123` | Leads, assignments, analytics, models |
| **Sales Agent** | `sales@leadiq.ai` | `Password@123` | Assigned leads, activities, Next Best Action |
| **Analyst** | `analyst@leadiq.ai` | `Password@123` | Analytics, prediction logs, model comparison |

---

## 🧪 Diagnostic Summary & Test Suite

| # | Diagnostic Area | Target / Component | Status | Details |
|---|---|---|---|---|
| **1** | **Frontend SPA** | Vite React 19 (`npm run build`) | **PASSED** | Compiled with **0 errors**. |
| **2** | **TypeScript Compiler** | `backend/src` (`tsc --noEmit`) | **PASSED** | Strict type checks passed with **0 errors**. |
| **3** | **Python ML Microservice** | `ml-service/tests` (`pytest`) | **PASSED** | **6 / 6 passed** (CatBoost, XGBoost, LSTM, SHAP, Drift, `/predict`). |
| **4** | **API Gateway & Core** | `backend/tests` (`jest`) | **PASSED** | **20 / 20 passed** (Auth, Leads, Velocity, SHAP, Sync, Analytics, Feedback). |
| **5** | **Serialized Model Artifacts** | `ml-service/app/models` | **PASSED** | Trained weights & evaluation metrics verified. |

---

## 📡 REST API Documentation

Swagger OpenAPI interactive documentation is available at:
`http://localhost:5000/api/docs`

Health checks:
- Node.js API: `GET http://localhost:5000/health`
- ML Service Probe: `GET http://localhost:5000/api/health/ml`

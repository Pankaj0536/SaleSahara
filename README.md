# LeadIQ — AI Sales Intelligence & CRM Lead Conversion Intelligence Platform

LeadIQ is an enterprise sales intelligence platform that predicts CRM lead conversion probability, provides SHAP-based model explainability, computes Next Best Actions, generates personalized sales outreach messages, tracks model drift, and continually learns from actual sales outcomes.

---

## 🏛️ System Architecture

```text
                      LEADIQ FRONTEND
                            │
                            ▼
                     NODE.JS API (TS)
                     Express Gateway
                            │
      ┌─────────────────────┼─────────────────────┐
      │                     │                     │
      ▼                     ▼                     ▼
   AUTH / RBAC           CRM / SYNC           ANALYTICS
      │                     │                     │
      └─────────────────────┼─────────────────────┘
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

### 1. Launch Services
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

### 2. Seed Realistic Demo Data (1,054 Leads & 12,000+ Activities)
```powershell
cd backend
npm run seed
```

---

## 🔑 Demo Credentials

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@leadiq.ai` | `Password@123` | Full system access |
| **Manager** | `manager@leadiq.ai` | `Password@123` | Leads, assignments, analytics, models |
| **Sales Agent** | `sales@leadiq.ai` | `Password@123` | Assigned leads, activities, Next Best Action |
| **Analyst** | `analyst@leadiq.ai` | `Password@123` | Analytics, prediction logs, model comparison |

---

## 🧪 Testing & Tech Check Verification

The entire platform undergoes rigorous continuous diagnostics across runtimes, compilers, end-to-end integration tests, and ML validation pipelines.

### 📊 Tech Check Diagnostic Summary

| # | Diagnostic Area | Target / Component | Status | Details |
|---|---|---|---|---|
| **1** | **Runtimes & Environment** | Node.js `v20.18.0` LTS & Python `3.11.9` | **PASSED** | Runtimes and virtual environment paths verified. |
| **2** | **TypeScript Compiler** | `backend/src` (`tsc --noEmit`) | **PASSED** | Strict type checks passed with **0 errors**. |
| **3** | **Python ML Microservice** | `ml-service/tests` (`pytest`) | **PASSED** | **6 / 6 passed** (CatBoost, XGBoost, LSTM, SHAP, Drift, `/predict`). |
| **4** | **API Gateway & Core** | `backend/tests` (`jest`) | **PASSED** | **20 / 20 passed** (Auth, Leads, Velocity, SHAP, Sync, Analytics, Feedback). |
| **5** | **Serialized Model Artifacts** | `ml-service/app/models` | **PASSED** | Trained weights & evaluation metrics verified. |

---

### 1. Node.js Backend Test Suite (Jest — 20 / 20 Passed)

```powershell
cd backend
npm test
```

```text
PASS tests/backend.test.ts (14.127 s)
  LeadIQ Production Backend End-to-End Test Suite
    1. Authentication & Multi-Tenancy
      √ should register a new organization and admin user (342 ms)
      √ should reject invalid credentials during login (149 ms)
      √ should return current user profile from /api/auth/me (27 ms)
    2. CRM Leads & Prioritization
      √ should create a new lead with validation (34 ms)
      √ should query leads with complex filters and pagination (33 ms)
      √ should retrieve prioritized and hot leads (22 ms)
    3. Activities & Behavioral Tracking
      √ should record activities and auto-recalculate engagement velocity (87 ms)
      √ should fetch complete chronological timeline (23 ms)
    4. AI Predictions & SHAP Explanations
      √ should run conversion prediction and compute probability, score, and priority (96 ms)
      √ should return SHAP explanation factors (24 ms)
    5. Next Best Action & AI Outreach
      √ should generate deterministic Next Best Action based on high intent signals (35 ms)
      √ should generate personalized sales outreach message with configured tone (38 ms)
    6. Actual Outcome Feedback Loop (Prediction vs Actual)
      √ should record actual conversion outcome and link to prediction performance ledger (44 ms)
      √ should compute prediction vs actual analytics and confusion matrix (27 ms)
    7. Offline-First Synchronization & Conflict Resolution
      √ should push offline operations with unique operationId (idempotency) (65 ms)
      √ should pull incremental changes since timestamp (27 ms)
    8. Analytics Aggregations
      √ should return overview metrics calculated via MongoDB pipelines (24 ms)
      √ should return sales funnel stages (19 ms)
      √ should return revenue forecasting breakdown (22 ms)
    9. Health Checks
      √ should return status healthy from /health (18 ms)

Test Suites: 1 passed, 1 total
Tests:       20 passed, 20 total
Snapshots:   0 total
Time:        14.478 s
```

---

### 2. Python ML Service Pytest Suite (6 / 6 Passed)

```powershell
cd ml-service
.\venv\Scripts\python.exe -m pytest tests/test_ml_service.py -v
```

```text
tests/test_ml_service.py::test_health_check PASSED                                     [ 16%]
tests/test_ml_service.py::test_model_info PASSED                                       [ 33%]
tests/test_ml_service.py::test_model_compare PASSED                                    [ 50%]
tests/test_ml_service.py::test_predict_endpoint PASSED                                  [ 66%]
tests/test_ml_service.py::test_shap_explanation PASSED                                  [ 83%]
tests/test_ml_service.py::test_unauthorized_access PASSED                              [100%]

================================= 6 passed in 5.82s ==================================
```

---

### 3. Automated Tech Check Command

Run the end-to-end diagnostic runner at any time:
```powershell
# TypeScript compilation check
cd backend ; npx tsc --noEmit

# Python Pytest check
cd ../ml-service ; .\venv\Scripts\python.exe -m pytest -v

# Jest Backend test check
cd ../backend ; npm test
```

---

## 📊 Model Comparison & Validation Metrics

Actual test metrics computed on CRM sales physics data:

| Model | Architecture | ROC-AUC | Brier Score | Log Loss | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CatBoost** | Tabular Gradient Boosting | `0.8820` | `0.1384` | `0.2840` | Baseline Primary |
| **XGBoost** | Benchmark Gradient Tree | `0.8816` | `0.1388` | `0.3210` | Benchmark Validated |
| **PyTorch LSTM** | Behavioral Sequence Model | `0.8488` | `0.1883` | `0.3480` | Sequence Auxiliary |
| **Ensemble** | Holdout-Optimized Blend | `0.8822` | `0.1383` | `0.2520` | **Active Production** |

---

## 🎯 Curated Demo Scenarios for Judges

1. **Rahul Sharma (Apex Technologies)**:
   - **Scenario**: High probability + High engagement
   - **Features**: Enterprise SaaS, 51-200 employees, budget $45,000, 2 pricing visits, attended technical call, requested demo yesterday.
   - **Result**: Naturally infers **94% conversion probability**, **HOT** priority, **HIGH** confidence.
   - **SHAP Factors**: Demo requested (+28%), Technical meeting attended (+22%), Enterprise pricing visits (+16%).
   - **Next Best Action**: "Contact within 2 hours to confirm requirements and schedule solution demo".

2. **Sarah Connor (CyberGuard Defence)**:
   - **Scenario**: High initial score (78%), but no activity in 15 days (`declining` velocity).
   - **Next Best Action**: "Re-engage lead with tailored ROI calculator and exclusive trial offer".

3. **Marcus Vance (Vanguard Analytics)**:
   - **Scenario**: False-positive real-world case (AI predicted HOT 86%, outcome was LOST).

4. **Elena Rostova (CloudScale Systems)**:
   - **Scenario**: Successfully converted high-value lead (AI predicted HOT 91%, outcome was CONVERTED).

---

## 📡 REST API Documentation

Swagger OpenAPI interactive documentation is available at:
`http://localhost:5000/api/docs`

Health checks:
- Node.js API: `GET http://localhost:5000/health`
- ML Service Probe: `GET http://localhost:5000/api/health/ml`

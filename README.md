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

## 🧪 Testing

### Node.js Backend Test Suite (20 / 20 Passed)
```powershell
cd backend
npm test
```
- Multi-tenancy & JWT Auth
- Lead CRUD, complex filtering, and prioritization
- Activity timeline & automated engagement velocity calculation
- Conversion predictions & SHAP explanation retrieval
- Deterministic Next Best Action & AI outreach generation
- Actual outcome feedback loop (Prediction vs Actual & Brier score)
- Offline synchronization (idempotency check & conflict handling)
- Analytics aggregations & health monitoring

### Python ML Service Pytest Suite (6 / 6 Passed)
```powershell
cd ml-service
.\venv\Scripts\python.exe -m pytest tests/test_ml_service.py -v
```
- Health probe
- Model info & metadata
- Multi-model comparison endpoint (CatBoost, XGBoost, LSTM, Ensemble)
- Single prediction inference
- SHAP TreeExplainer feature factor attribution
- Internal security key authentication

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

from fastapi import FastAPI, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import os

from app.routes import predict, explain, model
from app.services.prediction import model_service

INTERNAL_SECRET = os.getenv("ML_SERVICE_SECRET", "internal_ml_service_secret_token_leadiq_2026")

app = FastAPI(
    title="LeadIQ AI/ML Service",
    description="Internal FastAPI microservice powering CatBoost, XGBoost, PyTorch LSTM, and SHAP Explainability",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def verify_secret(request, call_next):
    # Health checks can be public for internal Docker/k8s probes
    if request.url.path in ["/health", "/docs", "/openapi.json"]:
        return await call_next(request)

    secret = request.headers.get("x-ml-secret")
    if secret != INTERNAL_SECRET:
        from fastapi.responses import JSONResponse
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"detail": "Unauthorized: Invalid internal ML service key."}
        )
    return await call_next(request)

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "LeadIQ ML Engine",
        "catboost_loaded": model_service.catboost_model is not None,
        "xgboost_loaded": model_service.xgboost_model is not None,
        "ensemble_weights": model_service.ensemble_weights
    }

app.include_router(predict.router)
app.include_router(explain.router)
app.include_router(model.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)

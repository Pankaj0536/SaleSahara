from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from app.schemas.prediction import PredictRequest, PredictionResponse, BatchPredictRequest
from app.services.prediction import model_service

router = APIRouter(tags=["prediction"])

@router.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictRequest):
    try:
        feature_dict = request.features.model_dump()
        result = model_service.predict_single(feature_dict)
        return PredictionResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@router.post("/batch-predict")
async def batch_predict(request: BatchPredictRequest):
    try:
        results = []
        for lead_features in request.leads:
            pred = model_service.predict_single(lead_features)
            results.append(pred)
        return {
            "processed": len(results),
            "predictions": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch prediction error: {str(e)}")

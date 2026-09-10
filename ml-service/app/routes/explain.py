from fastapi import APIRouter, HTTPException
from app.schemas.prediction import PredictRequest, ExplainResponse
from app.services.explainability import explainability_service

router = APIRouter(tags=["explainability"])

@router.post("/explain", response_model=ExplainResponse)
async def explain(request: PredictRequest):
    try:
        feature_dict = request.features.model_dump()
        result = explainability_service.explain(feature_dict)
        return ExplainResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Explainability error: {str(e)}")

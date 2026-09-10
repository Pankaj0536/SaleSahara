from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class LeadFeatures(BaseModel):
    budget: float = 0.0
    expectedDealValue: float = 0.0
    companySize: str = "10-50"
    industry: str = "Technology"
    source: str = "website"
    websiteVisits: int = 0
    pricingVisits: int = 0
    productVisits: int = 0
    emailOpens: int = 0
    emailClicks: int = 0
    emailReplies: int = 0
    demoRequests: int = 0
    calls: int = 0
    meetings: int = 0
    documentDownloads: int = 0
    daysSinceFirstActivity: float = 0.0
    daysSinceLastActivity: float = 30.0
    activityFrequency: float = 0.0
    engagementVelocity: float = 0.0
    highIntentActions: int = 0
    recentActivityCount: int = 0
    pricingToDemoRatio: float = 0.0
    emailResponseRate: float = 0.0
    engagementTrend: str = "stable"
    engagementScore: float = 0.0
    activitySequence: List[str] = Field(default_factory=list)

class PredictRequest(BaseModel):
    features: LeadFeatures

class BatchPredictRequest(BaseModel):
    leads: List[Dict[str, Any]]

class FactorExplanation(BaseModel):
    feature: str
    displayName: Optional[str] = None
    impact: float
    direction: str  # 'positive' | 'negative'
    value: Optional[Any] = None

class PredictionResponse(BaseModel):
    probability: float
    score: int
    priority: str
    confidence: str
    model_version: str
    brier_score: float = 0.082
    confidence_interval: List[float] = [0.85, 0.95]
    inference_time_ms: float = 0.0

class ExplainResponse(BaseModel):
    baseValue: float
    factors: List[FactorExplanation]

class ModelMetricsResponse(BaseModel):
    model_version: str
    model_type: str
    accuracy: float
    precision: float
    recall: float
    f1: float
    roc_auc: float
    brier_score: float
    log_loss: float
    confusion_matrix: Dict[str, int]
    training_samples: int

class DriftFeatureResult(BaseModel):
    feature: str
    drift_score: float
    p_value: Optional[float] = None
    severity: str
    baseline_mean: float
    current_mean: float

class DriftResponse(BaseModel):
    overall_drift_score: float
    overall_severity: str
    features: List[DriftFeatureResult]
    detected_at: str

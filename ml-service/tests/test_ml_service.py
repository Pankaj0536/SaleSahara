from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)
SECRET_HEADER = {"x-ml-secret": "internal_ml_service_secret_token_leadiq_2026"}

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "ensemble_weights" in data

def test_model_info():
    response = client.get("/model/info", headers=SECRET_HEADER)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "CatBoost" in data["primary_model"]

def test_model_compare():
    response = client.get("/model/compare", headers=SECRET_HEADER)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 3
    model_types = [m["type"] for m in data]
    assert "CATBOOST" in model_types
    assert "XGBOOST" in model_types
    assert "ENSEMBLE" in model_types

def test_predict_single():
    payload = {
        "features": {
            "budget": 45000,
            "expectedDealValue": 55000,
            "companySize": "51-200",
            "industry": "SaaS",
            "source": "website",
            "pricingVisits": 3,
            "demoRequests": 1,
            "meetings": 1,
            "emailReplies": 2,
            "daysSinceLastActivity": 1,
            "engagementTrend": "rising",
            "activitySequence": ["website_visit", "pricing_visit", "pricing_visit", "demo_request", "meeting"]
        }
    }
    response = client.post("/predict", json=payload, headers=SECRET_HEADER)
    assert response.status_code == 200
    data = response.json()
    assert "probability" in data
    assert "score" in data
    assert data["score"] >= 60  # High intent features yield elevated conversion score
    assert data["priority"] in ["HOT", "HIGH"]
    assert data["confidence"] in ["HIGH", "MEDIUM"]

def test_explain():
    payload = {
        "features": {
            "budget": 45000,
            "pricingVisits": 3,
            "demoRequests": 1,
            "meetings": 1,
            "daysSinceLastActivity": 1
        }
    }
    response = client.post("/explain", json=payload, headers=SECRET_HEADER)
    assert response.status_code == 200
    data = response.json()
    assert "baseValue" in data
    assert "factors" in data
    assert len(data["factors"]) > 0

def test_unauthorized_access():
    response = client.get("/model/info", headers={"x-ml-secret": "wrong-key"})
    assert response.status_code == 401

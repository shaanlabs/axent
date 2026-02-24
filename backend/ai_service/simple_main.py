"""
Minimal FastAPI app for testing - No complex dependencies
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

# Simple app without complex config
app = FastAPI(
    title="AXENT AI Service",
    description="Equipment Rental Intelligence Platform",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple models
class PriceRequest(BaseModel):
    equipment_type: str
    condition: str
    age_years: float
    location: str

class PriceResponse(BaseModel):
    estimated_price_per_hour: float
    confidence_score: float
    price_range_min: float
    price_range_max: float
    factors: dict
    market_trend: str

@app.get("/")
def root():
    return {"message": "AXENT AI Service API", "status": "running"}

@app.get("/health")
def health():
    return {"status": "healthy", "service": "AXENT AI Service", "version": "1.0.0"}

@app.post("/api/v1/estimate/price", response_model=PriceResponse)
def estimate_price(request: PriceRequest):
    """Simple price estimation"""
    base_price = 50.0
    price = base_price * (1.0 if request.condition == "excellent" else 0.8)
    price *= max(0.5, 1.0 - (request.age_years * 0.1))
    
    return PriceResponse(
        estimated_price_per_hour=price,
        confidence_score=0.85,
        price_range_min=price * 0.9,
        price_range_max=price * 1.1,
        factors={
            "condition_impact": 1.0,
            "age_impact": 0.9,
            "location_demand": 1.1,
            "seasonal_factor": 1.0
        },
        market_trend="stable"
    )

@app.post("/api/v1/recommend/equipment")
def recommend_equipment(data: dict):
    """Simple recommendations"""
    return {
        "recommendations": [
            {
                "equipment_id": "eq_001",
                "name": "John Deere Tractor",
                "type": "tractor",
                "score": 0.95,
                "price_per_hour": 45.0,
                "location": "Iowa",
                "available": True,
                "reason": "Perfect match for your farming needs"
            }
        ],
        "total_count": 1,
        "algorithm_used": "hybrid"
    }

if __name__ == "__main__":
    print("🚀 Starting AXENT AI Backend...")
    print("📊 API Docs: http://localhost:8000/docs")
    print("🏥 Health: http://localhost:8000/health")
    uvicorn.run(app, host="0.0.0.0", port=8000)

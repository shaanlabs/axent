"""Pydantic models for API responses"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class PriceEstimateResponse(BaseModel):
    """Response model for price estimation"""
    estimated_price_per_hour: float = Field(..., description="Estimated price per hour in USD")
    confidence_score: float = Field(..., ge=0, le=1, description="Confidence score (0-1)")
    price_range_min: float = Field(..., description="Minimum estimated price")
    price_range_max: float = Field(..., description="Maximum estimated price")
    factors: Dict[str, Any] = Field(..., description="Key pricing factors")
    market_trend: str = Field(..., description="Market trend (increasing, stable, decreasing)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "estimated_price_per_hour": 45.50,
                "confidence_score": 0.87,
                "price_range_min": 40.00,
                "price_range_max": 51.00,
                "factors": {
                    "condition_impact": 0.95,
                    "age_impact": 0.88,
                    "location_demand": 1.12,
                    "seasonal_factor": 1.05
                },
                "market_trend": "stable"
            }
        }


class EquipmentRecommendation(BaseModel):
    """Single equipment recommendation"""
    equipment_id: str
    name: str
    type: str
    score: float = Field(..., ge=0, le=1, description="Recommendation score")
    price_per_hour: float
    location: str
    available: bool
    image_url: Optional[str] = None
    reason: str = Field(..., description="Why this was recommended")
    specifications: Optional[Dict[str, Any]] = None


class RecommendationResponse(BaseModel):
    """Response model for recommendations"""
    recommendations: List[EquipmentRecommendation]
    total_count: int
    algorithm_used: str = Field(..., description="Recommendation algorithm")
    
    class Config:
        json_schema_extra = {
            "example": {
                "recommendations": [
                    {
                        "equipment_id": "equip_789",
                        "name": "John Deere 6M Series Tractor",
                        "type": "tractor",
                        "score": 0.95,
                        "price_per_hour": 42.00,
                        "location": "Iowa",
                        "available": True,
                        "image_url": "https://example.com/image.jpg",
                        "reason": "Similar to your previous rentals and highly rated",
                        "specifications": {"horsepower": 145, "year": 2021}
                    }
                ],
                "total_count": 10,
                "algorithm_used": "hybrid_collaborative_content"
            }
        }


class ForecastDataPoint(BaseModel):
    """Single forecast data point"""
    date: str
    predicted_demand: float
    confidence_interval_lower: float
    confidence_interval_upper: float


class ForecastResponse(BaseModel):
    """Response model for demand forecasting"""
    equipment_type: str
    region: str
    forecast_data: List[ForecastDataPoint]
    overall_trend: str = Field(..., description="Overall trend (increasing, decreasing, stable)")
    peak_demand_date: Optional[str] = None
    seasonal_pattern: Optional[Dict[str, Any]] = None
    model_accuracy: float = Field(..., ge=0, le=1, description="Model accuracy score")
    
    class Config:
        json_schema_extra = {
            "example": {
                "equipment_type": "excavator",
                "region": "Texas",
                "forecast_data": [
                    {
                        "date": "2026-03-01",
                        "predicted_demand": 45.2,
                        "confidence_interval_lower": 38.5,
                        "confidence_interval_upper": 52.0
                    }
                ],
                "overall_trend": "increasing",
                "peak_demand_date": "2026-03-15",
                "seasonal_pattern": {"spring": 1.2, "summer": 1.4, "fall": 1.1, "winter": 0.8},
                "model_accuracy": 0.82
            }
        }


class ImageAnalysisResponse(BaseModel):
    """Response model for image analysis"""
    equipment_type: Optional[str] = None
    equipment_type_confidence: Optional[float] = None
    condition_assessment: Optional[str] = None
    condition_score: Optional[float] = Field(None, ge=0, le=100, description="Condition score 0-100")
    brand_identified: Optional[str] = None
    brand_confidence: Optional[float] = None
    detected_features: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
    
    class Config:
        json_schema_extra = {
            "example": {
                "equipment_type": "excavator",
                "equipment_type_confidence": 0.94,
                "condition_assessment": "good",
                "condition_score": 78.5,
                "brand_identified": "Caterpillar",
                "brand_confidence": 0.88,
                "detected_features": ["hydraulic arm", "tracks", "cab"],
                "recommendations": ["Suitable for medium-duty work", "Regular maintenance recommended"]
            }
        }


class ChatResponse(BaseModel):
    """Response model for chat"""
    message: str = Field(..., description="AI response")
    conversation_id: str
    suggested_actions: Optional[List[str]] = None
    equipment_suggestions: Optional[List[str]] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "Based on your farm size, I recommend a mid-range tractor with 100-150 horsepower. Would you like to see available options in your area?",
                "conversation_id": "conv_456",
                "suggested_actions": ["View tractors", "Compare prices", "Book consultation"],
                "equipment_suggestions": ["equip_123", "equip_456"]
            }
        }


class ErrorResponse(BaseModel):
    """Error response model"""
    error: str
    detail: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.now)


class ProjectAnalysisResponse(BaseModel):
    """Response model for multimodal project analysis"""
    work_type: str = Field(..., description="Classified type of work (e.g., Demolition, Excavation)")
    work_type_confidence: float = Field(..., ge=0, le=1, description="Confidence score for work type")
    required_machinery: List[str] = Field(..., description="List of required machinery types")
    estimated_cost_min: float = Field(..., description="Minimum estimated project cost")
    estimated_cost_max: float = Field(..., description="Maximum estimated project cost")
    estimated_duration_days: int = Field(..., ge=1, description="Estimated duration in days")
    difficulty_score: float = Field(..., ge=1, le=10, description="Project difficulty score from 1 to 10")
    suggested_providers: Optional[List[Dict[str, Any]]] = Field(default_factory=list, description="List of suggested providers or equipment matching the requirement")
    
    class Config:
        json_schema_extra = {
            "example": {
                "work_type": "Excavation and Land Clearing",
                "work_type_confidence": 0.92,
                "required_machinery": ["Excavator", "Bulldozer", "Dump Truck"],
                "estimated_cost_min": 45000.0,
                "estimated_cost_max": 80000.0,
                "estimated_duration_days": 5,
                "difficulty_score": 6.5,
                "suggested_providers": []
            }
        }

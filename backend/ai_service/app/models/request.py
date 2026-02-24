"""Pydantic models for API requests"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class PriceEstimateRequest(BaseModel):
    """Request model for price estimation"""
    equipment_type: str = Field(..., description="Type of equipment (e.g., tractor, excavator)")
    equipment_category: str = Field(..., description="Category (agriculture, construction, industrial)")
    condition: str = Field(..., description="Equipment condition (excellent, good, fair, poor)")
    age_years: float = Field(..., ge=0, description="Age of equipment in years")
    location: str = Field(..., description="Location (city or region)")
    duration_hours: Optional[int] = Field(None, description="Rental duration in hours")
    season: Optional[str] = Field(None, description="Season (spring, summer, fall, winter)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "equipment_type": "tractor",
                "equipment_category": "agriculture",
                "condition": "good",
                "age_years": 3.5,
                "location": "Iowa",
                "duration_hours": 48,
                "season": "spring"
            }
        }


class RecommendationRequest(BaseModel):
    """Request model for equipment recommendations"""
    user_id: str = Field(..., description="User ID")
    current_equipment_id: Optional[str] = Field(None, description="Current equipment being viewed")
    user_role: str = Field(..., description="User role (customer, organization, provider)")
    location: Optional[str] = Field(None, description="User location")
    limit: int = Field(10, ge=1, le=50, description="Number of recommendations")
    
    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user_123",
                "current_equipment_id": "equip_456",
                "user_role": "customer",
                "location": "California",
                "limit": 10
            }
        }


class ForecastRequest(BaseModel):
    """Request model for demand forecasting"""
    equipment_type: str = Field(..., description="Equipment type to forecast")
    region: str = Field(..., description="Geographic region")
    forecast_days: int = Field(30, ge=7, le=365, description="Number of days to forecast")
    include_seasonality: bool = Field(True, description="Include seasonal trends")
    
    class Config:
        json_schema_extra = {
            "example": {
                "equipment_type": "excavator",
                "region": "Texas",
                "forecast_days": 90,
                "include_seasonality": True
            }
        }


class ImageAnalysisRequest(BaseModel):
    """Request model for image analysis (file upload handled separately)"""
    analyze_condition: bool = Field(True, description="Assess equipment condition")
    detect_type: bool = Field(True, description="Detect equipment type")
    identify_brand: bool = Field(False, description="Identify brand/model")


class ChatMessage(BaseModel):
    """Chat message model"""
    message: str = Field(..., min_length=1, max_length=1000, description="User message")
    user_id: Optional[str] = Field(None, description="User ID for context")
    conversation_id: Optional[str] = Field(None, description="Conversation ID")
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "I need a tractor for my farm, what do you recommend?",
                "user_id": "user_123",
                "conversation_id": "conv_456"
            }
        }


class EquipmentData(BaseModel):
    """Equipment data model"""
    id: str
    name: str
    type: str
    category: str
    condition: str
    price_per_hour: float
    location: str
    available: bool
    image_url: Optional[str] = None
    specifications: Optional[Dict[str, Any]] = None


class ProjectAnalysisRequest(BaseModel):
    """Request model for multimodal project analysis (metadata for multipart request)"""
    description: Optional[str] = Field(None, description="Text description of the project")
    location: Optional[str] = Field(None, description="Project location")
    analyze_video: bool = Field(False, description="Whether to extract and analyze frames from an uploaded video")
    
    class Config:
        json_schema_extra = {
            "example": {
                "description": "Clearing 2 acres of rocky farmland",
                "location": "Texas",
                "analyze_video": True
            }
        }

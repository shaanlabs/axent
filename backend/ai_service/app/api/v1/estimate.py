"""Price estimation API endpoint"""
from fastapi import APIRouter, HTTPException
from app.models.request import PriceEstimateRequest
from app.models.response import PriceEstimateResponse, ErrorResponse
from app.core.pricing.estimator import get_estimator
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/price", response_model=PriceEstimateResponse)
async def estimate_price(request: PriceEstimateRequest):
    """
    Estimate equipment rental price based on various factors
    
    - **equipment_type**: Type of equipment (e.g., tractor, excavator)
    - **condition**: Equipment condition (excellent, good, fair, poor)
    - **age_years**: Age of equipment in years
    - **location**: Geographic location
    - **duration_hours**: Optional rental duration
    - **season**: Optional season (spring, summer, fall, winter)
    """
    try:
        logger.info(f"Price estimation request for {request.equipment_type}")
        
        estimator = get_estimator()
        result = estimator.estimate(
            equipment_type=request.equipment_type,
            condition=request.condition,
            age_years=request.age_years,
            location=request.location,
            season=request.season,
            duration_hours=request.duration_hours
        )
        
        return PriceEstimateResponse(**result)
    
    except Exception as e:
        logger.error(f"Error in price estimation: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health():
    """Health check for price estimation service"""
    return {"status": "healthy", "service": "price_estimation"}

"""Demand forecasting API endpoint"""
from fastapi import APIRouter, HTTPException
from app.models.request import ForecastRequest
from app.models.response import ForecastResponse
from app.core.forecasting.demand import get_forecaster
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/demand", response_model=ForecastResponse)
async def forecast_demand(request: ForecastRequest):
    """
    Forecast equipment demand for a specified period
    
    - **equipment_type**: Type of equipment to forecast
    - **region**: Geographic region
    - **forecast_days**: Number of days to forecast (7-365, default 30)
    - **include_seasonality**: Whether to include seasonal patterns
    """
    try:
        logger.info(f"Forecast request for {request.equipment_type} in {request.region}")
        
        forecaster = get_forecaster()
        result = forecaster.forecast(
            equipment_type=request.equipment_type,
            region=request.region,
            forecast_days=request.forecast_days,
            include_seasonality=request.include_seasonality
        )
        
        return ForecastResponse(**result)
    
    except Exception as e:
        logger.error(f"Error in forecasting: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health():
    """Health check for forecasting service"""
    return {"status": "healthy", "service": "demand_forecasting"}

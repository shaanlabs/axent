"""Equipment recommendation API endpoint"""
from fastapi import APIRouter, HTTPException
from app.models.request import RecommendationRequest
from app.models.response import RecommendationResponse
from app.core.recommendations.hybrid import get_recommender
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/equipment", response_model=RecommendationResponse)
async def recommend_equipment(request: RecommendationRequest):
    """
    Get personalized equipment recommendations
    
    - **user_id**: User identifier
    - **user_role**: User role (customer, organization, provider, admin)
    - **current_equipment_id**: Optional - Equipment currently being viewed
    - **location**: Optional - User location for local recommendations
    - **limit**: Number of recommendations (1-50, default 10)
    """
    try:
        logger.info(f"Recommendation request for user {request.user_id}")
        
        recommender = get_recommender()
        result = recommender.recommend(
            user_id=request.user_id,
            user_role=request.user_role,
            current_equipment_id=request.current_equipment_id,
            location=request.location,
            limit=request.limit
        )
        
        return RecommendationResponse(**result)
    
    except Exception as e:
        logger.error(f"Error in recommendations: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health():
    """Health check for recommendation service"""
    return {"status": "healthy", "service": "recommendations"}

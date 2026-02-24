from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from typing import Optional
from pydantic import BaseModel
from app.models.response import ProjectAnalysisResponse, ErrorResponse
from app.core.vision.detector import get_analyzer
from app.core.vision.video import get_video_processor
from app.core.estimator.project import get_estimator
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post(
    "/analyze-project",
    response_model=ProjectAnalysisResponse,
    responses={
        400: {"model": ErrorResponse},
        500: {"model": ErrorResponse}
    },
    summary="Multimodal Project Analysis",
    description="Analyzes an uploaded image or video along with text to estimate project details and costs."
)
async def analyze_project(
    description: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    file: UploadFile = File(...),
):
    """
    Multimodal project analysis endpoint
    Accepts images or videos (mp4, avi, mov) plus optional metadata
    """
    try:
        content = await file.read()
        filename = file.filename.lower()
        
        vision_analyzer = get_analyzer()
        
        if filename.endswith(('.mp4', '.avi', '.mov', '.mkv')):
            logger.info(f"Processing video file: {filename}")
            video_processor = get_video_processor()
            frames = await video_processor.extract_frames(content) # Use default max_frames=15
            if not frames:
                raise HTTPException(status_code=400, detail="Could not extract frames from video.")
            vision_data = await vision_analyzer.analyze_project_frames(frames)
            
        elif filename.endswith(('.jpg', '.jpeg', '.png', '.webp')):
            logger.info(f"Processing image file: {filename}")
            vision_data = await vision_analyzer.analyze_project_frames([content])
            
        else:
             raise HTTPException(status_code=400, detail="Unsupported file format. Please upload jpg, png, or mp4.")
             
        logger.info(f"Vision analysis complete. Extracted data: {vision_data}")
        
        # Now pass to the core ProjectEstimator
        estimator = get_estimator()
        estimation_result = await estimator.estimate_project(
             description=description or "",
             location=location or "",
             vision_data=vision_data
        )
        
        if not estimation_result:
             raise HTTPException(status_code=500, detail="Project estimation engine failed to return a valid result.")
             
        return estimation_result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Project analysis failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during analysis: {str(e)}"
        )


class FeedbackRequest(BaseModel):
    project_id: str
    actual_cost: float
    actual_duration: int
    visual_embedding: list
    text_embedding: list
    metadata: Optional[dict] = {}

    
@router.post("/feedback", response_model=dict, summary="Continual Learning Feedback Loop")
async def log_feedback(request: FeedbackRequest):
    """
    Log actual project outcomes (cost/duration) alongside original embeddings
    to ChromaDB for the offline Keras continual learning retraining loop.
    """
    from app.core.vector.db import get_vdb_manager
    vdb = get_vdb_manager()
    success = vdb.log_project_history(
        project_id=request.project_id,
        visual_emb=request.visual_embedding,
        text_emb=request.text_embedding,
        actual_cost=request.actual_cost,
        actual_duration=request.actual_duration,
        metadata=request.metadata
    )
    if not success:
        raise HTTPException(status_code=500, detail="Failed to log project history to Vector DB")
    return {"status": "success", "message": "Feedback logged for continual learning."}

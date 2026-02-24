"""Image analysis API endpoint"""
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from app.models.response import ImageAnalysisResponse
from app.core.vision.detector import get_analyzer
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/analyze", response_model=ImageAnalysisResponse)
async def analyze_image(
    file: UploadFile = File(..., description="Equipment image to analyze"),
    analyze_condition: bool = Form(True, description="Assess equipment condition"),
    detect_type: bool = Form(True, description="Detect equipment type"),
    identify_brand: bool = Form(False, description="Identify brand/model")
):
    """
    Analyze equipment image using computer vision
    
    - **file**: Image file (JPEG, PNG)
    - **analyze_condition**: Whether to assess condition
    - **detect_type**: Whether to detect equipment type
    - **identify_brand**: Whether to identify brand
    """
    try:
        # Validate file type
        if file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Please upload JPEG or PNG image."
            )
        
        logger.info(f"Image analysis request for file: {file.filename}")
        
        # Read image bytes
        image_bytes = await file.read()
        
        # Analyze image
        analyzer = get_analyzer()
        result = await analyzer.analyze_image(
            image_bytes=image_bytes,
            analyze_condition=analyze_condition,
            detect_type=detect_type,
            identify_brand=identify_brand
        )
        
        return ImageAnalysisResponse(**result)
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in image analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health():
    """Health check for vision service"""
    return {"status": "healthy", "service": "image_analysis"}

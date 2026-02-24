"""FastAPI main application"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging

from app.config import settings
from app.api.v1 import estimate, recommend, forecast, vision, chat, analyzer

# Configure logging
logging.basicConfig(level=settings.LOG_LEVEL)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    logger.info("🚀 Starting AXENT AI Service...")
    logger.info(f"📊 Model directory: {settings.MODEL_DIR}")
    logger.info(f"🔧 Debug mode: {settings.DEBUG}")
    
    # Load ML models on startup
    try:
        logger.info("🤖 Loading AI models...")
        # Models will be loaded lazily on first request for faster startup
        logger.info("✅ AI Service ready!")
    except Exception as e:
        logger.error(f"❌ Error loading models: {e}")
    
    yield
    
    # Cleanup on shutdown
    logger.info("🛑 Shutting down AI Service...")


# Create FastAPI app
app = FastAPI(
    title="AXENT AI Service",
    description="Equipment Rental Intelligence Platform - Advanced AI Backend",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS if not settings.DEBUG else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return JSONResponse(
        content={
            "status": "healthy",
            "service": "AXENT AI Service",
            "version": "1.0.0"
        }
    )


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AXENT AI Service",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }


# Include API routers
app.include_router(estimate.router, prefix=f"{settings.API_PREFIX}/estimate", tags=["Price Estimation"])
app.include_router(recommend.router, prefix=f"{settings.API_PREFIX}/recommend", tags=["Recommendations"])
app.include_router(forecast.router, prefix=f"{settings.API_PREFIX}/forecast", tags=["Forecasting"])
app.include_router(vision.router, prefix=f"{settings.API_PREFIX}/vision", tags=["Image Analysis"])
app.include_router(chat.router, prefix=f"{settings.API_PREFIX}/chat", tags=["NLP Chatbot"])
app.include_router(analyzer.router, prefix=f"{settings.API_PREFIX}/analyzer", tags=["Project Analyzer"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.DEBUG
    )

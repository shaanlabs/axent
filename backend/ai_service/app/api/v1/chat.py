"""NLP chatbot API endpoint"""
from fastapi import APIRouter, HTTPException
from app.models.request import ChatMessage
from app.models.response import ChatResponse
from app.core.nlp.chatbot import get_chatbot
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/message", response_model=ChatResponse)
async def send_message(request: ChatMessage):
    """
    Send a message to the AI chatbot
    
    - **message**: User message (1-1000 characters)
    - **user_id**: Optional user identifier for context
    - **conversation_id**: Optional conversation identifier
    """
    try:
        logger.info(f"Chat message from user {request.user_id}: {request.message[:50]}...")
        
        chatbot = get_chatbot()
        result = await chatbot.chat(
            message=request.message,
            user_id=request.user_id,
            conversation_id=request.conversation_id
        )
        
        return ChatResponse(**result)
    
    except Exception as e:
        logger.error(f"Error in chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health():
    """Health check for chat service"""
    return {"status": "healthy", "service": "nlp_chatbot"}

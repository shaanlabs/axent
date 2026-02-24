"""NLP chatbot for equipment rental assistance"""
import random
import uuid
import os
import httpx
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)


class EquipmentChatbot:
    """Conversational AI for equipment rental assistance"""
    
    def __init__(self):
        """Initialize chatbot"""
        self.equipment_keywords = {
            "tractor": ["farm", "agriculture", "plow", "till", "plant"],
            "excavator": ["dig", "excavate", "construction", "foundation"],
            "bulldozer": ["clear", "level", "grade", "push"],
            "crane": ["lift", "hoist", "tall", "heavy"],
        }
        
        self.hf_token = os.environ.get("HUGGINGFACE_TOKEN", "")
        self.ollama_base_url = os.environ.get("OLLAMA_BASE_URL", "http://localhost:11434")
        self.use_hf = bool(self.hf_token)
        
        # Free Tier HF Models (Instruct models are best for chat)
        self.hf_model = "mistralai/Mistral-7B-Instruct-v0.2"
        self.ollama_model = "llama3"

        self.system_prompt = (
            "You are a helpful equipment rental assistant for AXENT. "
            "Help users find, compare, and get pricing estimates for equipment "
            "like tractors, excavators, and bulldozers. Be concise."
        )
        logger.info(f"EquipmentChatbot initialized. Using {'Hugging Face API' if self.use_hf else 'Ollama Local'}")
    
    async def chat(
        self,
        message: str,
        user_id: Optional[str] = None,
        conversation_id: Optional[str] = None
    ) -> dict:
        """Process chat message and generate response using AI"""
        if not conversation_id:
            conversation_id = f"conv_{uuid.uuid4().hex[:12]}"
        
        intent = self._detect_intent(message)
        suggested_actions = self._get_suggested_actions(intent)
        equipment_suggestions = self._get_equipment_suggestions(message, intent)
        
        response_text = await self._generate_llm_response(message)
        
        return {
            "message": response_text,
            "conversation_id": conversation_id,
            "suggested_actions": suggested_actions,
            "equipment_suggestions": equipment_suggestions
        }

    async def _generate_llm_response(self, message: str) -> str:
        """Call Hugging Face or Ollama for the text response."""
        prompt = f"<s>[INST] {self.system_prompt}\nUser: {message} [/INST] "
        
        if self.use_hf:
            url = f"https://api-inference.huggingface.co/models/{self.hf_model}"
            headers = {"Authorization": f"Bearer {self.hf_token}"}
            payload = {
                "inputs": prompt,
                "parameters": {"max_new_tokens": 150, "temperature": 0.7, "return_full_text": False}
            }
            try:
                async with httpx.AsyncClient() as client:
                    response = await client.post(url, headers=headers, json=payload, timeout=10.0)
                    if response.status_code == 200:
                        return response.json()[0]["generated_text"].strip()
                    else:
                        logger.error(f"HF API Error: {response.text}")
            except Exception as e:
                logger.error(f"Error calling HF API: {e}")
        
        # Fallback to Ollama
        try:
            url = f"{self.ollama_base_url}/api/generate"
            payload = {
                "model": self.ollama_model,
                "prompt": f"{self.system_prompt}\n\nUser: {message}\nAssistant:",
                "stream": False,
                "options": {"temperature": 0.7}
            }
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=payload, timeout=10.0)
                if response.status_code == 200:
                    return response.json().get("response", "").strip()
                else:
                    logger.error(f"Ollama API Error: {response.text}")
        except Exception as e:
            logger.error(f"Error calling Ollama API: {e}")
            
        return "I'm your equipment rental assistant! While my AI engines are warming up, I can tell you we have a great selection of tractors, excavators, and more. What are you looking for?"
    
    def _detect_intent(self, message: str) -> str:
        """Detect user intent from message using keywords"""
        message_lower = message.lower()
        if any(word in message_lower for word in ["price", "cost", "rate", "how much"]):
            return "pricing_inquiry"
        elif any(word in message_lower for word in ["recommend", "suggest", "need", "looking for"]):
            return "equipment_recommendation"
        elif any(word in message_lower for word in ["book", "rent", "reserve"]):
            return "booking_intent"
        elif any(word in message_lower for word in ["compare", "difference", "versus", "vs"]):
            return "comparison"
        elif any(word in message_lower for word in ["help", "how", "guide", "tutorial"]):
            return "help_request"
        else:
            return "general_inquiry"
    
    def _get_suggested_actions(self, intent: str) -> List[str]:
        """Get suggested actions based on intent"""
        actions = {
            "pricing_inquiry": ["Get price estimate", "View equipment catalog", "Compare prices"],
            "equipment_recommendation": ["Browse equipment", "Take equipment quiz", "Contact expert"],
            "booking_intent": ["View available equipment", "Check calendar", "Start booking"],
            "comparison": ["Compare equipment", "View specifications", "See reviews"],
            "help_request": ["View FAQ", "Watch tutorial", "Contact support"],
            "general_inquiry": ["Browse catalog", "Get recommendations", "View pricing"],
        }
        return actions.get(intent, actions["general_inquiry"])
    
    def _get_equipment_suggestions(self, message: str, intent: str) -> Optional[List[str]]:
        """Get equipment suggestions if relevant"""
        if intent not in ["equipment_recommendation", "general_inquiry", "pricing_inquiry"]:
            return None
        
        message_lower = message.lower()
        suggestions = []
        
        for equipment, keywords in self.equipment_keywords.items():
            if any(keyword in message_lower for keyword in keywords) or equipment in message_lower:
                suggestions.append(f"equip_{equipment}")
        
        if not suggestions:
            suggestions = ["equip_001", "equip_002", "equip_003"]
        
        return suggestions[:3]


# Global instance
_chatbot = None


def get_chatbot() -> EquipmentChatbot:
    """Get or create the global chatbot instance"""
    global _chatbot
    if _chatbot is None:
        _chatbot = EquipmentChatbot()
    return _chatbot

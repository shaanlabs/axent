"""Multimodal AI project estimator"""
import os
import json
import httpx
import logging
from typing import Dict, Any, Optional

try:
    from sentence_transformers import SentenceTransformer
    HAS_ML = True
except ImportError:
    HAS_ML = False

try:
    from app.core.estimator.keras_model import get_keras_estimator
    HAS_KERAS = True
except ImportError:
    HAS_KERAS = False

logger = logging.getLogger(__name__)

class ProjectEstimator:
    """Core engine combining LLM and Vision outputs to estimate project requirements and costs."""

    def __init__(self):
        self.hf_token = os.environ.get("HUGGINGFACE_TOKEN", "")
        self.ollama_base_url = os.environ.get("OLLAMA_BASE_URL", "http://localhost:11434")
        self.use_hf = bool(self.hf_token)
        self.hf_model = "mistralai/Mistral-7B-Instruct-v0.2"
        self.ollama_model = "llama3"
        
        if HAS_ML:
            try:
                self.encoder = SentenceTransformer('intfloat/multilingual-e5-small')
                logger.info("ProjectEstimator: multilingual-e5-small loaded for text embeddings.")
            except Exception as e:
                logger.error(f"Failed to load SentenceTransformer: {e}")
                self.encoder = None
        else:
            self.encoder = None
            
        if HAS_KERAS:
            self.keras_model = get_keras_estimator()
        else:
            self.keras_model = None
            
        logger.info("ProjectEstimator initialized.")

    async def estimate_project(
        self,
        description: str,
        location: str,
        vision_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generate a complete project estimate based on text and vision context."""
        
        # Merge contexts for the LLM prompt
        vis_work_type = vision_data.get("work_type", "unknown")
        vis_equipment = vision_data.get("detected_equipment", [])
        vis_cond = vision_data.get("overall_condition_score", 0.0)
        
        system_prompt = (
             "You are an expert construction and agriculture project estimator. "
             "Analyze the provided text description along with the visual data extracted from uploaded images/videos. "
             "Output ONLY a valid JSON object with the following schema:\n"
             "{\n"
             '  "work_type": "string (e.g. Demolition, Excavation)",\n'
             '  "required_machinery": ["string"],\n'
             '  "estimated_cost_min": float (in rupees ₹),\n'
             '  "estimated_cost_max": float (in rupees ₹),\n'
             '  "estimated_duration_days": int,\n'
             '  "difficulty_score": float (1.0 to 10.0)\n'
             "}\n"
             "Do not include any explanation, only JSON."
        )

        user_context = (
             f"Project Description: {description or 'None provided.'}\n"
             f"Location: {location or 'Unknown'}\n"
             f"Vision Engine Detected Work Type: {vis_work_type}\n"
             f"Vision Engine Detected Equipment on site: {', '.join(vis_equipment) if vis_equipment else 'None'}\n"
        )
        
        prompt = f"<s>[INST] {system_prompt}\n\nContext:\n{user_context}\n[/INST]"
        response_json = await self._generate_json(prompt)
        
        if not response_json:
             # Fallback estimation if LLM parsing fails
             return self._fallback_estimate(description, vis_work_type, vis_equipment)
             
        # Merge confidence scores from vision model
        response_json["work_type_confidence"] = vision_data.get("work_type_confidence", 0.85)
        response_json["suggested_providers"] = [] # To be filled by recommender later
        
        # Pass through the visual embedding
        if "visual_embedding" in vision_data:
            response_json["visual_embedding"] = vision_data["visual_embedding"]
            
        # Add text embedding extraction using multilingual-e5
        if self.encoder and description:
            try:
                emb = self.encoder.encode([f"passage: {description}"])
                response_json["text_embedding"] = emb[0].tolist()
            except Exception as e:
                logger.error(f"Text embedding failed: {e}")
                response_json["text_embedding"] = None
        else:
            response_json["text_embedding"] = None
            
        # Override the generative cost & duration heuristics with the Keras regression model
        if self.keras_model:
            keras_cost, keras_duration = self.keras_model.predict(
                visual_emb=response_json.get("visual_embedding"),
                text_emb=response_json.get("text_embedding")
            )
            response_json["estimated_cost_min"] = round(keras_cost * 0.9, 2)
            response_json["estimated_cost_max"] = round(keras_cost * 1.1, 2)
            response_json["estimated_duration_days"] = keras_duration
        
        return response_json

    async def _generate_json(self, prompt: str) -> Optional[Dict[str, Any]]:
        """Call LLM and parse JSON response."""
        response_text = ""
        if self.use_hf:
            try:
                url = f"https://api-inference.huggingface.co/models/{self.hf_model}"
                headers = {"Authorization": f"Bearer {self.hf_token}"}
                payload = {
                    "inputs": prompt,
                    "parameters": {"max_new_tokens": 300, "temperature": 0.2, "return_full_text": False}
                }
                async with httpx.AsyncClient() as client:
                    resp = await client.post(url, headers=headers, json=payload, timeout=20.0)
                    if resp.status_code == 200:
                        response_text = resp.json()[0]["generated_text"].strip()
            except Exception as e:
                logger.error(f"HF API JSON Error: {e}")
                
        if not response_text:
            # Fallback to Ollama
            try:
                url = f"{self.ollama_base_url}/api/generate"
                payload = {
                    "model": self.ollama_model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {"temperature": 0.2}
                }
                async with httpx.AsyncClient() as client:
                    resp = await client.post(url, json=payload, timeout=20.0)
                    if resp.status_code == 200:
                        response_text = resp.json().get("response", "").strip()
            except Exception as e:
                logger.error(f"Ollama API JSON Error: {e}")
                
        if not response_text:
            return None
            
        # Clean up Markdown JSON formatting if present
        if "```json" in response_text:
             response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
             response_text = response_text.split("```")[1].split("```")[0].strip()

        try:
             return json.loads(response_text)
        except json.JSONDecodeError as e:
             logger.error(f"Failed to parse JSON from LLM: {e}. Raw Text: {response_text}")
             return None

    def _fallback_estimate(self, text: str, vis_work: str, vis_eq: list) -> Dict[str, Any]:
        """Static fallback estimate if LLMs fail"""
        return {
            "work_type": vis_work.capitalize() if vis_work != "unknown" else "General Construction",
            "work_type_confidence": 0.5,
            "required_machinery": vis_eq if vis_eq else ["Excavator", "Tractor"],
            "estimated_cost_min": 25000.0,
            "estimated_cost_max": 75000.0,
            "estimated_duration_days": 7,
            "difficulty_score": 5.0,
            "suggested_providers": []
        }

# Global instance
_estimator = None

def get_estimator() -> ProjectEstimator:
    """Get or create the global estimator instance"""
    global _estimator
    if _estimator is None:
        _estimator = ProjectEstimator()
    return _estimator

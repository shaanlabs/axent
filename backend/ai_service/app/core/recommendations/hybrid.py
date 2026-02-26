import random
import os
import logging
import numpy as np
from typing import List, Dict, Any

try:
    from sentence_transformers import SentenceTransformer
    from sklearn.metrics.pairwise import cosine_similarity
    HAS_ML = True
except ImportError:
    HAS_ML = False

logger = logging.getLogger(__name__)


class RecommendationEngine:
    """Hybrid recommendation system for equipment using AI Embeddings"""
    
    def __init__(self):
        """Initialize recommendation engine"""
        url = os.environ.get("SUPABASE_URL")
        key = os.environ.get("SUPABASE_SERVICE_KEY")
        if url and key:
            try:
                from supabase import create_client
                self.supabase = create_client(url, key)
                logger.info("Supabase client initialized for Recommendations.")
            except Exception as e:
                logger.error(f"Failed to initialize Supabase: {e}")
                self.supabase = None
        else:
            self.supabase = None
            logger.warning("No SUPABASE_URL found. Will use mock data.")
            
        self.equipment_db = self._get_equipment_data()
        
        if HAS_ML:
            try:
                # Load lightweight local multilingual text embedding model
                self.model = SentenceTransformer('intfloat/multilingual-e5-small')
                self._compute_equipment_embeddings()
                logger.info("SentenceTransformers (multilingual-e5-small) loaded for semantic recommendations.")
            except Exception as e:
                logger.warning(f"Failed to load SentenceTransformers: {e}")
                self.model = None
                HAS_ML = False
        else:
            self.model = None
            logger.info("ML packages omitted. Using heuristic recommendations.")
            
        logger.info("RecommendationEngine initialized")

    def _compute_equipment_embeddings(self):
        """Pre-compute embeddings for all mock equipment"""
        texts = [
            f"passage: {e['name']} {e['category']} {e['type']} {e.get('specifications', {}).get('horsepower', '')} HP" 
            for e in self.equipment_db
        ]
        self.embeddings = self.model.encode(texts)
    
    def _get_equipment_data(self) -> List[Dict[str, Any]]:
        """Fetch real equipment data from Supabase or fallback to mock"""
        if self.supabase:
            try:
                response = self.supabase.table("equipment").select(
                    "id, name, type, category, pricing, location, available, verification_status, reliability_score, image_url, specifications"
                ).is_("deleted_at", "null").execute()
                
                db_equipment = []
                for row in response.data:
                    price = row.get("pricing", {}).get("per_hour", 50) if isinstance(row.get("pricing"), dict) else 50
                    loc = row.get("location", {})
                    loc_str = loc.get("city", "Unknown") if isinstance(loc, dict) else str(loc)
                    
                    db_equipment.append({
                        "equipment_id": str(row["id"]),
                        "name": row.get("name", "Unknown Equipment"),
                        "type": row.get("type", "unknown"),
                        "category": row.get("category", "unknown"),
                        "price_per_hour": price,
                        "location": loc_str,
                        "available": row.get("available", False),
                        "verification_status": row.get("verification_status", "unverified"),
                        "reliability_score": float(row.get("reliability_score") or 5.0),
                        "rating": float(row.get("reliability_score") or 5.0), # Using reliability as rating surrogate for logic
                        "total_rentals": 0,
                        "image_url": row.get("image_url", ""),
                        "specifications": row.get("specifications", {})
                    })
                if db_equipment:
                    return db_equipment
            except Exception as e:
                logger.error(f"Failed to fetch equipment from DB: {e}")
                
        return self._create_mock_equipment()

    def _create_mock_equipment(self) -> List[Dict[str, Any]]:
        """Create mock equipment data for demo"""
        equipment_types = [
            ("John Deere 6M Series Tractor", "tractor", "agriculture"),
            ("Caterpillar 320 Excavator", "excavator", "construction"),
            ("Bobcat S650 Skid Steer", "skid_steer", "construction"),
            ("Case IH Magnum Tractor", "tractor", "agriculture"),
            ("Komatsu PC210 Excavator", "excavator", "construction"),
            ("New Holland T7 Series", "tractor", "agriculture"),
            ("JCB 3CX Backhoe", "backhoe", "construction"),
            ("Kubota M7 Tractor", "tractor", "agriculture"),
            ("Volvo EC220 Excavator", "excavator", "construction"),
            ("Massey Ferguson 7700 Series", "tractor", "agriculture"),
        ]
        
        equipment = []
        for idx, (name, equip_type, category) in enumerate(equipment_types):
            equipment.append({
                "equipment_id": f"equip_{idx + 1:03d}",
                "name": name,
                "type": equip_type,
                "category": category,
                "price_per_hour": round(random.uniform(35, 120), 2),
                "location": random.choice(["Iowa", "Texas", "California", "Florida"]),
                "available": random.choice([True, True, True, False]),
                "verification_status": random.choice(["verified", "verified", "unverified", "flagged"]),
                "reliability_score": round(random.uniform(2.5, 5.0), 2),
                "rating": round(random.uniform(3.5, 5.0), 1),
                "total_rentals": random.randint(10, 500),
                "image_url": f"https://example.com/equipment/{idx + 1}.jpg",
                "specifications": {
                    "year": random.randint(2018, 2024),
                    "horsepower": random.randint(80, 200)
                }
            })
        return equipment
    
    def recommend(
        self,
        user_id: str,
        user_role: str,
        current_equipment_id: str = None,
        location: str = None,
        limit: int = 10
    ) -> Dict[str, Any]:
        """Generate equipment recommendations using embeddings and filtering"""
        # Always fetch fresh data per request
        self.equipment_db = self._get_equipment_data()
        if HAS_ML and self.model:
            self._compute_equipment_embeddings()

        recommendations = []
        candidates = self.equipment_db.copy()

        # Hyperlocal Liquidity Control (Component E)
        # We enforce strictly local matching first to build density.
        if location:
            local_equipment = [e for e in candidates if location.lower() in e["location"].lower()]
            # Only show out-of-region equipment if there is zero local liquidity
            if len(local_equipment) > 0:
                candidates = local_equipment
            else:
                logger.warning(f"No local liquidity found for {location}. Falling back to broader region.")
                # We could implement a radius expansion here, but for now we just fallback to all
                candidates = candidates
        
        similarities = None
        # Use Semantic Search if we have an item to anchor on
        if current_equipment_id and self.model:
            current_idx = next((i for i, e in enumerate(self.equipment_db) if e["equipment_id"] == current_equipment_id), None)
            if current_idx is not None:
                # Calculate cosine similarity between current item and all others
                target_embedding = self.embeddings[current_idx].reshape(1, -1)
                similarities = cosine_similarity(target_embedding, self.embeddings)[0]
        
        # Calculate scores
        for idx, equipment in enumerate(self.equipment_db):
            if equipment["equipment_id"] == current_equipment_id:
                continue # Skip the current item
                
            # Base heuristic score
            score = self._calculate_heuristic_score(equipment, user_role, location)
            reason_base = []
            
            # Blend in semantic similarity score
            if similarities is not None:
                sim_score = similarities[idx]
                # Boost total score significantly based on ML similarity
                score = (score * 0.4) + (float(sim_score) * 0.6)
                if sim_score > 0.6:
                     reason_base.append("high structural similarity")
            elif current_equipment_id:
                 current = next((e for e in self.equipment_db if e["equipment_id"] == current_equipment_id), None)
                 if current and current["type"] == equipment["type"]:
                     score += 0.2
                     reason_base.append("same equipment type")

            reason = self._generate_reason(equipment, user_role, location, reason_base)
            
            recommendations.append({
                "equipment_id": equipment["equipment_id"],
                "name": equipment["name"],
                "type": equipment["type"],
                "score": score,
                "price_per_hour": equipment["price_per_hour"],
                "location": equipment["location"],
                "available": equipment["available"],
                "verification_status": equipment.get("verification_status", "unverified"),
                "reliability_score": equipment.get("reliability_score", 5.0),
                "image_url": equipment["image_url"],
                "reason": reason,
                "specifications": equipment["specifications"]
            })
        
        recommendations.sort(key=lambda x: x["score"], reverse=True)
        
        return {
            "recommendations": recommendations[:limit],
            "total_count": len(recommendations),
            "algorithm_used": "semantic_similarity" if (similarities is not None) else "heuristic"
        }
    
    def _calculate_heuristic_score(self, equipment: Dict, user_role: str, location: str = None) -> float:
        """Calculate heuristic base score"""
        score = 0.5 
        if equipment.get("rating", 0) >= 4.5:
            score += 0.15
        if equipment.get("available", False):
            score += 0.10
        if location and location.lower() in equipment["location"].lower():
            score += 0.15
        if user_role == "customer" and equipment["category"] == "agriculture":
            score += 0.10
            
        # Add Trust & Reliability Penalty/Boost
        reliability = equipment.get("reliability_score", 5.0)
        verification = equipment.get("verification_status", "unverified")
        
        if reliability >= 4.5:
            score += 0.15
        elif reliability < 3.5:
            score -= 0.30  # Heavy penalty for unreliability
            
        if verification == "verified":
            score += 0.20
        elif verification == "flagged":
            score -= 0.50  # Severe penalty for fake availability
            
        score += random.uniform(0, 0.05)
        return min(1.0, max(0.0, score))
    
    def _generate_reason(self, equipment: Dict, user_role: str, location: str = None, extra_reasons: List[str] = None) -> str:
        """Generate recommendation reason text"""
        reasons = extra_reasons or []
        
        if equipment.get("verification_status") == "verified":
            reasons.append("verified real-time availability")
        if equipment.get("reliability_score", 0) >= 4.5:
            reasons.append("highly reliable provider")
        if equipment.get("rating", 0) >= 4.6:
            reasons.append("stellar customer ratings")
        if location and location.lower() in equipment["location"].lower():
            reasons.append("available locally")
        if equipment.get("total_rentals", 0) > 300:
            reasons.append("proven reliability")
            
        if not reasons:
            reasons.append("matches your usage profile")
        
        return "Recommended because it has " + " and ".join(reasons)


# Global instance
_recommender = None


def get_recommender() -> RecommendationEngine:
    """Get or create the global recommendation engine instance"""
    global _recommender
    if _recommender is None:
        _recommender = RecommendationEngine()
    return _recommender

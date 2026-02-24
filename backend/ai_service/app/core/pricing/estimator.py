"""Price estimation core logic"""
import numpy as np
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)


class PriceEstimator:
    """Equipment price estimation using ML models"""
    
    def __init__(self):
        """Initialize the price estimator"""
        self.model = None
        self.base_prices = {
            # Agriculture
            "tractor": 45.0,
            "harvester": 85.0,
            "planter": 35.0,
            "sprayer": 40.0,
            # Construction
            "excavator": 95.0,
            "bulldozer": 110.0,
            "crane": 150.0,
            "forklift": 55.0,
            # Industrial
            "generator": 30.0,
            "compressor": 25.0,
            "welder": 20.0,
        }
        
        self.condition_multipliers = {
            "excellent": 1.2,
            "good": 1.0,
            "fair": 0.8,
            "poor": 0.6,
        }
        
        self.seasonal_multipliers = {
            "spring": 1.15,  # High demand for agriculture
            "summer": 1.1,
            "fall": 1.05,
            "winter": 0.9,
        }
        
        logger.info("PriceEstimator initialized")
    
    def estimate(
        self,
        equipment_type: str,
        condition: str,
        age_years: float,
        location: str,
        season: str = None,
        duration_hours: int = None
    ) -> Dict[str, Any]:
        """
        Estimate equipment price
        
        This is a simplified model. In production, this would use:
        - XGBoost trained on historical rental data
        - Feature engineering (location demand, seasonality, etc.)
        - Market trend analysis
        """
        # Get base price
        equipment_type_lower = equipment_type.lower()
        base_price = self.base_prices.get(equipment_type_lower, 50.0)
        
        # Apply condition multiplier
        condition_mult = self.condition_multipliers.get(condition.lower(), 1.0)
        
        # Apply age depreciation (5% per year, max 50%)
        age_mult = max(0.5, 1.0 - (age_years * 0.05))
        
        # Apply seasonal multiplier
        seasonal_mult = 1.0
        if season:
            seasonal_mult = self.seasonal_multipliers.get(season.lower(), 1.0)
        
        # Location demand factor (simplified - would use real data)
        location_mult = self._get_location_multiplier(location)
        
        # Calculate estimated price
        estimated_price = base_price * condition_mult * age_mult * seasonal_mult * location_mult
        
        # Add some variance for price range
        variance = estimated_price * 0.12
        price_min = max(10.0, estimated_price - variance)
        price_max = estimated_price + variance
        
        # Calculate confidence score (simplified)
        confidence = self._calculate_confidence(equipment_type, condition, age_years)
        
        # Determine market trend
        trend = self._get_market_trend(equipment_type, season)
        
        return {
            "estimated_price_per_hour": round(estimated_price, 2),
            "confidence_score": confidence,
            "price_range_min": round(price_min, 2),
            "price_range_max": round(price_max, 2),
            "factors": {
                "condition_impact": condition_mult,
                "age_impact": round(age_mult, 2),
                "location_demand": round(location_mult, 2),
                "seasonal_factor": round(seasonal_mult, 2)
            },
            "market_trend": trend
        }
    
    def _get_location_multiplier(self, location: str) -> float:
        """Get location-based demand multiplier"""
        # Simplified - would use real market data
        high_demand_areas = ["california", "texas", "florida", "new york"]
        location_lower = location.lower()
        
        for area in high_demand_areas:
            if area in location_lower:
                return 1.15
        
        return 1.0
    
    def _calculate_confidence(self, equipment_type: str, condition: str, age: float) -> float:
        """Calculate prediction confidence score"""
        confidence = 0.85  # Base confidence
        
        # Lower confidence for unknown equipment types
        if equipment_type.lower() not in self.base_prices:
            confidence -= 0.15
        
        # Lower confidence for very old equipment
        if age > 15:
            confidence -= 0.10
        
        # Lower confidence for poor condition (less data)
        if condition.lower() == "poor":
            confidence -= 0.05
        
        return max(0.5, min(1.0, confidence))
    
    def _get_market_trend(self, equipment_type: str, season: str = None) -> str:
        """Determine market trend"""
        # Simplified trend analysis
        if season and season.lower() in ["spring", "summer"]:
            return "increasing"
        elif season and season.lower() == "winter":
            return "decreasing"
        return "stable"


# Global instance
_estimator = None


def get_estimator() -> PriceEstimator:
    """Get or create the global price estimator instance"""
    global _estimator
    if _estimator is None:
        _estimator = PriceEstimator()
    return _estimator

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
            # Agriculture (Hourly rates in INR)
            "tractor": 800.0,
            "harvester": 2500.0,
            "planter": 600.0,
            "sprayer": 500.0,
            # Construction
            "excavator": 1800.0,
            "bulldozer": 2200.0,
            "crane": 3500.0,
            "forklift": 1000.0,
            # Industrial
            "generator": 400.0,
            "compressor": 350.0,
            "welder": 300.0,
        }
        
        self.condition_multipliers = {
            "excellent": 1.2,
            "good": 1.0,
            "fair": 0.8,
            "poor": 0.6,
        }
        
        self.seasonal_multipliers = {
            "spring": 1.15,  # High demand for agriculture (e.g., Rabi harvest)
            "summer": 1.1,
            "fall": 1.05,
            "winter": 0.9,
        }
        
        logger.info("PriceEstimator initialized for Indian Hyperlocal Market")
    
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
        Estimate Fair Market Price Bands
        """
        # Get base price
        equipment_type_lower = equipment_type.lower()
        base_price = self.base_prices.get(equipment_type_lower, 1000.0)
        
        # Apply multipliers
        condition_mult = self.condition_multipliers.get(condition.lower(), 1.0)
        age_mult = max(0.5, 1.0 - (age_years * 0.05))
        seasonal_mult = self.seasonal_multipliers.get(season.lower(), 1.0) if season else 1.0
        location_mult = self._get_location_multiplier(location)
        
        # Calculate Base Estimated Price
        estimated_price = base_price * condition_mult * age_mult * seasonal_mult * location_mult
        
        # Generate Fair Market Bands instead of fixed point estimates
        # We use a 15% variance to give suppliers breathing room and avoid race-to-bottom
        variance = estimated_price * 0.15
        band_min = max(200.0, estimated_price - variance)
        band_max = estimated_price + variance
        
        confidence = self._calculate_confidence(equipment_type, condition, age_years)
        trend = self._get_market_trend(equipment_type, season)
        
        return {
            "currency": "INR",
            "fair_market_band_min": round(band_min, -1), # Round to nearest 10
            "fair_market_band_max": round(band_max, -1),
            "recommended_hourly_rate": round(estimated_price, -1),
            "confidence_score": confidence,
            "factors": {
                "condition_impact": condition_mult,
                "age_impact": round(age_mult, 2),
                "location_demand": round(location_mult, 2),
                "seasonal_factor": round(seasonal_mult, 2)
            },
            "market_trend": trend,
            "guidance_message": "Prices are structured in regional bands to protect supplier margins while ensuring fair customer rates."
        }
    
    def _get_location_multiplier(self, location: str) -> float:
        """Get location-based demand multiplier for Indian regions"""
        high_demand_agri = ["punjab", "haryana", "maharashtra", "uttar pradesh"]
        high_demand_const = ["karnataka", "tamil nadu", "delhi", "gujarat"]
        location_lower = location.lower()
        
        for area in high_demand_agri + high_demand_const:
            if area in location_lower:
                return 1.15
        
        return 1.0
    
    def _calculate_confidence(self, equipment_type: str, condition: str, age: float) -> float:
        confidence = 0.85
        if equipment_type.lower() not in self.base_prices:
            confidence -= 0.15
        if age > 15:
            confidence -= 0.10
        if condition.lower() == "poor":
            confidence -= 0.05
        return max(0.5, min(1.0, confidence))
    
    def _get_market_trend(self, equipment_type: str, season: str = None) -> str:
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

from typing import Dict, Any, List

class MultimodalDistressEngine:
    """
    Multimodal Risk Scoring Engine combining:
    - Check-in responses
    - Missed check-in streaks
    - Voice/Acoustic stress markers
    - Active assistance requests
    """

    # Response score weights
    CHECKIN_SCORES = {
        "Good": 5.0,
        "Okay": 15.0,
        "Not Good": 45.0,
        "Distressed": 75.0,
        "I Need Help": 95.0
    }

    @classmethod
    def calculate_risk(
        cls,
        checkin_response: str,
        missed_checkins: int = 0,
        voice_stress_score: float = 0.0,
        active_assistance_requests: int = 0
    ) -> Dict[str, Any]:
        
        base_score = cls.CHECKIN_SCORES.get(checkin_response, 20.0)
        
        # Missed check-in penalty: signal for follow-up, not instant crisis
        missed_penalty = min(missed_checkins * 10.0, 30.0)
        
        # Assistance request weight (each active request adds weight)
        assistance_weight = min(active_assistance_requests * 12.0, 25.0)
        
        # Voice stress contribution (25% weight)
        voice_contribution = (voice_stress_score * 0.25)
        
        # Composite score calculation (capped at 100.0)
        total_score = round(min(
            (base_score * 0.45) + missed_penalty + assistance_weight + voice_contribution, 
            100.0
        ), 1)

        # Configurable Risk Categories
        if total_score <= 30.0:
            category = "Stable"
            level = "Low"
            recommendation = "Continue routine monitoring"
        elif total_score <= 60.0:
            category = "Moderate"
            level = "Moderate"
            recommendation = "Schedule periodic follow-up"
        elif total_score <= 80.0:
            category = "High"
            level = "High Concern"
            recommendation = "Notify Social Worker for proactive review"
        else:
            category = "Critical"
            level = "Urgent Attention"
            recommendation = "Immediate human intervention required"

        return {
            "risk_score": total_score,
            "category": category,
            "level": level,
            "recommendation": recommendation,
            "components": {
                "base_checkin_score": base_score,
                "missed_penalty": missed_penalty,
                "assistance_weight": assistance_weight,
                "voice_contribution": voice_contribution
            }
        }

distress_engine = MultimodalDistressEngine()
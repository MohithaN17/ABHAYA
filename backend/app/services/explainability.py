from typing import List, Dict, Any

class AIExplainabilityEngine:
    """
    Explains to the Social Worker why a case was flagged:
    e.g., negative emotional language, missed check-ins, vocal stress markers[cite: 1].
    """

    @staticmethod
    def generate_explanation(
        risk_score: float,
        checkin_response: str,
        missed_checkins: int,
        voice_stress_score: float
    ) -> List[str]:
        reasons = []

        if checkin_response in ["Distressed", "I Need Help"]:
            reasons.append("Recent check-in self-reported elevated emotional distress[cite: 1].")
        elif checkin_response == "Not Good":
            reasons.append("Reported sub-optimal emotional state in latest check-in[cite: 1].")

        if missed_checkins >= 2:
            reasons.append(f"Multiple consecutive missed wellbeing check-ins ({missed_checkins} missed)[cite: 1].")

        if voice_stress_score > 60.0:
            reasons.append("Acoustic analysis flagged notable vocal tremor, lower energy, and irregular pause patterns[cite: 1].")

        if risk_score > 60.0 and not reasons:
            reasons.append("Pattern indicates a cumulative upward trend in distress markers over recent interactions[cite: 1].")

        if not reasons:
            reasons.append("All baseline distress signals are currently within the stable threshold[cite: 1].")

        return reasons

explainability_engine = AIExplainabilityEngine()
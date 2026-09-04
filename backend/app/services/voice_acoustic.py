import random
from typing import Dict, Any

class AcousticVoiceAnalyzer:
    """
    Acoustic Feature Extraction & Voice-Stress Indicator:
    Analyzes pitch variability, speaking rate, pauses, energy, and vocal jitter.
    (Used as a contributing distress signal, not a definitive diagnosis).
    """

    @classmethod
    def analyze_audio_stream(cls, simulated_intensity: str = "normal") -> Dict[str, Any]:
        if simulated_intensity == "high_stress":
            pitch_mean_hz = round(random.uniform(260.0, 340.0), 1)
            speaking_rate_wpm = round(random.uniform(85.0, 110.0), 1)  # slower, hesitated
            pause_ratio = round(random.uniform(0.35, 0.55), 2)         # prolonged pauses
            energy_db = round(random.uniform(38.0, 52.0), 1)           # subdued energy
            vocal_variability = round(random.uniform(0.65, 0.88), 2)   # high jitter/tremor
            stress_index = round(random.uniform(70.0, 92.0), 1)
        else:
            pitch_mean_hz = round(random.uniform(180.0, 220.0), 1)
            speaking_rate_wpm = round(random.uniform(130.0, 160.0), 1)
            pause_ratio = round(random.uniform(0.12, 0.22), 2)
            energy_db = round(random.uniform(60.0, 75.0), 1)
            vocal_variability = round(random.uniform(0.15, 0.30), 2)
            stress_index = round(random.uniform(15.0, 35.0), 1)

        return {
            "acoustic_features": {
                "pitch_mean_hz": pitch_mean_hz,
                "speaking_rate_wpm": speaking_rate_wpm,
                "pause_ratio": pause_ratio,
                "energy_intensity_db": energy_db,
                "vocal_variability": vocal_variability
            },
            "voice_stress_score": stress_index,
            "disclaimer": "Distress indicator for prioritizing assistance; not a clinical diagnosis."
        }

voice_analyzer = AcousticVoiceAnalyzer()
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from backend.app.core.config import settings
from backend.app.core.database import Base, engine
from backend.app.services.distress_engine import distress_engine
from backend.app.services.voice_acoustic import voice_analyzer
from backend.app.services.explainability import explainability_engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RiskAssessmentRequest(BaseModel):
    case_id: str
    checkin_response: str
    missed_checkins: Optional[int] = 0
    voice_stress_score: Optional[float] = 0.0
    active_assistance_requests: Optional[int] = 0

class VoiceSampleRequest(BaseModel):
    case_id: str
    simulated_intensity: Optional[str] = "normal"  # "normal" or "high_stress"

@app.get("/")
def root():
    return {"project": settings.PROJECT_NAME, "status": "running"}

@app.post("/api/ai/assess-risk")
def assess_risk(payload: RiskAssessmentRequest):
    result = distress_engine.calculate_risk(
        checkin_response=payload.checkin_response,
        missed_checkins=payload.missed_checkins,
        voice_stress_score=payload.voice_stress_score,
        active_assistance_requests=payload.active_assistance_requests
    )
    explanation = explainability_engine.generate_explanation(
        risk_score=result["risk_score"],
        checkin_response=payload.checkin_response,
        missed_checkins=payload.missed_checkins,
        voice_stress_score=payload.voice_stress_score
    )
    result["explanation"] = explanation
    return result

@app.post("/api/ai/voice-analysis")
def analyze_voice(payload: VoiceSampleRequest):
    return voice_analyzer.analyze_audio_stream(simulated_intensity=payload.simulated_intensity)
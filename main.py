from fastapi import FastAPI
from pydantic import BaseModel
from textblob import TextBlob

app = FastAPI()

class SentimentRequest(BaseModel):
    text: str

class CaseRegisterRequest(BaseModel):
    case_id: str
    victim_name: str
    phone_number: str
    case_type: str

@app.get("/")
def read_root():
    return {"message": "Abhaya Backend is running successfully!"}

@app.post("/analyze-distress/")
def analyze_distress(payload: SentimentRequest):
    text_lower = payload.text.lower()
    analysis = TextBlob(payload.text)
    polarity = analysis.sentiment.polarity

    emergency_keywords = ["danger", "scared", "terrified", "help", "unsafe", "threat"]
    has_emergency_keyword = any(keyword in text_lower for keyword in emergency_keywords)

    status = "Stable"
    if polarity < -0.3 or has_emergency_keyword:
        status = "Attention Required"
    if polarity < -0.6 or ("extreme" in text_lower and has_emergency_keyword):
        status = "Urgent Support"

    return {
        "text": payload.text,
        "polarity_score": polarity,
        "distress_status": status
    }

@app.post("/cases/register")
def register_case(case: CaseRegisterRequest):
    # Placeholder logic to simulate saving the police case record
    return {
        "status": "Success",
        "message": f"Case {case.case_id} for {case.victim_name} registered successfully.",
        "case_details": {
            "case_id": case.case_id,
            "victim_name": case.victim_name,
            "phone_number": case.phone_number,
            "case_type": case.case_type
        }
    }
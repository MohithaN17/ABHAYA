from fastapi import FastAPI
from pydantic import BaseModel
from textblob import TextBlob

app = FastAPI()

class SentimentRequest(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"message": "Abhaya Backend is running successfully!"}

@app.post("/analyze-distress/")
def analyze_distress(payload: SentimentRequest):
    text_lower = payload.text.lower()
    analysis = TextBlob(payload.text)
    polarity = analysis.sentiment.polarity
    
    # Emergency keyword override for safety app reliability
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
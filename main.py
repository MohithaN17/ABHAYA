from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from textblob import TextBlob
from fastapi import FastAPI, Form, Response

app = FastAPI(title="Abhaya Backend", version="1.0")

# Enable CORS for frontend applications (Flutter & Web Dashboard)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

    emergency_keywords = ["danger", "scared", "terrified", "help", "unsafe", "threat", "attack"]
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

@app.post("/ivrs/call-handler")
def ivrs_call_handler(From: str = Form(...), Body: str = Form(default="Emergency distress call")):
    response_twiml = f"""<Response>
        <Say>Abhaya emergency response system activated. We have received your call from {From}. Help is being dispatched.</Say>
        <Record maxLength="30" action="/ivrs/recording-callback" method="POST"/>
    </Response>"""
    return Response(content=response_twiml, media_type="application/xml")

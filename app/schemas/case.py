from typing import Optional, List, Any, Dict
from pydantic import BaseModel, ConfigDict


class CaseBase(BaseModel):
    id: str
    caseId: str
    firNo: str
    caseType: str
    status: str
    registeredOn: str
    incidentDate: str
    incidentLocation: str
    policeStation: str
    assignedOfficer: str
    wellBeingScore: int
    wellBeingCategory: str
    trend: str
    lastCheckIn: Optional[str] = None
    activity: Optional[str] = None


class CasePoliceView(CaseBase):
    """
    Police Officer View Schema:
    Contains aggregate well-being metrics, FIR, status, operational info.
    Explicitly REDACTS: victim text/chat history and detailed AI explanation signals.
    """
    pass


class CaseSocialWorkerView(CaseBase):
    """
    Social Worker View Schema:
    Contains full case access, including victim initials, victim text, and human review details.
    """
    victimInitials: Optional[str] = None
    victimText: Optional[str] = None
    humanReview: Optional[Dict[str, Any]] = None
    aiSignals: Optional[List[Dict[str, Any]]] = None


class CaseVictimView(CaseBase):
    """
    Victim View Schema:
    Access strictly scoped to victim's own case.
    """
    victimInitials: Optional[str] = None


class HumanReviewRequest(BaseModel):
    action: str  # 'confirmed' | 'false_alert'
    notes: Optional[str] = ""
    reviewedBy: Optional[str] = None


class HumanReviewResponse(BaseModel):
    action: str
    notes: Optional[str] = ""
    reviewedBy: str
    timestamp: str

    model_config = ConfigDict(from_attributes=True)

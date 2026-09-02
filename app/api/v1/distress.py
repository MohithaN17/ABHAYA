import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.user import UserProfile
from app.models.case import Case
from app.models.distress import DistressRecord
from app.models.ai_explanation import AIExplanation
from app.schemas.distress import DistressHistoryItem, AIExplanationResponse

router = APIRouter(prefix="/distress", tags=["Distress"])


@router.get("/{case_id}/history", response_model=List[DistressHistoryItem])
def get_distress_history(
    case_id: str,
    current_user: UserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Fetch historical distress time-series data for a case.
    """
    case = db.query(Case).filter((Case.id == case_id) | (Case.case_id == case_id)).first()
    target_case_id = case.id if case else case_id

    # Scope check for Victim role
    if current_user.role == "victim" and case and case.assigned_victim_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: You may only view your own distress history"
        )

    records = db.query(DistressRecord).filter(DistressRecord.case_id == target_case_id).all()
    if not records:
        # Fallback default time series if no record stored yet
        return [
            DistressHistoryItem(date="Aug 20", score=40, category="Stable"),
            DistressHistoryItem(date="Aug 25", score=50, category="Attention"),
            DistressHistoryItem(date="Sep 01", score=60, category="Attention")
        ]

    return records


@router.get("/{case_id}/explanation", response_model=AIExplanationResponse)
def get_distress_explanation(
    case_id: str,
    current_user: UserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Fetch explainable AI signals for a case.
    ROLE SECURITY RULE:
    - POLICE MUST NOT see detailed AI distress explanation. Returns HTTP 403.
    - SOCIAL WORKER and VICTIM can view detailed AI signals.
    """
    if current_user.role == "police":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Role security policy: Police personnel are restricted from viewing detailed AI distress explanations"
        )

    case = db.query(Case).filter((Case.id == case_id) | (Case.case_id == case_id)).first()
    target_case_id = case.id if case else case_id

    if current_user.role == "victim" and case and case.assigned_victim_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: You may only view AI explanations for your own case"
        )

    ai_exp = db.query(AIExplanation).filter(AIExplanation.case_id == target_case_id).first()
    if not ai_exp or not ai_exp.signals_json:
        return AIExplanationResponse(signals=[], disclaimer="No AI analysis available for this case.")

    signals = json.loads(ai_exp.signals_json)
    return AIExplanationResponse(
        signals=signals,
        disclaimer=ai_exp.disclaimer or "AI assessment is decision support, not a final diagnosis."
    )

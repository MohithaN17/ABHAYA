import json
from typing import List, Optional, Any, Dict
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db, require_social_worker
from app.models.user import UserProfile
from app.models.case import Case
from app.models.ai_explanation import AIExplanation
from app.models.human_review import HumanReview
from app.schemas.case import (
    CasePoliceView,
    CaseSocialWorkerView,
    CaseVictimView,
    HumanReviewRequest,
    HumanReviewResponse
)

router = APIRouter(prefix="/cases", tags=["Cases"])


def normalize_role(r: Optional[str]) -> str:
    if not r:
        return ""
    return r.lower().replace("-", "_").strip()


@router.get("", response_model=List[Any])
def get_cases(
    search: Optional[str] = Query(default=""),
    status_filter: Optional[str] = Query(default="", alias="status"),
    case_type: Optional[str] = Query(default="", alias="caseType"),
    sort_by: Optional[str] = Query(default="score", alias="sortBy"),
    current_user: UserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Fetch cases with role-based redaction and access control.
      - Police: Aggregate metrics, FIR info. Sensitive victim text / AI signals REDACTED.
      - Social Worker / Admin: Full case records, distress history, AI signals.
      - Victim: Access strictly scoped to own registered cases.
    """
    user_role = normalize_role(current_user.role)
    query = db.query(Case)

    # Scoping for Victim role
    if user_role == "victim":
        query = query.filter(Case.assigned_victim_id == current_user.id)

    cases = query.all()

    # Apply search filter
    if search:
        q = search.lower().strip()
        cases = [
            c for c in cases
            if q in c.case_id.lower()
            or q in c.fir_no.lower()
            or q in c.case_type.lower()
            or (c.incident_location and q in c.incident_location.lower())
        ]

    # Apply status filter
    if status_filter and status_filter != "all":
        if status_filter == "stable":
            cases = [c for c in cases if c.well_being_category == "Stable"]
        elif status_filter == "attention":
            cases = [c for c in cases if c.well_being_category == "Attention Required"]
        elif status_filter == "urgent":
            cases = [c for c in cases if c.well_being_category == "Urgent Support Needed"]

    # Apply case type filter
    if case_type and case_type != "all":
        cases = [c for c in cases if c.case_type == case_type]

    # Apply sorting
    if sort_by == "score-desc":
        cases.sort(key=lambda c: c.well_being_score, reverse=True)
    elif sort_by == "score-asc":
        cases.sort(key=lambda c: c.well_being_score)
    else:
        cases.sort(key=lambda c: c.well_being_score, reverse=True)

    # Transform response according to User Role
    response_list = []
    for c in cases:
        case_dict = {
            "id": c.id,
            "caseId": c.case_id,
            "firNo": c.fir_no,
            "caseType": c.case_type,
            "status": c.status,
            "registeredOn": c.registered_on,
            "incidentDate": c.incident_date,
            "incidentLocation": c.incident_location,
            "policeStation": c.police_station,
            "assignedOfficer": c.assigned_officer,
            "wellBeingScore": c.well_being_score,
            "wellBeingCategory": c.well_being_category,
            "trend": c.trend,
            "lastCheckIn": c.last_check_in,
            "activity": c.activity,
        }

        if user_role == "police":
            # Redact victimInitials, victimText, aiSignals, humanReview for Police privacy boundary
            response_list.append(CasePoliceView(**case_dict))
        elif user_role in ["social_worker", "admin"]:
            # Attach review if exists
            review = db.query(HumanReview).filter(HumanReview.case_id == c.id).order_by(HumanReview.id.desc()).first()
            review_dict = None
            if review:
                review_dict = {
                    "action": review.action,
                    "notes": review.notes,
                    "reviewedBy": review.reviewed_by,
                    "timestamp": review.timestamp
                }

            # Attach AI signals if exists
            ai_exp = db.query(AIExplanation).filter(AIExplanation.case_id == c.id).first()
            ai_signals = json.loads(ai_exp.signals_json) if ai_exp and ai_exp.signals_json else []

            case_dict.update({
                "victimInitials": c.victim_initials,
                "victimText": c.victim_text,
                "humanReview": review_dict,
                "aiSignals": ai_signals
            })
            response_list.append(CaseSocialWorkerView(**case_dict))
        else: # Victim
            case_dict.update({"victimInitials": c.victim_initials})
            response_list.append(CaseVictimView(**case_dict))

    return response_list


@router.get("/{case_id}", response_model=Any)
def get_case_by_id(
    case_id: str,
    current_user: UserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Fetch a single case by ID with role-based security rules.
    """
    user_role = normalize_role(current_user.role)
    case = db.query(Case).filter((Case.id == case_id) | (Case.case_id == case_id)).first()
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case {case_id} not found"
        )

    # Scoping for Victim role
    if user_role == "victim" and case.assigned_victim_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: You may only view your own registered case"
        )

    case_dict = {
        "id": case.id,
        "caseId": case.case_id,
        "firNo": case.fir_no,
        "caseType": case.case_type,
        "status": case.status,
        "registeredOn": case.registered_on,
        "incidentDate": case.incident_date,
        "incidentLocation": case.incident_location,
        "policeStation": case.police_station,
        "assignedOfficer": case.assigned_officer,
        "wellBeingScore": case.well_being_score,
        "wellBeingCategory": case.well_being_category,
        "trend": case.trend,
        "lastCheckIn": case.last_check_in,
        "activity": case.activity,
    }

    if user_role == "police":
        return CasePoliceView(**case_dict)
    
    # Attach review & AI signals for Social Worker / Admin
    review = db.query(HumanReview).filter(HumanReview.case_id == case.id).order_by(HumanReview.id.desc()).first()
    review_dict = None
    if review:
        review_dict = {
            "action": review.action,
            "notes": review.notes,
            "reviewedBy": review.reviewed_by,
            "timestamp": review.timestamp
        }

    ai_exp = db.query(AIExplanation).filter(AIExplanation.case_id == case.id).first()
    ai_signals = json.loads(ai_exp.signals_json) if ai_exp and ai_exp.signals_json else []

    if user_role in ["social_worker", "admin"]:
        case_dict.update({
            "victimInitials": case.victim_initials,
            "victimText": case.victim_text,
            "humanReview": review_dict,
            "aiSignals": ai_signals
        })
        return CaseSocialWorkerView(**case_dict)
    
    # Victim
    case_dict.update({"victimInitials": case.victim_initials})
    return CaseVictimView(**case_dict)


@router.post("/{case_id}/review", response_model=HumanReviewResponse)
def save_human_review(
    case_id: str,
    payload: HumanReviewRequest,
    current_user: UserProfile = Depends(require_social_worker),
    db: Session = Depends(get_db)
):
    """
    Human-in-the-Loop review endpoint for Social Workers to confirm concern or mark false alert.
    Restricted strictly to 'social_worker' / 'admin' role.
    """
    case = db.query(Case).filter((Case.id == case_id) | (Case.case_id == case_id)).first()
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Case not found"
        )

    reviewer_name = payload.reviewedBy or current_user.full_name or f"Social Worker ({current_user.id[:8]})"
    timestamp_str = datetime.now().strftime("%b %d, %Y, %I:%M %p")

    review_record = HumanReview(
        case_id=case.id,
        action=payload.action,
        notes=payload.notes or "",
        reviewed_by=reviewer_name,
        timestamp=timestamp_str
    )
    db.add(review_record)
    db.commit()
    db.refresh(review_record)

    return HumanReviewResponse(
        action=review_record.action,
        notes=review_record.notes,
        reviewedBy=review_record.reviewed_by,
        timestamp=review_record.timestamp
    )

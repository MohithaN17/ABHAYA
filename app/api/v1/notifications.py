from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.user import UserProfile
from app.models.notification import Notification
from app.schemas.notification import NotificationResponse

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("", response_model=List[NotificationResponse])
def get_notifications(
    current_user: UserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Fetch role-targeted notifications list for the authenticated user.
    """
    notifications = db.query(Notification).filter(
        (Notification.target_role == current_user.role) | (Notification.target_role == "all")
    ).all()

    return notifications

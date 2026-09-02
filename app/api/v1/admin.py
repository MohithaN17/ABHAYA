import uuid
import httpx
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, require_admin, get_current_user
from app.core.config import settings
from app.models.user import UserProfile
from app.schemas.user import UserProfileResponse, AdminUserCreateRequest, UserStatusUpdateRequest

router = APIRouter(prefix="/admin", tags=["Admin User Management"])


@router.get("/users", response_model=List[UserProfileResponse])
def list_users(
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(require_admin)
):
    """
    List all ABHAYA user profiles. Accessible only by authorized Administrator.
    """
    users = db.query(UserProfile).order_by(UserProfile.created_at.desc()).all()
    return users


@router.post("/users", response_model=UserProfileResponse)
def create_user(
    data: AdminUserCreateRequest,
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(require_admin)
):
    """
    Controlled user registration endpoint for Admin to register Police Officers & Social Workers.
    Creates user in Supabase Auth via Service Role API and creates ABHAYA UserProfile.
    """
    badge_id = data.badge_id.strip()
    email = data.email.strip().lower()
    role = data.role.strip().lower()

    if role not in ["police", "social_worker", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role. Must be 'police' or 'social_worker'."
        )

    # 1. Validate Officer ID uniqueness
    existing_badge = db.query(UserProfile).filter(UserProfile.badge_id == badge_id).first()
    if existing_badge:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Officer ID already registered."
        )

    # 2. Validate Email uniqueness
    existing_email = db.query(UserProfile).filter(UserProfile.email == email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This email is already associated with an ABHAYA account."
        )

    # 3. Create user in Supabase Auth via Admin API using SUPABASE_SERVICE_ROLE_KEY
    supabase_user_id = str(uuid.uuid4())
    supabase_url = f"{settings.supabase_base_url}/auth/v1/admin/users"
    headers = {
        "apikey": settings.SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "email": email,
        "password": data.password,
        "email_confirm": True,
        "user_metadata": {
            "full_name": data.full_name,
            "role": role,
            "badge_id": badge_id
        }
    }

    try:
        with httpx.Client(timeout=10.0) as client:
            res = client.post(supabase_url, json=payload, headers=headers)
            if res.status_code in [200, 201]:
                resp_data = res.json()
                supabase_user_id = resp_data.get("id", supabase_user_id)
            else:
                err_json = res.json() if res.content else {}
                msg = err_json.get("msg") or err_json.get("message") or "Failed to create user in Supabase Auth"
                if "already registered" in msg.lower() or "already exists" in msg.lower():
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="This email is already associated with an ABHAYA account."
                    )
                print(f"Supabase Admin API returned status {res.status_code}: {msg}")
    except HTTPException:
        raise
    except Exception as e:
        print(f"Warning: Supabase Admin API call exception: {e}")

    # 4. Save ABHAYA UserProfile to Database
    new_profile = UserProfile(
        id=supabase_user_id,
        email=email,
        full_name=data.full_name.strip(),
        role=role,
        badge_id=badge_id,
        police_station=data.police_station.strip() if data.police_station else None,
        is_active=True
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)

    return new_profile


@router.patch("/users/{user_id}/status", response_model=UserProfileResponse)
def update_user_status(
    user_id: str,
    status_data: UserStatusUpdateRequest,
    db: Session = Depends(get_db),
    current_user: UserProfile = Depends(require_admin)
):
    """
    Deactivate or reactivate an ABHAYA user account.
    """
    user = db.query(UserProfile).filter(UserProfile.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found."
        )

    user.is_active = status_data.is_active
    db.commit()
    db.refresh(user)
    return user

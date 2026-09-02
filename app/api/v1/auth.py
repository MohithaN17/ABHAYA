from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_user, get_db
from app.models.user import UserProfile
from app.schemas.user import UserProfileResponse, UserProfileCreate, ResolveIdRequest, ResolveIdResponse

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/resolve-id", response_model=ResolveIdResponse)
def resolve_officer_id(payload: ResolveIdRequest, db: Session = Depends(get_db)):
    """
    Resolves Officer ID or Badge ID to the Supabase Auth email identity.
    Enforces user active state check (is_active == True).
    """
    officer_id = payload.officer_id.strip()
    if not officer_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Officer ID is required"
        )

    user = db.query(UserProfile).filter(
        (UserProfile.badge_id == officer_id) | (UserProfile.email == officer_id)
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid credentials."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account inactive"
        )

    return ResolveIdResponse(
        email=user.email or "",
        is_active=user.is_active,
        badge_id=user.badge_id
    )


@router.get("/me", response_model=UserProfileResponse)
def get_me(current_user: UserProfile = Depends(get_current_user)):
    """
    Returns authenticated user's profile and application role.
    Requires header: Authorization: Bearer <supabase_access_token>
    """
    return current_user


@router.post("/sync-profile", response_model=UserProfileResponse)
def sync_profile(
    profile_data: UserProfileCreate,
    current_user: UserProfile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Updates or syncs ABHAYA application role and details for the Supabase user.
    """
    user = db.query(UserProfile).filter(UserProfile.id == current_user.id).first()
    if not user:
        user = UserProfile(id=current_user.id)
        db.add(user)

    user.full_name = profile_data.full_name
    user.role = profile_data.role
    if profile_data.phone:
        user.phone = profile_data.phone
    if profile_data.email:
        user.email = profile_data.email
    if profile_data.police_station:
        user.police_station = profile_data.police_station
    if profile_data.badge_id:
        user.badge_id = profile_data.badge_id

    db.commit()
    db.refresh(user)
    return user

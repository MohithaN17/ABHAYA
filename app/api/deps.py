from typing import Generator, List
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.core.security import verify_supabase_jwt
from app.models.user import UserProfile

security_scheme = HTTPBearer()


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(get_db)
) -> UserProfile:
    """
    Validates Supabase Bearer JWT token and retrieves ABHAYA user profile from DB.
    Enforces active user account check (is_active == True).
    """
    token = credentials.credentials
    jwt_payload = verify_supabase_jwt(token)

    user_id = jwt_payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token claims: missing sub (user ID)",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Fetch profile from Supabase PostgreSQL database
    user = db.query(UserProfile).filter(UserProfile.id == user_id).first()

    if not user:
        # Fallback profile sync from Supabase token metadata if registered via Supabase Auth
        raw_role = jwt_payload.get("app_metadata", {}).get("role") or jwt_payload.get("user_metadata", {}).get("role") or "victim"
        user_role = raw_role.lower().replace("-", "_").strip()
        full_name = jwt_payload.get("user_metadata", {}).get("full_name") or f"User {user_id[:8]}"
        phone = jwt_payload.get("phone")
        email = jwt_payload.get("email")

        user = UserProfile(
            id=user_id,
            phone=phone,
            email=email,
            full_name=full_name,
            role=user_role,
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account inactive"
        )

    return user


class RoleChecker:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = [r.lower().replace("-", "_").strip() for r in allowed_roles]

    def __call__(self, current_user: UserProfile = Depends(get_current_user)) -> UserProfile:
        user_role = current_user.role.lower().replace("-", "_").strip()
        if user_role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden for role '{current_user.role}'. Required roles: {self.allowed_roles}"
            )
        return current_user


def require_role(role: str):
    return RoleChecker([role])


require_police = RoleChecker(["police", "admin"])
require_social_worker = RoleChecker(["social_worker", "social-worker", "admin"])
require_admin = RoleChecker(["admin"])
require_victim = RoleChecker(["victim"])
require_staff = RoleChecker(["police", "social_worker", "social-worker", "admin"])

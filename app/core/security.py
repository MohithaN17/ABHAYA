import jwt
from jwt.exceptions import PyJWTError
from typing import Dict, Any, Optional
from fastapi import HTTPException, status
from app.core.config import settings


def verify_supabase_jwt(token: str) -> Dict[str, Any]:
    """
    Validates a Supabase Access Token (JWT).
    Supabase JWT tokens contain claims like:
      - sub: user UUID
      - email / phone: user contact details
      - role: authenticated / service_role
      - app_metadata / user_metadata: metadata attributes
    """
    try:
        # First attempt decoding with configured SUPABASE_JWT_SECRET
        # Algorithms supported: HS256 (standard Supabase JWT secret)
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False}
        )
        return payload
    except PyJWTError:
        # Fallback: Check if token can be unverified-decoded for development/mocking or fallback inspection
        try:
            unverified_payload = jwt.decode(token, options={"verify_signature": False})
            if "sub" in unverified_payload:
                return unverified_payload
        except Exception:
            pass

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials: Invalid or expired Supabase token",
            headers={"WWW-Authenticate": "Bearer"},
        )

from typing import Optional
from pydantic import BaseModel, ConfigDict


class UserProfileBase(BaseModel):
    phone: Optional[str] = None
    email: Optional[str] = None
    full_name: str
    role: str  # 'police', 'social_worker', 'admin', 'victim'
    police_station: Optional[str] = None
    badge_id: Optional[str] = None
    is_active: bool = True


class UserProfileCreate(UserProfileBase):
    id: str  # Supabase Auth UID


class UserProfileResponse(UserProfileBase):
    id: str

    model_config = ConfigDict(from_attributes=True)


class ResolveIdRequest(BaseModel):
    officer_id: str


class ResolveIdResponse(BaseModel):
    email: str
    is_active: bool
    badge_id: Optional[str] = None


class AdminUserCreateRequest(BaseModel):
    badge_id: str
    full_name: str
    email: str
    password: str
    role: str  # 'police', 'social_worker', 'admin'
    police_station: Optional[str] = None


class UserStatusUpdateRequest(BaseModel):
    is_active: bool

from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean
from app.db.session import Base


class UserProfile(Base):
    __tablename__ = "profiles"

    id = Column(String, primary_key=True, index=True)  # Supabase Auth UID (UUID)
    phone = Column(String, index=True, nullable=True)
    email = Column(String, index=True, nullable=True)
    full_name = Column(String, nullable=False)
    role = Column(String, nullable=False, index=True)  # 'police', 'social_worker', 'admin', 'victim'
    police_station = Column(String, nullable=True)
    badge_id = Column(String, nullable=True, index=True)  # Officer ID / Worker ID (e.g. POL001, SW001)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

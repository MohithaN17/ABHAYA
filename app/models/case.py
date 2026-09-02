from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey
from app.db.session import Base


class Case(Base):
    __tablename__ = "cases"

    id = Column(String, primary_key=True, index=True)
    case_id = Column(String, unique=True, index=True, nullable=False)
    fir_no = Column(String, nullable=False)
    case_type = Column(String, nullable=False)
    status = Column(String, default="Active")
    registered_on = Column(String, nullable=False)
    incident_date = Column(String, nullable=False)
    incident_location = Column(String, nullable=False)
    police_station = Column(String, nullable=False)
    assigned_officer = Column(String, nullable=False)
    well_being_score = Column(Integer, default=50)
    well_being_category = Column(String, default="Stable")
    trend = Column(String, default="Stable")
    last_check_in = Column(String, nullable=True)
    activity = Column(String, nullable=True)
    
    # Sensitive Victim attributes (Restricted from Police role)
    victim_initials = Column(String, nullable=True)
    victim_text = Column(Text, nullable=True)  # Chat history / raw text
    
    # Assignment relations
    assigned_victim_id = Column(String, ForeignKey("profiles.id"), nullable=True)
    assigned_police_id = Column(String, ForeignKey("profiles.id"), nullable=True)
    assigned_social_worker_id = Column(String, ForeignKey("profiles.id"), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

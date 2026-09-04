from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float, Boolean
from sqlalchemy.sql import func
from backend.app.core.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String(15), unique=True, index=True, nullable=False)
    role = Column(String(20), nullable=False)  # victim, social_worker, officer
    name = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Case(Base):
    __tablename__ = "cases"
    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(String(50), unique=True, index=True, nullable=False)
    victim_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    fir_number = Column(String(50), nullable=True)
    case_type = Column(String(50), nullable=False)
    district = Column(String(50), default="Bengaluru Urban")
    state = Column(String(50), default="Karnataka")
    case_status = Column(String(50), default="Investigation Started")
    wellbeing_status = Column(String(50), default="Stable")
    current_risk_score = Column(Float, default=15.0)
    has_smartphone = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class CheckIn(Base):
    __tablename__ = "checkins"
    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(String(50), nullable=False)
    response = Column(String(50), nullable=False)
    risk_score = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class AssistanceRequest(Base):
    __tablename__ = "assistance_requests"
    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(String(50), nullable=False)
    category = Column(String(50), nullable=False)  # Shelter, Legal, Medical, Counselling
    description = Column(Text, nullable=True)
    status = Column(String(50), default="Submitted")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
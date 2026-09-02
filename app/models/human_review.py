from sqlalchemy import Column, Integer, String, Text, ForeignKey
from app.db.session import Base


class HumanReview(Base):
    __tablename__ = "human_reviews"

    id = Column(Integer, primary_key=True, autoincrement=True)
    case_id = Column(String, ForeignKey("cases.id"), index=True, nullable=False)
    action = Column(String, nullable=False)  # 'confirmed' | 'false_alert'
    notes = Column(Text, nullable=True)
    reviewed_by = Column(String, nullable=False)
    timestamp = Column(String, nullable=False)

from sqlalchemy import Column, Integer, String, Text, ForeignKey
from app.db.session import Base


class AIExplanation(Base):
    __tablename__ = "ai_explanations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    case_id = Column(String, ForeignKey("cases.id"), index=True, nullable=False)
    signals_json = Column(Text, nullable=False)  # JSON serialized signals array
    disclaimer = Column(Text, default="AI assessment is decision support, not a final diagnosis.")

from sqlalchemy import Column, Integer, String, ForeignKey
from app.db.session import Base


class DistressRecord(Base):
    __tablename__ = "distress_records"

    id = Column(Integer, primary_key=True, autoincrement=True)
    case_id = Column(String, ForeignKey("cases.id"), index=True, nullable=False)
    date = Column(String, nullable=False)
    score = Column(Integer, nullable=False)
    category = Column(String, nullable=False)

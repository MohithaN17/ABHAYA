from sqlalchemy import Column, Integer, String
from app.db.session import Base


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    target_role = Column(String, index=True, nullable=False)  # 'police', 'social_worker', 'victim'
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    timestamp = Column(String, nullable=False)
    read_status = Column(String, default="false")

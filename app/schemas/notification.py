from pydantic import BaseModel, ConfigDict


class NotificationResponse(BaseModel):
    id: int
    target_role: str
    title: str
    message: str
    timestamp: str
    read_status: str

    model_config = ConfigDict(from_attributes=True)

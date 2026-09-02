from typing import List, Dict, Any
from pydantic import BaseModel, ConfigDict


class DistressHistoryItem(BaseModel):
    date: str
    score: int
    category: str

    model_config = ConfigDict(from_attributes=True)


class AISignalItem(BaseModel):
    id: str
    label: str
    riskLevel: str  # 'High', 'Medium', 'Low'
    weight: int
    description: str


class AIExplanationResponse(BaseModel):
    signals: List[Dict[str, Any]]
    disclaimer: str = "AI assessment is decision support, not a final diagnosis."

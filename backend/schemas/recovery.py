from datetime import datetime

from pydantic import BaseModel, ConfigDict


class RecoveryCreate(BaseModel):
    recovery_id: str
    payment_id: str
    strategy: str
    channel: str | None = None


class RecoveryStatusUpdate(BaseModel):
    status: str


class RecoveryResponse(BaseModel):
    id: int
    recovery_id: str
    payment_id: str
    customer_id: str
    amount: float
    strategy: str
    channel: str | None
    status: str
    recovered_amount: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
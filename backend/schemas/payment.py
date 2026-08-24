from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class PaymentCreate(BaseModel):
    payment_id: str
    customer_id: str
    amount: float
    status: str
    failure_reason: Optional[str] = None
    attempts: int = 1


class PaymentResponse(PaymentCreate):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
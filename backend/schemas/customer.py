from pydantic import BaseModel, ConfigDict


class CustomerCreate(BaseModel):
    customer_id: str
    name: str
    email: str
    phone: str | None = None
    previous_orders: int = 0
    successful_payments: int = 0


class CustomerResponse(CustomerCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)
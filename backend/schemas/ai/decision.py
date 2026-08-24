

# from datetime import datetime

# from pydantic import BaseModel


# class AIDecisionResponse(BaseModel):
#     decision_id: str
#     payment_id: str
#     customer_id: str
#     recommendation: str
#     confidence: float
#     risk: str
#     reasoning: str
#     requires_approval: bool
#     created_at: datetime

from datetime import datetime

from pydantic import BaseModel, Field


class AIDecisionOutput(BaseModel):
    recommendation: str = Field(
        description="Recommended payment recovery strategy"
    )

    confidence: float = Field(
        ge=0,
        le=1,
        description="AI confidence between 0 and 1"
    )

    risk: str = Field(
        description="Risk level: LOW, MEDIUM, or HIGH"
    )

    reasoning: str = Field(
        description="Short explanation for the recommendation"
    )

    requires_approval: bool = Field(
        description="Whether human approval is required"
    )

    execution_mode: str = Field(
    description="Execution mode for the recovery strategy"
    )


class AIDecisionResponse(BaseModel):
    decision_id: str
    payment_id: str
    customer_id: str
    recommendation: str
    confidence: float
    risk: str
    reasoning: str
    requires_approval: bool
    created_at: datetime
    execution_mode: str
    recovery_id: str | None = None
    recovery_status: str | None = None
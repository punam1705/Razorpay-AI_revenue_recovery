from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    Integer,
    String,
)

from database import Base


class AIDecision(Base):
    __tablename__ = "ai_decisions"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    decision_id = Column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    payment_id = Column(
        String(100),
        nullable=False,
        index=True,
    )

    customer_id = Column(
        String(100),
        nullable=False,
        index=True,
    )

    recommendation = Column(
        String(150),
        nullable=False,
    )

    confidence = Column(
        Float,
        nullable=False,
    )

    risk = Column(
        String(30),
        nullable=False,
    )

    reasoning = Column(
        String(2000),
        nullable=False,
    )

    requires_approval = Column(
        Boolean,
        default=False,
    )

    execution_mode = Column(
    String(50),
    nullable=False,
  )
    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )
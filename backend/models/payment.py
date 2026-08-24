from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    Float,
    Integer,
    String,
)

from database import Base


class Payment(Base):
    __tablename__ = "payments"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    payment_id = Column(
        String(100),
        unique=True,
        nullable=False,
        index=True
    )

    customer_id = Column(
        String(100),
        nullable=False,
        index=True
    )

    amount = Column(
        Float,
        nullable=False
    )

    status = Column(
        String(30),
        nullable=False
    )

    failure_reason = Column(
        String(100),
        nullable=True
    )

    attempts = Column(
        Integer,
        default=1
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
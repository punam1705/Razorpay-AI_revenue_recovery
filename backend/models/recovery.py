from datetime import datetime

from sqlalchemy import (
    Column,
    DateTime,
    Float,
    Integer,
    String,
)

from database import Base


class Recovery(Base):
    __tablename__ = "recoveries"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    recovery_id = Column(
        String(100),
        unique=True,
        nullable=False,
        index=True
    )

    payment_id = Column(
        String(100),
        nullable=False,
        unique=True,
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

    strategy = Column(
        String(100),
        nullable=False
    )

    channel = Column(
        String(30),
        nullable=True
    )

    status = Column(
        String(50),
        default="PENDING"
    )

    recovered_amount = Column(
        Float,
        default=0
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
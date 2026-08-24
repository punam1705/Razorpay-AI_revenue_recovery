from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from database import get_db
from models.payment import Payment
from models.recovery import Recovery


router = APIRouter(
    prefix="/api/dashboard",
    tags=["Dashboard"],
)


@router.get("/summary")
def get_dashboard_summary(
    db: Session = Depends(get_db),
):
    total_payments = (
        db.query(func.count(Payment.id))
        .scalar()
        or 0
    )

    failed_payments = (
        db.query(func.count(Payment.id))
        .filter(
            Payment.status == "FAILED"
        )
        .scalar()
        or 0
    )

    total_recovered = (
        db.query(
            func.coalesce(
                func.sum(
                    Recovery.recovered_amount
                ),
                0,
            )
        )
        .scalar()
        or 0
    )

    recovered_count = (
        db.query(func.count(Recovery.id))
        .filter(
            Recovery.status == "RECOVERED"
        )
        .scalar()
        or 0
    )

    pending_approvals = (
        db.query(func.count(Recovery.id))
        .filter(
            Recovery.status
            == "APPROVAL_REQUIRED"
        )
        .scalar()
        or 0
    )

    return {
        "total_payments": total_payments,
        "failed_payments": failed_payments,
        "total_recovered": float(
            total_recovered
        ),
        "recovered_count": recovered_count,
        "pending_approvals": pending_approvals,
    }
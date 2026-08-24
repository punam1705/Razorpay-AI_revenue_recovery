
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.customer import Customer
from models.payment import Payment
from schemas.payment import PaymentCreate, PaymentResponse


router = APIRouter(
    prefix="/api/payments",
    tags=["Payments"],
)


@router.get(
    "",
    response_model=list[PaymentResponse],
)
def get_payments(
    db: Session = Depends(get_db),
):
    return (
        db.query(Payment)
        .order_by(Payment.created_at.desc())
        .all()
    )


@router.post(
    "",
    response_model=PaymentResponse,
    status_code=201,
)
def create_payment(
    payment_data: PaymentCreate,
    db: Session = Depends(get_db),
):

    # 1. Check customer exists
    customer = (
        db.query(Customer)
        .filter(
            Customer.customer_id
            == payment_data.customer_id
        )
        .first()
    )

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found",
        )

    # 2. Check duplicate payment
    existing_payment = (
        db.query(Payment)
        .filter(
            Payment.payment_id
            == payment_data.payment_id
        )
        .first()
    )

    if existing_payment:
        raise HTTPException(
            status_code=409,
            detail="Payment already exists",
        )

    # 3. Create payment
    payment = Payment(
        payment_id=payment_data.payment_id,
        customer_id=payment_data.customer_id,
        amount=payment_data.amount,
        status=payment_data.status,
        failure_reason=payment_data.failure_reason,
        attempts=payment_data.attempts,
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)

    return payment


@router.get(
    "/{payment_id}",
    response_model=PaymentResponse,
)
def get_payment(
    payment_id: str,
    db: Session = Depends(get_db),
):

    payment = (
        db.query(Payment)
        .filter(
            Payment.payment_id == payment_id
        )
        .first()
    )

    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found",
        )

    return payment

@router.post("/{payment_id}/retry")
def retry_payment(
    payment_id: str,
    db: Session = Depends(get_db),
):
    payment = (
        db.query(Payment)
        .filter(
            Payment.payment_id == payment_id
        )
        .first()
    )

    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found",
        )

    if payment.status != "FAILED":
        raise HTTPException(
            status_code=400,
            detail="Only failed payments can be retried.",
        )

    # Simulated retry
    payment.attempts += 1

    # For demo purposes:
    # retry succeeds on the second attempt
    if payment.attempts >= 2:
        payment.status = "SUCCESS"
    else:
        payment.status = "FAILED"

    db.commit()
    db.refresh(payment)

    return {
        "payment_id": payment.payment_id,
        "status": payment.status,
        "attempts": payment.attempts,
        "amount": payment.amount,
    }
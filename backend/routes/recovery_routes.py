from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.payment import Payment
from models.recovery import Recovery
from schemas.recovery import (
    RecoveryCreate,
    RecoveryResponse,
    RecoveryStatusUpdate,
)


router = APIRouter(
    prefix="/api/recoveries",
    tags=["Recoveries"],
)


VALID_STATUSES = {
    "PENDING",
    "AI_ANALYZED",
    "APPROVAL_REQUIRED",
    "APPROVED",
    "MESSAGE_SENT",
    "RECOVERED",
    "REJECTED",
}

VALID_TRANSITIONS = {
    "PENDING": {
        "AI_ANALYZED",
    },

    "AI_ANALYZED": {
        "APPROVAL_REQUIRED",
        "APPROVED",
        "REJECTED",
    },

    "APPROVAL_REQUIRED": {
        "APPROVED",
        "REJECTED",
    },

    "APPROVED": {
        "MESSAGE_SENT",
         "RECOVERED",
    },



    "MESSAGE_SENT": {
        "RECOVERED",
        "REJECTED",
    },

    "RECOVERED": set(),

    "REJECTED": set(),
}

@router.get(
    "",
    response_model=list[RecoveryResponse],
)
def get_recoveries(
    db: Session = Depends(get_db),
):
    return (
        db.query(Recovery)
        .order_by(Recovery.created_at.desc())
        .all()
    )


@router.post(
    "",
    response_model=RecoveryResponse,
    status_code=201,
)
def create_recovery(
    recovery_data: RecoveryCreate,
    db: Session = Depends(get_db),
):

    # Check payment
    payment = (
        db.query(Payment)
        .filter(
            Payment.payment_id
            == recovery_data.payment_id
        )
        .first()
    )

    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found",
        )

    # Recovery should only start for failed payments
    if payment.status.upper() != "FAILED":
        raise HTTPException(
            status_code=400,
            detail="Recovery can only be created for failed payments",
        )

    # Check duplicate recovery
    existing_recovery = (
        db.query(Recovery)
        .filter(
            Recovery.recovery_id
            == recovery_data.recovery_id
        )
        .first()
    )

    if existing_recovery:
        raise HTTPException(
            status_code=409,
            detail="Recovery already exists",
        )

    recovery = Recovery(
        recovery_id=recovery_data.recovery_id,
        payment_id=payment.payment_id,
        customer_id=payment.customer_id,
        amount=payment.amount,
        strategy=recovery_data.strategy,
        channel=recovery_data.channel,
        status="PENDING",
        recovered_amount=0,
    )

    db.add(recovery)
    db.commit()
    db.refresh(recovery)

    return recovery


@router.get(
    "/{recovery_id}",
    response_model=RecoveryResponse,
)
def get_recovery(
    recovery_id: str,
    db: Session = Depends(get_db),
):

    recovery = (
        db.query(Recovery)
        .filter(
            Recovery.recovery_id == recovery_id
        )
        .first()
    )

    if not recovery:
        raise HTTPException(
            status_code=404,
            detail="Recovery not found",
        )

    return recovery

@router.patch(
    "/{recovery_id}/status",
    response_model=RecoveryResponse,
)
def update_recovery_status(
    recovery_id: str,
    status_data: RecoveryStatusUpdate,
    db: Session = Depends(get_db),
):
    new_status = status_data.status.upper()

    # Validate status
    if new_status not in VALID_STATUSES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status: {new_status}",
        )

    # Find recovery
    recovery = (
        db.query(Recovery)
        .filter(
            Recovery.recovery_id == recovery_id
        )
        .first()
    )

    if not recovery:
        raise HTTPException(
            status_code=404,
            detail="Recovery not found",
        )

    # Current status
    current_status = recovery.status

    # Get allowed next statuses
    allowed_statuses = VALID_TRANSITIONS.get(
        current_status,
        set(),
    )

    # Check transition
    if new_status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Cannot move recovery from "
                f"{current_status} to {new_status}"
            ),
        )

    # Update status
    recovery.status = new_status

    # If recovered, update recovered amount
    if new_status == "RECOVERED":
        recovery.recovered_amount = recovery.amount

    db.commit()
    db.refresh(recovery)

    return recovery

# @router.post("/{recovery_id}/execute")
# def execute_recovery_action(
#     recovery_id: str,
#     db: Session = Depends(get_db),
# ):
#     recovery = (
#         db.query(Recovery)
#         .filter(
#             Recovery.recovery_id == recovery_id
#         )
#         .first()
#     )

#     if not recovery:
#         raise HTTPException(
#             status_code=404,
#             detail="Recovery not found",
#         )

#     if recovery.status != "APPROVED":
#         raise HTTPException(
#             status_code=400,
#             detail=(
#                 "Recovery must be APPROVED "
#                 "before execution."
#             ),
#         )

#     # Simulate recovery action
#     if recovery.strategy == "Retry Payment":

#         recovery.channel = "PAYMENT_RETRY"

#     elif recovery.strategy in {
#         "Personalized Reminder",
#         "Alternative Payment Method",
#         "Personalized Recovery Offer",
#     }:

#         recovery.channel = "WHATSAPP"

#     elif recovery.strategy == "Recovery Reminder":

#         recovery.channel = "EMAIL"

#     else:

#         recovery.channel = "UNKNOWN"

#     recovery.status = "MESSAGE_SENT"

#     db.commit()
#     db.refresh(recovery)

#     return recovery

@router.post("/{recovery_id}/execute")
def execute_recovery_action(
    recovery_id: str,
    db: Session = Depends(get_db),
):
    recovery = (
        db.query(Recovery)
        .filter(
            Recovery.recovery_id == recovery_id
        )
        .first()
    )

    if not recovery:
        raise HTTPException(
            status_code=404,
            detail="Recovery not found",
        )

    if recovery.status != "APPROVED":
        raise HTTPException(
            status_code=400,
            detail=(
                "Recovery must be APPROVED "
                "before execution."
            ),
        )

    payment = (
        db.query(Payment)
        .filter(
            Payment.payment_id
            == recovery.payment_id
        )
        .first()
    )

    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found.",
        )

    # Retry Payment
    if recovery.strategy == "Retry Payment":

        if payment.status != "FAILED":
            raise HTTPException(
                status_code=400,
                detail=(
                    "Only failed payments "
                    "can be retried."
                ),
            )

        payment.attempts += 1

        # Simulation
        if payment.attempts >= 2:
            payment.status = "SUCCESS"

            recovery.status = "RECOVERED"
            recovery.recovered_amount = (
                recovery.amount
            )

        else:
            payment.status = "FAILED"

            recovery.status = "MESSAGE_SENT"
            recovery.recovered_amount = 0

        recovery.channel = "PAYMENT_RETRY"

    else:

        # Other strategies are simulated
        recovery.channel = "RECOVERY_ACTION"
        recovery.status = "MESSAGE_SENT"

    db.commit()

    db.refresh(payment)
    db.refresh(recovery)

    return {
        "payment": {
            "payment_id": payment.payment_id,
            "status": payment.status,
            "attempts": payment.attempts,
        },
        "recovery": {
            "recovery_id": recovery.recovery_id,
            "status": recovery.status,
            "recovered_amount": (
                recovery.recovered_amount
            ),
        },
    }

@router.post("/{recovery_id}/result")
def update_recovery_result(
    recovery_id: str,
    recovered: bool,
    db: Session = Depends(get_db),
):
    recovery = (
        db.query(Recovery)
        .filter(
            Recovery.recovery_id == recovery_id
        )
        .first()
    )

    if not recovery:
        raise HTTPException(
            status_code=404,
            detail="Recovery not found",
        )

    if recovery.status != "MESSAGE_SENT":
        raise HTTPException(
            status_code=400,
            detail=(
                "Recovery must be in MESSAGE_SENT "
                "state before updating the result."
            ),
        )

    if recovered:
        recovery.status = "RECOVERED"
        recovery.recovered_amount = recovery.amount
    else:
        recovery.status = "REJECTED"
        recovery.recovered_amount = 0

    db.commit()
    db.refresh(recovery)

    return recovery


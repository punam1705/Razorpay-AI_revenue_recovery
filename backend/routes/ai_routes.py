
import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.ai_decision import AIDecision
from models.customer import Customer
from models.payment import Payment
from schemas.ai.decision import AIDecisionResponse
# from services.ai_service import analyze_payment
from services.ai_graph import ai_graph
from models.recovery import Recovery

router = APIRouter(
    prefix="/api/ai",
    tags=["AI"],
)


@router.post(
    "/analyze/{payment_id}",
    response_model=AIDecisionResponse,
)
def analyze_payment_endpoint(
    payment_id: str,
    db: Session = Depends(get_db),
):

    # Find payment
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

    # Find customer
    customer = (
        db.query(Customer)
        .filter(
            Customer.customer_id
            == payment.customer_id
        )
        .first()
    )

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found",
        )

    # Generate AI decision
    # decision = analyze_payment(
    #     payment=payment,
    #     customer=customer,
    # )
    initial_state = {
    "payment_id": payment.payment_id,
    "customer_id": customer.customer_id,
    "amount": payment.amount,
    "failure_reason": payment.failure_reason or "",
    "attempts": payment.attempts,
    "customer_name": customer.name,
    "customer_email": customer.email,
    "customer_phone": customer.phone or "",
}


    decision = ai_graph.invoke(
    initial_state
)
    # Save decision
    ai_decision = AIDecision(
        decision_id=f"AI-{uuid.uuid4().hex[:8].upper()}",
        payment_id=payment.payment_id,
        customer_id=customer.customer_id,
        recommendation=decision["recommendation"],
        confidence=decision["confidence"],
        risk=decision["risk"],
        reasoning=decision["reasoning"],
        requires_approval=decision["requires_approval"],
        execution_mode=decision["execution_mode"],
    )

    db.add(ai_decision)
    db.commit()
    db.refresh(ai_decision)

    existing_recovery = (
    db.query(Recovery)
    .filter(
        Recovery.payment_id
        == payment.payment_id
    )
    .first()
     )

    if existing_recovery:
        return {
    "decision_id": ai_decision.decision_id,
    "payment_id": ai_decision.payment_id,
    "customer_id": ai_decision.customer_id,
    "recommendation": ai_decision.recommendation,
    "confidence": ai_decision.confidence,
    "risk": ai_decision.risk,
    "reasoning": ai_decision.reasoning,
    "requires_approval": ai_decision.requires_approval,
    "execution_mode": ai_decision.execution_mode,
    "recovery_id": existing_recovery.recovery_id,
    "recovery_status": existing_recovery.status,
    "created_at": ai_decision.created_at,
     }
    
    recovery = Recovery(
    recovery_id=(
        f"REC-{uuid.uuid4().hex[:8].upper()}"
    ),
    payment_id=payment.payment_id,
    customer_id=customer.customer_id,
    amount=payment.amount,
    strategy=decision["recommendation"],
    channel=decision.get(
    "action_channel",
    "PENDING",
    ),
    status=decision["recovery_status"],
    recovered_amount=0,
)

    db.add(recovery)
    db.commit()
    db.refresh(recovery)

    # return ai_decision
    return {
    "decision_id": ai_decision.decision_id,
    "payment_id": ai_decision.payment_id,
    "customer_id": ai_decision.customer_id,
    "recommendation": ai_decision.recommendation,
    "confidence": ai_decision.confidence,
    "risk": ai_decision.risk,
    "reasoning": ai_decision.reasoning,
    "requires_approval": ai_decision.requires_approval,
    "execution_mode": ai_decision.execution_mode,
    "recovery_id": recovery.recovery_id,
    "recovery_status": recovery.status,
    "created_at": ai_decision.created_at,
}

# @router.get(
#     "/decisions",
#     response_model=list[AIDecisionResponse],
# )
# def get_ai_decisions(
#     db: Session = Depends(get_db),
# ):

#     return (
#         db.query(AIDecision)
#         .order_by(AIDecision.created_at.desc())
#         .all()
#     )

@router.get("/decisions")
def get_decisions(
    db: Session = Depends(get_db),
):

    decisions = (
        db.query(AIDecision)
        .order_by(
            AIDecision.created_at.desc()
        )
        .all()
    )

    result = []

    for decision in decisions:

        recovery = (
            db.query(Recovery)
            .filter(
                Recovery.payment_id
                == decision.payment_id
            )
            .first()
        )

        result.append({
            "decision_id": decision.decision_id,
            "payment_id": decision.payment_id,
            "customer_id": decision.customer_id,

            "recommendation":
                decision.recommendation,

            "confidence":
                decision.confidence,

            "risk":
                decision.risk,

            "reasoning":
                decision.reasoning,

            "requires_approval":
                decision.requires_approval,

            "execution_mode":
                decision.execution_mode,

            "recovery_id":
                recovery.recovery_id
                if recovery
                else None,

            "recovery_status":
                recovery.status
                if recovery
                else None,

            "created_at":
                decision.created_at,
        })

    return result
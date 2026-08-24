from models.payment import Payment
from models.customer import Customer


def analyze_payment(
    payment: Payment,
    customer: Customer,
) -> dict:

    reason = (
        payment.failure_reason or ""
    ).lower()

    # Bank downtime
    if "bank" in reason or "downtime" in reason:

        return {
            "payment_id": payment.payment_id,
            "recommendation": "Retry Payment",
            "confidence": 0.94,
            "risk": "LOW",
            "reasoning": (
                "The payment appears to have failed because "
                "of a temporary bank-side issue. A retry is "
                "more appropriate than offering a discount."
            ),
            "requires_approval": False,
        }

    # Checkout abandonment
    if "abandoned" in reason:

        return {
            "payment_id": payment.payment_id,
            "recommendation": "Personalized Reminder",
            "confidence": 0.91,
            "risk": "LOW",
            "reasoning": (
                "The customer reached checkout but did not "
                "complete the transaction. A personalized "
                "reminder is recommended."
            ),
            "requires_approval": False,
        }

    # Insufficient funds
    if "insufficient" in reason:

        return {
            "payment_id": payment.payment_id,
            "recommendation": "Alternative Payment Method",
            "confidence": 0.89,
            "risk": "MEDIUM",
            "reasoning": (
                "The payment failed because of insufficient "
                "funds. Suggesting another payment method "
                "is preferable to repeated retries."
            ),
            "requires_approval": False,
        }

    # High-value payment
    if payment.amount >= 50000:

        return {
            "payment_id": payment.payment_id,
            "recommendation": "Personalized Recovery Offer",
            "confidence": 0.86,
            "risk": "HIGH",
            "reasoning": (
                "This is a high-value failed payment. "
                "A recovery offer may improve conversion, "
                "but human approval is required."
            ),
            "requires_approval": True,
        }

    # Default
    return {
        "payment_id": payment.payment_id,
        "recommendation": "Recovery Reminder",
        "confidence": 0.82,
        "risk": "LOW",
        "reasoning": (
            "The payment appears potentially recoverable. "
            "A standard recovery reminder is recommended."
        ),
        "requires_approval": False,
    }
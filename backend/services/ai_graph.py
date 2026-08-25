from typing import TypedDict


class RecoveryAIState(TypedDict, total=False):

    payment_id: str
    customer_id: str

    amount: float
    failure_reason: str
    attempts: int

    customer_name: str
    customer_email: str
    customer_phone: str

    recommendation: str
    confidence: float
    risk: str
    reasoning: str
    requires_approval: bool
    execution_mode: str
    recovery_id: str
    recovery_status: str
    action_result: str
    action_channel: str

from services.llm import gemini

from langchain_core.prompts import ChatPromptTemplate

from services.llm import gemini
from schemas.ai.decision import AIDecisionOutput


structured_gemini = gemini.with_structured_output(
    AIDecisionOutput
)


def analyze_with_gemini(
    state: RecoveryAIState,
) -> RecoveryAIState:

    prompt = ChatPromptTemplate.from_template(
        """
You are an AI payment recovery analyst.

Analyze the failed payment and customer context.

Payment:
- Payment ID: {payment_id}
- Customer ID: {customer_id}
- Amount: {amount}
- Failure Reason: {failure_reason}
- Previous Attempts: {attempts}

Customer:
- Name: {customer_name}
- Email: {customer_email}
- Phone: {customer_phone}

Choose the most appropriate recovery strategy.

Available strategies:
- Retry Payment
- Personalized Reminder
- Alternative Payment Method
- Personalized Recovery Offer
- Recovery Reminder

Rules:

1. Temporary technical failures may be suitable
   for retry.

2. Insufficient funds should generally prefer
   an alternative payment method.

3. High-value recovery offers should require
   human approval.

4. Do not recommend aggressive or unsafe actions.

5. Confidence must be between 0 and 1.

6. Risk must be LOW, MEDIUM, or HIGH.

Return a structured decision.
"""
    )

    chain = prompt | structured_gemini

    result: AIDecisionOutput = chain.invoke(
        {
            "payment_id": state["payment_id"],
            "customer_id": state["customer_id"],
            "amount": state["amount"],
            "failure_reason": state["failure_reason"],
            "attempts": state["attempts"],
            "customer_name": state["customer_name"],
            "customer_email": state["customer_email"],
            "customer_phone": state["customer_phone"],
        }
    )

    return {
        **state,
        "recommendation": result.recommendation,
        "confidence": result.confidence,
        "risk": result.risk.upper(),
        "reasoning": result.reasoning,
        "requires_approval": result.requires_approval,
    }


from langgraph.graph import END, StateGraph


def apply_guardrails(
    state: RecoveryAIState,
) -> RecoveryAIState:

    confidence = state.get(
        "confidence",
        0,
    )

    risk = state.get(
        "risk",
        "HIGH",
    ).upper()

    amount = state.get(
        "amount",
        0,
    )

    # Start with AUTO_EXECUTE.
    # Guardrails will override this if required.
    requires_approval = False

    # Rule 1:
    # Low confidence requires human approval
    if confidence < 0.80:
        requires_approval = True

    # Rule 2:
    # High risk requires human approval
    if risk == "HIGH":
        requires_approval = True

    # Rule 3:
    # High-value transactions require human approval
    if amount >= 50000:
        requires_approval = True

    # Rule 4:
    # Invalid confidence requires human approval
    if confidence < 0 or confidence > 1:
        requires_approval = True

    if requires_approval:
        execution_mode = "HUMAN_APPROVAL"
    else:
        execution_mode = "AUTO_EXECUTE"

    return {
        **state,
        "requires_approval": requires_approval,
        "execution_mode": execution_mode,
    }

def execute_action(
    state: RecoveryAIState,
) -> RecoveryAIState:

    strategy = state.get(
        "recommendation",
        "",
    )

    if strategy == "Retry Payment":

        action_result = (
            "Payment retry initiated successfully."
        )

        action_channel = "PAYMENT_RETRY"

    elif strategy == "Personalized Reminder":

        action_result = (
            "Personalized recovery reminder "
            "queued successfully."
        )

        action_channel = "WHATSAPP"

    elif strategy == "Alternative Payment Method":

        action_result = (
            "Alternative payment method message "
            "queued successfully."
        )

        action_channel = "WHATSAPP"

    elif strategy == "Personalized Recovery Offer":

        action_result = (
            "Personalized recovery offer "
            "queued successfully."
        )

        action_channel = "WHATSAPP"

    elif strategy == "Recovery Reminder":

        action_result = (
            "Recovery reminder queued successfully."
        )

        action_channel = "EMAIL"

    else:

        action_result = (
            "Recovery action could not be determined."
        )

        action_channel = "UNKNOWN"

    return {
        **state,

        "execution_mode": "AUTO_EXECUTE",

        "recovery_status": "MESSAGE_SENT",

        "action_result": action_result,

        "action_channel": action_channel,
    }

def request_human_approval(
    state: RecoveryAIState,
) -> RecoveryAIState:

    return {
        **state,
        "execution_mode": "HUMAN_APPROVAL",
        "requires_approval": True,
        "recovery_status": "APPROVAL_REQUIRED",
    }

def route_after_guardrail(
    state: RecoveryAIState,
) -> str:

    if state.get("execution_mode") == "AUTO_EXECUTE":
        return "execute"

    return "approval"




def build_ai_graph():

    graph = StateGraph(
        RecoveryAIState
    )

    # Nodes
    graph.add_node(
        "analyze",
        analyze_with_gemini,
    )

    graph.add_node(
        "guardrail",
        apply_guardrails,
    )

    graph.add_node(
        "execute",
        execute_action,
    )

    graph.add_node(
        "approval",
        request_human_approval,
    )

    # Entry
    graph.set_entry_point(
        "analyze"
    )

    # Gemini → Guardrail
    graph.add_edge(
        "analyze",
        "guardrail",
    )

    # Guardrail → Conditional routing
    graph.add_conditional_edges(
        "guardrail",
        route_after_guardrail,
        {
            "execute": "execute",
            "approval": "approval",
        },
    )

    # End paths
    graph.add_edge(
        "execute",
        END,
    )

    graph.add_edge(
        "approval",
        END,
    )

    return graph.compile()

ai_graph = build_ai_graph()


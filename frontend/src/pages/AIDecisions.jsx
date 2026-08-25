
import { useEffect, useState } from "react";
import {
  Bot,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Clock3,
  User,
  CreditCard,
  X,
} from "lucide-react";

import {
  getAIDecisions,
} from "../services/aiService";


function AIDecisions() {
  const [selectedDecision, setSelectedDecision] = useState(null);
const [decisions, setDecisions] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

  const getRiskStyle = (risk) => {
    if (risk === "LOW") {
      return "bg-green-100 text-green-700";
    }

    if (risk === "MEDIUM") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-red-100 text-red-700";
  };

  const getStatusStyle = (status) => {
    if (status === "Recovered") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Executed" || status === "Message Sent") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-orange-100 text-orange-700";
  };

  useEffect(() => {
  const loadDecisions = async () => {
    try {
      setLoading(true);

      const data = await getAIDecisions();
 const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.decisions)
      ? data.decisions
      : Array.isArray(data?.data)
      ? data.data
      : [];
      setDecisions(list);
      // setDecisions(data);
    } catch (error) {
      console.error(
        "Failed to load AI decisions:",
        error
      );

      setError(
        "Unable to load AI decisions from server."
      );
    } finally {
      setLoading(false);
    }
  };

  loadDecisions();
}, []);


// useEffect(() => {
//   const loadDecisions = async () => {
//     try {
//       setLoading(true);

//       const data = await getAIDecisions();


//       setDecisions(Array.isArray(data) ? data : [data]);
//     } catch (error) {
//       console.error(
//         "Failed to load AI decisions:",
//         error
//       );

//       setError(
//         "Unable to load AI decisions from server."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   loadDecisions();
// }, []);

  return (
    <div className="p-8 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          AI Decisions
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Understand how the recovery agent analyzes failed payments
        </p>
      </div>

      {/* AI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Bot size={20} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                AI Decisions
              </p>

              <p className="text-2xl font-bold">
                156
              </p>
            </div>

          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-lg bg-green-100 text-green-700 flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Guardrails Passed
              </p>

              <p className="text-2xl font-bold">
                98.7%
              </p>
            </div>

          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
              <Clock3 size={20} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Awaiting Approval
              </p>

              <p className="text-2xl font-bold">
                5
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Decision Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

        <div className="p-6 border-b border-slate-200">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <Bot size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Recent AI Decisions
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                AI-generated recovery recommendations and validation status
              </p>
            </div>

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-slate-50">

              <tr>

                <th className="text-left px-6 py-4 text-slate-500">
                  Decision
                </th>

                <th className="text-left px-6 py-4 text-slate-500">
                  Customer
                </th>

                <th className="text-left px-6 py-4 text-slate-500">
                  Amount
                </th>

                <th className="text-left px-6 py-4 text-slate-500">
                  AI Recommendation
                </th>

                <th className="text-left px-6 py-4 text-slate-500">
                  Confidence
                </th>

                <th className="text-left px-6 py-4 text-slate-500">
                  Risk
                </th>

                <th className="text-left px-6 py-4 text-slate-500">
                  Execution
                </th>

                <th className="text-left px-6 py-4 text-slate-500">
                  Recovery
                </th>

                <th className="text-left px-6 py-4 text-slate-500">
                  Recovery Status
                </th>

                <th className="text-left px-6 py-4 text-slate-500">
                  Guardrail
                </th>

                <th className="text-right px-6 py-4 text-slate-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

{loading ? (
  <tr>
    <td
      colSpan="8"
      className="text-center py-12 text-slate-500"
    >
      Loading AI decisions...
    </td>
  </tr>
) : error ? (
  <tr>
    <td
      colSpan="8"
      className="text-center py-12 text-red-500"
    >
      {error}
    </td>
  </tr>
) : decisions.length === 0 ? (
  <tr>
    <td
      colSpan="8"
      className="text-center py-12 text-slate-500"
    >
      No AI decisions found
    </td>
  </tr>
) : (
  decisions.map((decision) => (
    <tr
      key={decision.decision_id}
      className="border-t border-slate-100 hover:bg-slate-50"
    >
      <td className="px-6 py-4">
        <p className="font-medium">
          {decision.decision_id}
        </p>

        <p className="text-xs text-slate-400">
          {decision.payment_id}
        </p>
      </td>

      <td className="px-6 py-4">
        {decision.customer_id}
      </td>

      <td className="px-6 py-4">
        <span className="font-medium">
          {decision.recommendation}
        </span>
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-2">

          <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-800 rounded-full"
              style={{
                width: `${
                  decision.confidence * 100
                }%`,
              }}
            />
          </div>

          <span className="text-xs">
            {Math.round(
              decision.confidence * 100
            )}
            %
          </span>

        </div>
      </td>

      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskStyle(
            decision.risk
          )}`}
        >
          {decision.risk}
        </span>
      </td>

<td className="px-6 py-4">
  <span
    className={`px-3 py-1 rounded-full text-xs font-medium ${
      decision.execution_mode === "AUTO_EXECUTE"
        ? "bg-green-100 text-green-700"
        : "bg-orange-100 text-orange-700"
    }`}
  >
    {decision.execution_mode === "AUTO_EXECUTE"
      ? "Auto Execute"
      : "Human Approval"}
  </span>
</td>

<td className="px-6 py-4">
  {decision.recovery_id ? (
    <span className="text-sm font-medium text-slate-700">
      {decision.recovery_id}
    </span>
  ) : (
    <span className="text-slate-400">
      —
    </span>
  )}
</td>

<td className="px-6 py-4">
  {decision.recovery_status ? (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        decision.recovery_status ===
        "RECOVERED"
          ? "bg-green-100 text-green-700"
          : decision.recovery_status ===
            "APPROVAL_REQUIRED"
          ? "bg-orange-100 text-orange-700"
          : decision.recovery_status ===
            "MESSAGE_SENT"
          ? "bg-blue-100 text-blue-700"
          : "bg-slate-100 text-slate-700"
      }`}
    >
      {decision.recovery_status}
    </span>
  ) : (
    "—"
  )}
</td>

{/* <td className="px-6 py-4">
  <span className="text-sm text-slate-700">
    {decision.recovery_status || "—"}
  </span>
</td> */}

      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            decision.requires_approval
              ? "bg-orange-100 text-orange-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {decision.requires_approval
            ? "Approval Required"
            : "Passed"}
        </span>
      </td>

      <td className="px-6 py-4">
        {decision.requires_approval ? (
          <span className="text-xs text-orange-600">
            Human Review
          </span>
        ) : (
          <span className="text-xs text-green-600">
            Auto Eligible
          </span>
        )}
      </td>

      <td className="px-6 py-4 text-right">
        <button
          onClick={() =>
            setSelectedDecision(decision)
          }
          className="px-3 py-2 border border-slate-200 rounded-lg text-xs hover:bg-slate-100"
        >
          View Analysis
        </button>
      </td>
    </tr>
  ))
)}
            </tbody>

          </table>

        </div>

      </div>

   
{selectedDecision && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

    <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl">

      {/* =========================
          MODAL HEADER
      ========================== */}

      <div className="flex justify-between items-center p-6 border-b">

        <div>
          <h2 className="font-semibold text-lg text-slate-900">
            AI Decision Analysis
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            {selectedDecision.decision_id}
          </p>
        </div>

        <button
          onClick={() => setSelectedDecision(null)}
          className="p-2 rounded-lg hover:bg-slate-100"
        >
          <X size={18} />
        </button>

      </div>


      {/* =========================
          MODAL BODY
      ========================== */}

      <div className="p-6 space-y-6">


        {/* =========================
            1. PAYMENT INFORMATION
        ========================== */}

        <div>

          <h3 className="font-semibold text-slate-900 mb-3">
            Payment Information
          </h3>

          <div className="grid grid-cols-2 gap-4">

            <div className="bg-slate-50 rounded-lg p-4">

              <p className="text-xs text-slate-500">
                Payment ID
              </p>

              <p className="font-medium mt-1">
                {selectedDecision.payment_id}
              </p>

            </div>


            <div className="bg-slate-50 rounded-lg p-4">

              <p className="text-xs text-slate-500">
                Customer ID
              </p>

              <p className="font-medium mt-1">
                {selectedDecision.customer_id}
              </p>

            </div>

          </div>

        </div>


        {/* =========================
            2. AI RECOMMENDATION
        ========================== */}

        <div className="bg-slate-50 rounded-xl p-5">

          <p className="text-xs text-slate-500">
            AI Recommended Action
          </p>

          <h3 className="text-xl font-bold text-slate-900 mt-2">
            {selectedDecision.recommendation}
          </h3>

        </div>


        {/* =========================
            3. CONFIDENCE + RISK
        ========================== */}

        <div className="grid grid-cols-2 gap-4">

          {/* Confidence */}

          <div className="border border-slate-200 rounded-lg p-4">

            <p className="text-xs text-slate-500">
              AI Confidence
            </p>

            <div className="flex items-center gap-3 mt-2">

              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">

                <div
                  className="h-full bg-slate-800 rounded-full"
                  style={{
                    width: `${
                      selectedDecision.confidence * 100
                    }%`,
                  }}
                />

              </div>

              <span className="text-sm font-semibold">
                {Math.round(
                  selectedDecision.confidence * 100
                )}
                %
              </span>

            </div>

          </div>


          {/* Risk */}

          <div className="border border-slate-200 rounded-lg p-4">

            <p className="text-xs text-slate-500">
              Risk Level
            </p>

            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                selectedDecision.risk === "LOW"
                  ? "bg-green-100 text-green-700"
                  : selectedDecision.risk === "MEDIUM"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {selectedDecision.risk}
            </span>

          </div>

        </div>


        {/* =========================
            4. AI REASONING
        ========================== */}

        <div>

          <h3 className="font-semibold text-slate-900 mb-2">
            AI Decision Reasoning
          </h3>

          <div className="border border-slate-200 rounded-lg p-4">

            <p className="text-sm text-slate-600 leading-6">
              {selectedDecision.reasoning}
            </p>

          </div>

        </div>


<div className="border border-slate-200 rounded-xl p-5">

  <h3 className="font-semibold text-slate-900 mb-4">
    Guardrail Decision
  </h3>

  <div className="grid grid-cols-2 gap-4">

    <div>
      <p className="text-xs text-slate-500">
        Execution Mode
      </p>

      <p className="font-medium mt-1">
        {selectedDecision.execution_mode}
      </p>
    </div>

    <div>
      <p className="text-xs text-slate-500">
        Approval Required
      </p>

      <p className="font-medium mt-1">
        {selectedDecision.requires_approval
          ? "Yes"
          : "No"}
      </p>
    </div>

  </div>

</div>


        {/* =========================
            5. GUARDRAIL STATUS
        ========================== */}

        <div
          className={`rounded-xl p-5 border ${
            selectedDecision.requires_approval
              ? "border-orange-200 bg-orange-50"
              : "border-green-200 bg-green-50"
          }`}
        >

          <div className="flex items-start gap-3">

            <ShieldCheck
              size={21}
              className={
                selectedDecision.requires_approval
                  ? "text-orange-600"
                  : "text-green-600"
              }
            />

            <div>

              <p
                className={`font-semibold ${
                  selectedDecision.requires_approval
                    ? "text-orange-800"
                    : "text-green-800"
                }`}
              >
                {selectedDecision.requires_approval
                  ? "Human Approval Required"
                  : "Guardrail Validation Passed"}
              </p>

              <p
                className={`text-xs mt-1 ${
                  selectedDecision.requires_approval
                    ? "text-orange-700"
                    : "text-green-700"
                }`}
              >
                {selectedDecision.requires_approval
                  ? "This recovery action cannot be executed automatically and requires merchant approval."
                  : "The AI recommendation passed the configured validation rules and is eligible for the next workflow step."}
              </p>

            </div>

          </div>

        </div>
<div className="border border-slate-200 rounded-xl p-5">

  <h3 className="font-semibold text-slate-900 mb-4">
    Linked Recovery
  </h3>

  <div className="grid grid-cols-2 gap-4">

    <div>
      <p className="text-xs text-slate-500">
        Recovery ID
      </p>

      <p className="font-medium mt-1">
        {selectedDecision.recovery_id || "—"}
      </p>
    </div>

    <div>
      <p className="text-xs text-slate-500">
        Recovery Status
      </p>

      <p className="font-medium mt-1">
        {selectedDecision.recovery_status || "—"}
      </p>
    </div>

  </div>

</div>


        {/* =========================
            6. CLOSE BUTTON
        ========================== */}

        <button
          onClick={() => setSelectedDecision(null)}
          className="w-full py-3 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800"
        >
          Close Analysis
        </button>

      </div>

    </div>

  </div>
)}
    </div>
  );
}

export default AIDecisions;
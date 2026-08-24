
import {useEffect, useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Bot,
  User,
  CreditCard,
  X,
} from "lucide-react";

import {
  getRecoveries,
  updateRecoveryStatus,
   executeRecovery,
} from "../services/recoveryService";


function Approvals() {
  
  const [approvals, setApprovals] = useState([]);

const [loading, setLoading] = useState(true);

const [error, setError] = useState("");

const [selectedApproval, setSelectedApproval] =
  useState(null);

  // const approveAction = (id) => {
  //   setApprovals((current) =>
  //     current.map((item) =>
  //       item.id === id
  //         ? { ...item, status: "Approved" }
  //         : item
  //     )
  //   );

  //   setSelectedApproval(null);
  // };

  // const rejectAction = (id) => {
  //   setApprovals((current) =>
  //     current.map((item) =>
  //       item.id === id
  //         ? { ...item, status: "Rejected" }
  //         : item
  //     )
  //   );

  //   setSelectedApproval(null);
  // };

//   const handleApproval = async (
//   recoveryId,
//   status
// ) => {
//   try {
//     const updatedRecovery =
//       await updateRecoveryStatus(
//         recoveryId,
//         status
//       );

//     setApprovals((current) =>
//       current.filter(
//         (approval) =>
//           approval.recovery_id !==
//           updatedRecovery.recovery_id
//       )
//     );

//     setSelectedApproval(null);
//   } catch (error) {
//     console.error(
//       "Failed to update approval:",
//       error
//     );

//     setError(
//       "Unable to update approval status."
//     );
//   }
// };

const handleApproval = async (
  recoveryId,
  status
) => {
  try {
    setError("");

    const updatedRecovery =
      await updateRecoveryStatus(
        recoveryId,
        status
      );

    if (status === "APPROVED") {
      await executeRecovery(
        recoveryId
      );
    }

    setApprovals((current) =>
      current.filter(
        (approval) =>
          approval.recovery_id !==
          recoveryId
      )
    );

    setSelectedApproval(null);

  } catch (error) {
    console.error(
      "Failed to process recovery:",
      error
    );

    setError(
      error.response?.data?.detail ||
        "Unable to process recovery action."
    );
  }
};

  const getRiskStyle = (risk) => {
    if (risk === "HIGH") {
      return "bg-red-100 text-red-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  // const pendingCount = approvals.filter(
  //   (item) => item.status === "Pending"
  // ).length;

  const pendingCount = approvals.length;

  const approvedCount = approvals.filter(
    (item) => item.status === "Approved"
  ).length;

  const rejectedCount = approvals.filter(
    (item) => item.status === "Rejected"
  ).length;

  useEffect(() => {
  const loadApprovals = async () => {
    try {
      setLoading(true);

      const recoveries = await getRecoveries();

      const approvalRequests = recoveries.filter(
        (recovery) =>
          recovery.status === "APPROVAL_REQUIRED"
      );

      setApprovals(approvalRequests);
    } catch (error) {
      console.error(
        "Failed to load approvals:",
        error
      );

      setError(
        "Unable to load approval requests."
      );
    } finally {
      setLoading(false);
    }
  };

  loadApprovals();
}, []);

  return (
    <div className="p-8 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Approvals
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Review AI recovery actions before they are executed
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
              <AlertTriangle size={20} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Pending
              </p>

              <p className="text-2xl font-bold">
                {pendingCount}
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
                Approved
              </p>

              <p className="text-2xl font-bold">
                {approvedCount}
              </p>
            </div>

          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
              <XCircle size={20} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Rejected
              </p>

              <p className="text-2xl font-bold">
                {rejectedCount}
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Approval List */}
      {/* <div className="space-y-4">

        {approvals.map((selectedApproval) => (

          <div
            key={selectedApproval.recovery_id}
            className="bg-white border border-slate-200 rounded-xl p-6"
          >

            
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

              <div className="flex items-start gap-4">

                <div className="w-11 h-11 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <ShieldCheck size={21} />
                </div>

                <div>

                  <div className="flex items-center gap-3">

                    <h2 className="font-semibold text-slate-900">
                      {selectedApproval.strategy}
                    </h2>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskStyle(
                        selectedApproval.risk
                      )}`}
                    >
                      {selectedApproval.risk} Risk
                    </span>

                  </div>

                  <p className="text-sm text-slate-500 mt-1">
                    {selectedApproval.recovery_id} · {selectedApproval.payment_id}
                  </p>

                </div>

              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
                  selectedApproval.status === "Pending"
                    ? "bg-orange-100 text-orange-700"
                    : selectedApproval.status === "Approved"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {selectedApproval.status}
              </span>

            </div>

            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">

              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-500">
                  Customer
                </p>

                <p className="font-medium mt-1">
                  {selectedApproval.customer_id}
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-500">
                  Payment Amount
                </p>

                <p className="font-medium mt-1">
                  ₹{selectedApproval.amount.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-500">
                  Failure Reason
                </p>

                <p className="font-medium mt-1">
                  {selectedApproval.reason}
                </p>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-500">
                  AI Confidence
                </p>

                <p className="font-medium mt-1">
                  {selectedApproval.confidence}%
                </p>
              </div>

            </div>

            
            <div className="mt-5 border border-slate-200 rounded-lg p-5">

              <div className="flex items-center gap-2">
                <Bot size={18} />
                <h3 className="font-semibold">
                  AI Recommendation
                </h3>
              </div>


              <div className="flex flex-wrap gap-3 mt-4">

                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                  Channel: {selectedApproval.channel}
                </span>

                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                  Guardrails Passed
                </span>

              </div>

            </div>

            
            {selectedApproval.status === "Pending" && (

              <div className="flex justify-end gap-3 mt-5">

                <button
               
               onClick={() =>
  handleApproval(
     selectedApproval.recovery_id,
    "REJECTED"
  )
}
                  className="flex items-center gap-2 px-5 py-2.5 border border-red-200 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50"
                >
                  <XCircle size={17} />
                  Reject
                </button>

                <button
                  onClick={() => setSelectedApproval(selectedApproval)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800"
                >
                  <CheckCircle2 size={17} />
                  Review & Approve
                </button>

              </div>

            )}

          </div>

        ))}

        {loading ? (
  <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
    <p className="text-slate-500">
      Loading approval requests...
    </p>
  </div>
) : error ? (
  <div className="bg-white border border-red-200 rounded-xl p-12 text-center">
    <p className="text-red-500">
      {error}
    </p>
  </div>
) :
        approvals.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
            <ShieldCheck
              size={40}
              className="mx-auto text-slate-400"
            />

            <h3 className="font-semibold mt-4">
              No approval requests
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              All AI recovery actions have been reviewed.
            </p>
          </div>
        )}

      </div> */}
{/* Approval List */}
<div className="space-y-4">

  {approvals.map((approval) => (

    <div
      key={approval.recovery_id}
      className="bg-white border border-slate-200 rounded-xl p-6"
    >

      {/* Top */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

        <div className="flex items-start gap-4">

          <div className="w-11 h-11 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
            <ShieldCheck size={21} />
          </div>

          <div>

            <div className="flex items-center gap-3">

              <h2 className="font-semibold text-slate-900">
                {approval.strategy}
              </h2>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskStyle(
                  approval.risk
                )}`}
              >
                {approval.risk} Risk
              </span>

            </div>

            <p className="text-sm text-slate-500 mt-1">
              {approval.recovery_id} · {approval.payment_id}
            </p>

          </div>

        </div>

        <span className="px-3 py-1 rounded-full text-xs font-medium w-fit bg-orange-100 text-orange-700">
          Approval Required
        </span>

      </div>


      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">

        <div className="bg-slate-50 rounded-lg p-4">
          <p className="text-xs text-slate-500">
            Customer
          </p>

          <p className="font-medium mt-1">
            {approval.customer_id}
          </p>
        </div>


        <div className="bg-slate-50 rounded-lg p-4">
          <p className="text-xs text-slate-500">
            Payment Amount
          </p>

          <p className="font-medium mt-1">
            ₹{approval.amount.toLocaleString("en-IN")}
          </p>
        </div>


        <div className="bg-slate-50 rounded-lg p-4">
          <p className="text-xs text-slate-500">
            Failure Reason
          </p>

          <p className="font-medium mt-1">
            {approval.reason}
          </p>
        </div>


        <div className="bg-slate-50 rounded-lg p-4">
          <p className="text-xs text-slate-500">
            AI Confidence
          </p>

          <p className="font-medium mt-1">
            {approval.confidence}%
          </p>
        </div>

      </div>


      {/* AI Recommendation */}
      <div className="mt-5 border border-slate-200 rounded-lg p-5">

        <div className="flex items-center gap-2">
          <Bot size={18} />

          <h3 className="font-semibold">
            AI Recommendation
          </h3>
        </div>


        <div className="flex flex-wrap gap-3 mt-4">

          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
            Channel: {approval.channel}
          </span>

          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
            Guardrails Passed
          </span>

        </div>

      </div>


      {/* Actions */}
      <div className="flex justify-end gap-3 mt-5">

        {/* Reject */}
        <button
          onClick={() =>
            handleApproval(
              approval.recovery_id,
              "REJECTED"
            )
          }
          className="flex items-center gap-2 px-5 py-2.5 border border-red-200 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50"
        >
          <XCircle size={17} />
          Reject
        </button>


        {/* Review & Approve */}
        <button
          onClick={() => setSelectedApproval(approval)}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800"
        >
          <CheckCircle2 size={17} />
          Review & Approve
        </button>

      </div>

    </div>

  ))}


  {/* Loading */}
  {loading && (
    <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
      <p className="text-slate-500">
        Loading approval requests...
      </p>
    </div>
  )}


  {/* Error */}
  {!loading && error && (
    <div className="bg-white border border-red-200 rounded-xl p-12 text-center">
      <p className="text-red-500">
        {error}
      </p>
    </div>
  )}


  {/* Empty State */}
  {!loading && !error && approvals.length === 0 && (
    <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">

      <ShieldCheck
        size={40}
        className="mx-auto text-slate-400"
      />

      <h3 className="font-semibold mt-4">
        No approval requests
      </h3>

      <p className="text-sm text-slate-500 mt-1">
        All AI recovery actions have been reviewed.
      </p>

    </div>
  )}

</div>

      {/* Approval Modal */}
      {selectedApproval && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-xl w-full max-w-xl shadow-xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>

                <div>

                  <h2 className="font-semibold text-lg">
                    Review Recovery Action
                  </h2>

                  <p className="text-xs text-slate-500">
                    {selectedApproval.recovery_id}
                  </p>

                </div>

              </div>

              <button
                onClick={() => setSelectedApproval(null)}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>

            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">

              {/* Payment */}
              <div className="border border-slate-200 rounded-lg p-4">

                <div className="flex items-center gap-2 mb-4">
                  <CreditCard size={17} />
                  <h3 className="font-semibold">
                    Payment
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <p className="text-xs text-slate-500">
                      Customer
                    </p>

                    <p className="font-medium mt-1">
                      {selectedApproval.customer}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Amount
                    </p>

                    <p className="font-medium mt-1">
                      ₹
                      {selectedApproval.amount.toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Payment ID
                    </p>

                    <p className="font-medium mt-1">
                      {selectedApproval.paymentId}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Failure
                    </p>

                    <p className="font-medium mt-1">
                      {selectedApproval.reason}
                    </p>
                  </div>

                </div>

              </div>

              {/* AI Decision */}
              <div className="bg-slate-50 rounded-lg p-5">

                <div className="flex items-center gap-2">
                  <Bot size={18} />
                  <h3 className="font-semibold">
                    AI Decision
                  </h3>
                </div>

                <p className="text-lg font-bold mt-3">
                  {selectedApproval.recommendation}
                </p>
{/* 
                <p className="text-sm text-slate-600 mt-2 leading-6">
                  {selectedApproval.reasonText}
                </p> */}

              </div>

              {/* Safety */}
              <div className="border border-green-200 bg-green-50 rounded-lg p-4">

                <div className="flex gap-3">

                  <ShieldCheck
                    size={20}
                    className="text-green-700 mt-0.5"
                  />

                  <div>

                    <p className="font-semibold text-green-800">
                      Guardrails Passed
                    </p>

                    <p className="text-xs text-green-700 mt-1">
                      The AI recommendation has passed the
                      configured validation rules.
                    </p>

                  </div>

                </div>

              </div>

              {/* Human Approval */}
              <div className="border border-orange-200 bg-orange-50 rounded-lg p-4">

                <div className="flex gap-3">

                  <User
                    size={20}
                    className="text-orange-700 mt-0.5"
                  />

                  <div>

                    <p className="font-semibold text-orange-800">
                      Your approval is required
                    </p>

                    <p className="text-xs text-orange-700 mt-1">
                      Approving this action will allow the
                      recovery workflow to continue.
                    </p>

                  </div>

                </div>

              </div>

              {/* Buttons */}
              <div className="flex gap-3">

                <button
                  onClick={() =>
                    rejectAction(selectedApproval.id)
                  }
                  className="flex-1 flex items-center justify-center gap-2 py-3 border border-red-200 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50"
                >
                  <XCircle size={17} />
                  Reject
                </button>

                <button
                  // onClick={() =>
                  //   approveAction(selectedApproval.id)
                  // }
                  onClick={() =>
  handleApproval(
     selectedApproval.recovery_id,
    "APPROVED"
  )
}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800"
                >
                  <CheckCircle2 size={17} />
                  Approve Action
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Approvals;
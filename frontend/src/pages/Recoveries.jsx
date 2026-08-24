
import { useEffect, useMemo, useState } from "react";


import {
  getRecoveries,
  updateRecoveryStatus,
  updateRecoveryResult,
} from "../services/recoveryService";

import {
  RotateCcw,
  Search,
  Eye,
  X,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Send,
} from "lucide-react";


function Recoveries() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRecovery, setSelectedRecovery] = useState(null);
const [recoveries, setRecoveries] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

  const filteredRecoveries = useMemo(() => {
    return recoveries.filter((recovery) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        recovery.recovery_id.toLowerCase().includes(searchValue) ||
        recovery.payment_id.toLowerCase().includes(searchValue) ||
        recovery.customer_id.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        recovery.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  
  const getStatusStyle = (status) => {
  switch (status) {
    case "PENDING":
      return "bg-slate-100 text-slate-700";

    case "AI_ANALYZED":
      return "bg-blue-100 text-blue-700";

    case "APPROVAL_REQUIRED":
      return "bg-orange-100 text-orange-700";

    case "APPROVED":
      return "bg-green-100 text-green-700";

    case "MESSAGE_SENT":
      return "bg-purple-100 text-purple-700";

    case "RECOVERED":
      return "bg-emerald-100 text-emerald-700";

    case "REJECTED":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
};

  const getStatusIcon = (status) => {
    switch (status) {
      case "Recovered":
        return <CheckCircle2 size={15} />;

      case "Approval Required":
        return <AlertCircle size={15} />;

      case "Message Sent":
        return <Send size={15} />;

      default:
        return <Clock3 size={15} />;
    }
  };

  const changeRecoveryStatus = async (
  recoveryId,
  status
) => {
  try {
    const updatedRecovery =
      await updateRecoveryStatus(
        recoveryId,
        status
      );

    setRecoveries((current) =>
      current.map((recovery) =>
        recovery.recovery_id === recoveryId
          ? updatedRecovery
          : recovery
      )
    );

  } catch (error) {
    console.error(
      "Failed to update recovery status:",
      error
    );

    setError(
      "Unable to update recovery status."
    );
  }
};

const handleRecoveryResult = async (
  recoveryId,
  recovered
) => {
  try {
    setError("");

    const updatedRecovery =
      await updateRecoveryResult(
        recoveryId,
        recovered
      );

    setRecoveries((current) =>
      current.map((recovery) =>
        recovery.recovery_id === recoveryId
          ? updatedRecovery
          : recovery
      )
    );
  } catch (error) {
    console.error(
      "Failed to update recovery result:",
      error
    );

    setError(
      error.response?.data?.detail ||
        "Unable to update recovery result."
    );
  }
};

useEffect(() => {
  const loadRecoveries = async () => {
    try {
      setLoading(true);

      const data = await getRecoveries();

      setRecoveries(data);
    } catch (error) {
      console.error(
        "Failed to load recoveries:",
        error
      );

      setError(
        "Unable to load recoveries from server."
      );
    } finally {
      setLoading(false);
    }
  };

  loadRecoveries();
}, []);

  return (
    <div className="p-8 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Recoveries
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Track AI-powered payment recovery workflows
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-sm text-slate-500">
            Active Recoveries
          </p>

          <p className="text-2xl font-bold text-slate-900 mt-2">
            24
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Currently being processed
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-sm text-slate-500">
            Revenue Recovered
          </p>

          <p className="text-2xl font-bold text-slate-900 mt-2">
            ₹95,000
          </p>

          <p className="text-xs text-green-600 mt-1">
            +18.4% this month
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-sm text-slate-500">
            Pending Approval
          </p>

          <p className="text-2xl font-bold text-slate-900 mt-2">
            5
          </p>

          <p className="text-xs text-orange-600 mt-1">
            Requires human review
          </p>
        </div>

      </div>

      {/* Search and Filter */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-3">

        <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 flex-1">

          <Search
            size={18}
            className="text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recovery, payment or customer..."
            className="outline-none w-full text-sm py-2"
          />

        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Message Sent">Message Sent</option>
          <option value="Approval Required">
            Approval Required
          </option>
          <option value="Recovered">Recovered</option>
        </select>

      </div>

      {/* Recovery Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

        <div className="p-6 border-b border-slate-200 flex items-center gap-3">

          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
            <RotateCcw size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Recovery Workflows
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              {filteredRecoveries.length} recovery workflows
            </p>
          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-slate-50">

              <tr>
                <th className="text-left px-6 py-4 text-slate-500">
                  Recovery ID
                </th>

                <th className="text-left px-6 py-4 text-slate-500">
                  Customer
                </th>

                <th className="text-left px-6 py-4 text-slate-500">
                  Amount
                </th>

                <th className="text-left px-6 py-4 text-slate-500">
                  Strategy
                </th>

                <th className="text-left px-6 py-4 text-slate-500">
                  Channel
                </th>

                <th className="text-left px-6 py-4 text-slate-500">
                  Status
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
      Loading recoveries...
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
) :
              filteredRecoveries.length === 0 ? (

                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-12 text-slate-500"
                  >
                    No recovery workflows found
                  </td>
                </tr>

              ) : (

                filteredRecoveries.map((recovery) => (

                  <tr
                    key={recovery.recovery_id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >

                    <td className="px-6 py-4">

                      <p className="font-medium text-slate-800">
                        {recovery.recovery_id}
                      </p>

                      <p className="text-xs text-slate-400">
                        {recovery.payment_id}
                      </p>

                    </td>

                    <td className="px-6 py-4">
                      {recovery.customer_id}
                    </td>

                    <td className="px-6 py-4 font-medium">
                      ₹{recovery.amount.toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {recovery.strategy}
                    </td>

                    <td className="px-6 py-4">
                      {recovery.channel  || "Not selected"}
                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                          recovery.status
                        )}`}
                      >
                        {getStatusIcon(recovery.status)}
                        {recovery.status}
                        {recovery.status === "MESSAGE_SENT" && (
  <div className="flex gap-2">

    <button
      onClick={() =>
        handleRecoveryResult(
          recovery.recovery_id,
          true
        )
      }
      className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium"
    >
      Mark Recovered
    </button>

    <button
      onClick={() =>
        handleRecoveryResult(
          recovery.recovery_id,
          false
        )
      }
      className="px-3 py-2 border border-red-200 text-red-700 rounded-lg text-xs font-medium"
    >
      Mark Failed
    </button>

  </div>
)}
                      </span>

                    </td>

                    <td className="px-6 py-4 text-right">

                      <button
                        onClick={() =>
                          setSelectedRecovery(recovery)
                        }
                        className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100"
                        title="View recovery"
                      >
                        <Eye size={16} />
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Recovery Details Modal */}
      {selectedRecovery && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl">

            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">

              <div>
                <h2 className="font-semibold text-lg">
                  Recovery Details
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  {selectedRecovery.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedRecovery(null)}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>

            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <p className="text-xs text-slate-500">
                    Customer
                  </p>

                  <p className="font-medium mt-1">
                    {selectedRecovery.customer_id}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Amount
                  </p>

                  <p className="font-medium mt-1">
                    ₹
                    {selectedRecovery.amount.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Strategy
                  </p>

                  <p className="font-medium mt-1">
                    {selectedRecovery.strategy}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Channel
                  </p>

                  <p className="font-medium mt-1">
                    {selectedRecovery.channel}
                  </p>
                </div>

              </div>

              {/* Workflow */}
              <div>

                <p className="text-sm font-semibold mb-4">
                  Recovery Workflow
                </p>

                <div className="space-y-4">

                  <div className="flex items-center gap-3">
                    <CheckCircle2
                      size={20}
                      className="text-green-600"
                    />

                    <div>
                      <p className="text-sm font-medium">
                        Payment Failure Detected
                      </p>

                      <p className="text-xs text-slate-500">
                        Payment event received
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CheckCircle2
                      size={20}
                      className="text-green-600"
                    />

                    <div>
                      <p className="text-sm font-medium">
                        AI Analysis Completed
                      </p>

                      <p className="text-xs text-slate-500">
                        Recovery strategy selected
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {selectedRecovery.status ===
                    "APPROVAL_REQUIRED" ? (
                      <AlertCircle
                        size={20}
                        className="text-orange-500"
                      />
                    ) : (
                      <CheckCircle2
                        size={20}
                        className="text-green-600"
                      />
                    )}

                    <div>
                      <p className="text-sm font-medium">
                        {selectedRecovery.status ===
                        "APPROVAL_REQUIRED"
                          ? "Human Approval Required"
                          : "Recovery Action Executed"}
                      </p>

                      <p className="text-xs text-slate-500">
                        {selectedRecovery.status ===
                        "APPROVAL_REQUIRED"
                          ? "Waiting for merchant approval"
                          : "Workflow moved to next stage"}
                      </p>
                    </div>
                  </div>

                </div>

              </div>

              {/* Reason */}
              <div className="bg-slate-50 rounded-lg p-4">

                <p className="text-xs text-slate-500">
                  Recovery Reason
                </p>

                <p className="text-sm text-slate-700 mt-1">
                  {selectedRecovery.reason}
                </p>

              </div>
{/* Approve / Reject Buttons */}
{selectedRecovery.status === "APPROVAL_REQUIRED" && (
  <div className="flex gap-3">

    {/* Approve Button */}
    <button
      onClick={() =>
        changeRecoveryStatus(
          selectedRecovery.recovery_id,
          "APPROVED"
        )
      }
      className="flex-1 py-3 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
    >
      Approve
    </button>

    {/* Reject Button */}
    <button
      onClick={() =>
        changeRecoveryStatus(
          selectedRecovery.recovery_id,
          "REJECTED"
        )
      }
      className="flex-1 py-3 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
    >
      Reject
    </button>

  </div>
)}

              <button
                onClick={() => setSelectedRecovery(null)}
                className="w-full py-3 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Recoveries;
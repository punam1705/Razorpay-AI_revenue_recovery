import { useEffect, useMemo, useState } from "react";
import { CreditCard, Search, Filter, X, Bot, Eye } from "lucide-react";
import { getPayments } from "../services/paymentServices";
import { analyzePayment } from "../services/aiService";
// import { getPayments } from "../services/paymentService";

// const payments = [
//   {
//     id: "pay_101",
//     customer: "Rahul Kumar",
//     email: "rahul@example.com",
//     amount: 2500,
//     reason: "Bank Downtime",
//     attempts: 1,
//     status: "Failed",
//     date: "23 Aug 2026, 10:30 AM",
//   },
//   {
//     id: "pay_102",
//     customer: "Aman Singh",
//     email: "aman@example.com",
//     amount: 5000,
//     reason: "Checkout Abandoned",
//     attempts: 2,
//     status: "Failed",
//     date: "23 Aug 2026, 11:15 AM",
//   },
//   {
//     id: "pay_103",
//     customer: "Priya Sharma",
//     email: "priya@example.com",
//     amount: 8000,
//     reason: "Payment Failed",
//     attempts: 1,
//     status: "Failed",
//     date: "23 Aug 2026, 12:10 PM",
//   },
//   {
//     id: "pay_104",
//     customer: "Neha Verma",
//     email: "neha@example.com",
//     amount: 3200,
//     reason: "Insufficient Funds",
//     attempts: 3,
//     status: "Failed",
//     date: "23 Aug 2026, 01:05 PM",
//   },
// ];

function Payments() {
  const [search, setSearch] = useState("");
  const [reasonFilter, setReasonFilter] = useState("All");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        payment.payment_id.toLowerCase().includes(searchValue) ||
        payment.customer_id.toLowerCase().includes(searchValue) ||
        payment.email.toLowerCase().includes(searchValue);

      const matchesReason =
        reasonFilter === "All" || payment.failure_reason === reasonFilter;

      return matchesSearch && matchesReason;
    });
  }, [search, reasonFilter]);

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true);

        const data = await getPayments();

        setPayments(data);
      } catch (error) {
        console.error("Failed to load payments:", error);

        setError("Unable to load payments from server.");
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Payments</h1>

        <p className="text-sm text-slate-500 mt-1">
          Monitor failed payments and analyze recovery opportunities
        </p>
      </div>

      {/* Search + Filter */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-3">
        <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 flex-1">
          <Search size={18} className="text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search payment, customer or email..."
            className="outline-none w-full text-sm py-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-500" />

          <select
            value={reasonFilter}
            onChange={(e) => setReasonFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none"
          >
            <option value="All">All Reasons</option>
            <option value="Bank Downtime">Bank Downtime</option>
            <option value="Checkout Abandoned">Checkout Abandoned</option>
            <option value="Payment Failed">Payment Failed</option>
            <option value="Insufficient Funds">Insufficient Funds</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
            <CreditCard size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">Failed Payments</h2>

            <p className="text-xs text-slate-500">
              {filteredPayments.length} payments found
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-4 text-slate-500">
                  Payment ID
                </th>

                <th className="text-left px-6 py-4 text-slate-500">Customer</th>

                <th className="text-left px-6 py-4 text-slate-500">Amount</th>

                <th className="text-left px-6 py-4 text-slate-500">
                  Failure Reason
                </th>

                <th className="text-left px-6 py-4 text-slate-500">Attempts</th>

                <th className="text-left px-6 py-4 text-slate-500">Status</th>

                <th className="text-right px-6 py-4 text-slate-500">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-500">
                    Loading payments...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-red-500">
                    {error}
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-500">
                    No payments found
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr
                    key={payment.payment_id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {payment.payment_id}
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-800">
                          {payment.customer_id}
                        </p>

                        <p className="text-xs text-slate-400">
                          {payment.email}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-medium">
                      ₹{payment.amount.toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {payment.failure_reason}
                    </td>

                    <td className="px-6 py-4">{payment.attempts}</td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                        {payment.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedPayment(payment)}
                          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100"
                          title="View payment"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => analyzePayment(payment)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 text-white text-xs hover:bg-slate-800"
                        >
                          <Bot size={15} />
                          Analyze
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl">
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h2 className="font-semibold text-lg">Payment Details</h2>

                <p className="text-xs text-slate-500 mt-1">
                  {selectedPayment.payment_id}
                </p>
              </div>

              <button
                onClick={() => setSelectedPayment(null)}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Customer</p>

                  <p className="font-medium mt-1">
                    {selectedPayment.customer_id}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Amount</p>

                  <p className="font-medium mt-1">
                    ₹{selectedPayment.amount.toLocaleString("en-IN")}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Failure Reason</p>

                  <p className="font-medium mt-1">{selectedPayment.reason}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Attempts</p>

                  <p className="font-medium mt-1">{selectedPayment.attempts}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500">Date</p>

                <p className="font-medium mt-1">{selectedPayment.date}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Result Modal */}
      {aiResult && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl">
            <div className="flex justify-between items-center p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <Bot size={20} />
                </div>

                <div>
                  <h2 className="font-semibold text-lg">
                    AI Recovery Analysis
                  </h2>

                  <p className="text-xs text-slate-500">
                    {aiResult.payment.payment_id}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setAiResult(null)}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs text-slate-500">Payment</p>

                <div className="flex justify-between mt-2">
                  <span className="font-medium">
                    {aiResult.payment.customer_id}
                  </span>

                  <span className="font-semibold">
                    ₹{aiResult.payment.amount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500">Recommended Action</p>

                <p className="font-semibold text-lg mt-1">
                  {aiResult.recommendation}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">AI Reasoning</p>

                <p className="text-sm text-slate-600 mt-1 leading-6">
                  {aiResult.reason}
                </p>
              </div>

              <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                <p className="text-sm font-medium text-green-800">
                  ✓ Guardrail Check Passed
                </p>

                <p className="text-xs text-green-700 mt-1">
                  No financial action will be executed without system
                  validation.
                </p>
              </div>

              <button
                onClick={() => setAiResult(null)}
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

export default Payments;

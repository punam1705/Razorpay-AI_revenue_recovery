import {
  useEffect,
  useState,
} from "react";

import {
  CreditCard,
  IndianRupee,
  TrendingUp,
  RotateCcw,
} from "lucide-react";

import StatCard from "../components/StatCard";

import {
  getDashboardSummary,
} from "../services/dashboardService";



const payments = [
  {
    id: "pay_101",
    customer: "Rahul Kumar",
    amount: "₹2,500",
    reason: "Bank Downtime",
    status: "Recovery Sent",
  },
  {
    id: "pay_102",
    customer: "Aman Singh",
    amount: "₹5,000",
    reason: "Checkout Abandoned",
    status: "Pending",
  },
  {
    id: "pay_103",
    customer: "Priya Sharma",
    amount: "₹8,000",
    reason: "Payment Failed",
    status: "Recovered",
  },
  {
    id: "pay_104",
    customer: "Neha Verma",
    amount: "₹3,200",
    reason: "Insufficient Funds",
    status: "Pending",
  },
];

function Dashboard() {
  const [summary, setSummary] = useState({
  total_payments: 0,
  failed_payments: 0,
  total_recovered: 0,
  recovered_count: 0,
  pending_approvals: 0,
});

const [loading, setLoading] = useState(true);

  useEffect(() => {
  const loadDashboard = async () => {
    try {
      const data =
        await getDashboardSummary();

      setSummary(data);
    } catch (error) {
      console.error(
        "Failed to load dashboard:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  loadDashboard();
}, []);

  return (
    <div className="p-8 space-y-8">

      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Revenue Overview
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Track failed payments and AI-powered recovery
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

        <StatCard
          title="Failed Payments"
          value={summary.failed_payments}
          subtitle="24 transactions"
          icon={CreditCard}
        />

        <StatCard
          title="Potential Recovery"
          value={summary.total_recovered.toLocaleString("en-IN")}
          subtitle="40% of failed revenue"
          icon={IndianRupee}
        />

        <StatCard
          title="Recovered Revenue"
          value={summary.recovered_count}
          subtitle="+18.4% this month"
          icon={TrendingUp}
        />

        <StatCard
          title="Recovery Rate"
          value="52.7%"
          subtitle="12 successful recoveries"
          icon={RotateCcw}
        />

      </div>

      {/* Revenue chart placeholder */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-semibold text-slate-900">
              Recovery Performance
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Revenue recovered over the last 7 days
            </p>
          </div>

          <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
          </select>
        </div>

        <div className="h-56 flex items-end gap-6 px-5">

          {[35, 55, 40, 70, 50, 80, 65].map((height, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <div
                className="w-full bg-slate-800 rounded-t-lg"
                style={{ height: `${height}%` }}
              />

              <span className="text-xs text-slate-400">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
              </span>
            </div>
          ))}

        </div>
      </div>

      {/* Recent payments */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

        <div className="p-6 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900">
            Recent Failed Payments
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Payments currently being evaluated for recovery
          </p>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left px-6 py-4 font-medium">
                  Payment ID
                </th>

                <th className="text-left px-6 py-4 font-medium">
                  Customer
                </th>

                <th className="text-left px-6 py-4 font-medium">
                  Amount
                </th>

                <th className="text-left px-6 py-4 font-medium">
                  Failure Reason
                </th>

                <th className="text-left px-6 py-4 font-medium">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>

              {payments.map((payment) => (
                <tr
                  key={payment.payment_id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {payment.payment_id}
                  </td>

                  <td className="px-6 py-4">
                    {payment.customer_id}
                  </td>

                  <td className="px-6 py-4 font-medium">
                    {payment.amount}
                  </td>

                  <td className="px-6 py-4 text-slate-500">
                    {payment.failure_reason}
                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        payment.status === "Recovered"
                          ? "bg-green-100 text-green-700"
                          : payment.status === "Recovery Sent"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {payment.status}
                    </span>

                  </td>
                </tr>
              ))}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}

export default Dashboard;
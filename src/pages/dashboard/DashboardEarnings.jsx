import Card from "../../components/Card";
import Button from "../../components/Button";
import Badge from "../../components/Badge";
import { DollarSign, ArrowUpRight, Download } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const chartData = [
  { month: "Jan", earnings: 180 },
  { month: "Feb", earnings: 220 },
  { month: "Mar", earnings: 310 },
  { month: "Apr", earnings: 280 },
  { month: "May", earnings: 420 },
  { month: "Jun", earnings: 380 },
  { month: "Jul", earnings: 450 },
  { month: "Aug", earnings: 520 },
  { month: "Sep", earnings: 486 },
];

const payouts = [
  {
    id: "PO-001",
    amount: "$450.00",
    date: "Sep 1, 2026",
    status: "Completed",
    method: "Stripe",
  },
  {
    id: "PO-002",
    amount: "$380.00",
    date: "Aug 1, 2026",
    status: "Completed",
    method: "Stripe",
  },
  {
    id: "PO-003",
    amount: "$420.00",
    date: "Jul 1, 2026",
    status: "Completed",
    method: "Stripe",
  },
  {
    id: "PO-004",
    amount: "$310.00",
    date: "Jun 1, 2026",
    status: "Completed",
    method: "Stripe",
  },
  {
    id: "PO-005",
    amount: "$220.00",
    date: "May 1, 2026",
    status: "Completed",
    method: "Stripe",
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-brew-border rounded-card px-4 py-2 shadow-card">
        <p className="font-inter text-xs text-brew-muted">{label}</p>
        <p className="font-inter font-bold text-sm text-brew-text">
          ${payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function DashboardEarnings() {
  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 animate-fade-up">
        <div>
          <div className="inline-block mb-3 px-4 py-1.5 border-2 border-brew-text bg-brew-yellow font-inter font-black text-xs uppercase tracking-widest rounded-full shadow-[2px_2px_0px_0px_currentColor] -rotate-1">
            Finances
          </div>
          <h1 className="font-inter font-black text-4xl md:text-5xl text-brew-text uppercase tracking-tight mb-2">
            Earnings
          </h1>
          <p className="font-inter font-bold text-brew-text/70">
            Track your income and manage your payouts.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-brew-text bg-brew-text text-[#fffdf0] font-inter font-black text-sm uppercase tracking-widest shadow-[4px_4px_0px_0px_#F5C518] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#F5C518] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all rounded-xl w-full sm:w-auto">
          <DollarSign size={18} strokeWidth={3} className="text-brew-yellow" />{" "}
          Request payout
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Total Earned", value: "$2,847.50", change: "+12.5%" },
          { label: "Available Balance", value: "$486.00", change: "Pending" },
          { label: "Total Payouts", value: "$2,361.50", change: "5 payouts" },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white border-4 border-brew-text p-6 rounded-2xl shadow-[6px_6px_0px_0px_currentColor] transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_currentColor] animate-fade-up flex flex-col"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex justify-between items-start mb-4">
              <p className="font-inter font-black text-xs text-brew-text/60 uppercase tracking-widest">
                {stat.label}
              </p>
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-brew-yellow-light border-2 border-brew-text font-inter font-black text-[10px] uppercase tracking-widest shadow-[2px_2px_0px_0px_currentColor]">
                <ArrowUpRight size={12} strokeWidth={3} />
                {stat.change}
              </span>
            </div>
            <p className="font-inter font-black text-4xl text-brew-text mt-auto tracking-tighter">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Earnings Chart */}
      <div className="bg-white border-4 border-brew-text rounded-[24px] p-6 md:p-8 shadow-[8px_8px_0px_0px_currentColor] mb-10 animate-fade-up delay-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h3 className="font-inter font-black text-xl text-brew-text uppercase tracking-wider border-b-4 border-brew-text pb-1 inline-block">
            Monthly Earnings
          </h3>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-brew-text bg-[#fffdf0] font-inter font-black text-xs text-brew-text uppercase tracking-widest shadow-[2px_2px_0px_0px_currentColor] hover:-translate-y-px hover:shadow-[3px_3px_0px_0px_currentColor] active:translate-y-px active:shadow-[1px_1px_0px_0px_currentColor] transition-all rounded-lg">
            <Download size={14} strokeWidth={3} /> Export CSV
          </button>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 0, bottom: 0, left: -20 }}
            >
              {/* Neobrutalist styling: solid fills and thick strokes instead of soft gradients */}
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#3E2723"
                strokeOpacity={0.15}
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{
                  fontSize: 12,
                  fontFamily: "Inter",
                  fill: "#3E2723",
                  fontWeight: 900,
                }}
                axisLine={{ stroke: "#3E2723", strokeWidth: 3 }}
                tickLine={false}
                dy={10}
              />
              <YAxis
                tick={{
                  fontSize: 12,
                  fontFamily: "Inter",
                  fill: "#3E2723",
                  fontWeight: 900,
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "#3E2723",
                  strokeWidth: 2,
                  strokeDasharray: "4 4",
                }}
              />
              <Area
                type="stepAfter"
                dataKey="earnings"
                stroke="#3E2723"
                strokeWidth={4}
                fill="#F5C518"
                fillOpacity={1}
                activeDot={{
                  r: 8,
                  fill: "#fff",
                  stroke: "#3E2723",
                  strokeWidth: 3,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payout History Table */}
      <div className="bg-white border-4 border-brew-text rounded-[24px] shadow-[8px_8px_0px_0px_currentColor] overflow-hidden animate-fade-up delay-300">
        <div className="bg-brew-yellow-light px-6 py-5 border-b-4 border-brew-text">
          <h3 className="font-inter font-black text-xl text-brew-text uppercase tracking-wider">
            Payout History
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-brew-yellow border-b-4 border-brew-text">
                <th className="text-left px-6 py-4 font-inter font-black text-sm text-brew-text uppercase tracking-widest border-r-2 border-brew-text/20">
                  ID
                </th>
                <th className="text-left px-6 py-4 font-inter font-black text-sm text-brew-text uppercase tracking-widest border-r-2 border-brew-text/20">
                  Amount
                </th>
                <th className="text-left px-6 py-4 font-inter font-black text-sm text-brew-text uppercase tracking-widest border-r-2 border-brew-text/20">
                  Date
                </th>
                <th className="text-left px-6 py-4 font-inter font-black text-sm text-brew-text uppercase tracking-widest border-r-2 border-brew-text/20">
                  Method
                </th>
                <th className="text-left px-6 py-4 font-inter font-black text-sm text-brew-text uppercase tracking-widest">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((p, i) => (
                <tr
                  key={i}
                  className="border-b-2 border-brew-text last:border-b-0 hover:bg-brew-yellow-light/30 transition-colors"
                >
                  <td className="px-6 py-4 font-inter font-bold text-sm text-brew-text/60 border-r-2 border-brew-text/10">
                    {p.id}
                  </td>
                  <td className="px-6 py-4 font-inter font-black text-lg text-brew-text border-r-2 border-brew-text/10">
                    {p.amount}
                  </td>
                  <td className="px-6 py-4 font-inter font-bold text-sm text-brew-text/70 border-r-2 border-brew-text/10">
                    {p.date}
                  </td>
                  <td className="px-6 py-4 font-inter font-bold text-sm text-brew-text border-r-2 border-brew-text/10">
                    {p.method}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 border-2 border-brew-text font-inter font-black text-[10px] uppercase tracking-widest shadow-[2px_2px_0px_0px_currentColor]
                  ${p.status.toLowerCase() === "completed" ? "bg-brew-yellow text-brew-text" : "bg-white text-brew-text"}`}
                    >
                      {p.status}
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

import Card from "../../components/Card";
import Badge from "../../components/Badge";
import {
  DollarSign,
  Users,
  Coffee,
  FileText,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const stats = [
  {
    label: "Total Earned",
    value: "$2,847.50",
    icon: DollarSign,
    change: "+12.5%",
  },
  { label: "This Month", value: "$486.00", icon: TrendingUp, change: "+8.3%" },
  { label: "Supporters", value: "1,247", icon: Users, change: "+23" },
  { label: "Posts", value: "34", icon: FileText, change: "+3" },
];

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

const recentActivity = [
  {
    name: "Emily R.",
    action: "bought 3 coffees",
    amount: "$15.00",
    time: "2h ago",
  },
  {
    name: "Marcus T.",
    action: "bought 1 coffee",
    amount: "$5.00",
    time: "5h ago",
  },
  {
    name: "Anonymous",
    action: "bought 5 coffees",
    amount: "$25.00",
    time: "1d ago",
  },
  {
    name: "Lily K.",
    action: "joined Gold tier",
    amount: "$10.00/mo",
    time: "2d ago",
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

export default function DashboardOverview() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-10 animate-fade-up flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-block mb-3 px-4 py-1.5 border-2 border-brew-text bg-brew-yellow font-inter font-black text-xs uppercase tracking-widest rounded-full shadow-[2px_2px_0px_0px_currentColor] -rotate-1">
            Overview
          </div>
          <h1 className="font-inter font-black text-4xl md:text-5xl text-brew-text uppercase tracking-tight">
            Dashboard
          </h1>
        </div>
        <p className="font-inter font-bold text-brew-text/70 mb-2">
          Welcome back! Here's your performance.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white border-2 border-brew-text p-6 rounded-2xl shadow-[6px_6px_0px_0px_currentColor] transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_currentColor] animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl border-2 border-brew-text bg-brew-yellow-light flex items-center justify-center shadow-[3px_3px_0px_0px_currentColor]">
                  <Icon
                    size={22}
                    strokeWidth={2.5}
                    className="text-brew-text"
                  />
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border-2 border-brew-text rounded-full font-inter font-bold text-xs shadow-[2px_2px_0px_0px_currentColor]">
                  <ArrowUpRight size={14} strokeWidth={3} />
                  {stat.change}
                </span>
              </div>
              <p className="font-inter font-black text-4xl text-brew-text mb-1 tracking-tighter">
                {stat.value}
              </p>
              <p className="font-inter font-bold text-xs text-brew-text/70 uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Chart + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Earnings Chart */}
        <div className="lg:col-span-2 bg-white border-2 border-brew-text rounded-[32px] p-6 md:p-8 shadow-[8px_8px_0px_0px_currentColor] flex flex-col animate-fade-up delay-300">
          <h3 className="inline-block self-start font-inter font-black text-xl text-brew-text mb-8 uppercase tracking-wider border-b-4 border-brew-text pb-2">
            Earnings Overview
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
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
                    fontWeight: 700,
                  }}
                  axisLine={{ stroke: "#3E2723", strokeWidth: 2 }}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  tick={{
                    fontSize: 12,
                    fontFamily: "Inter",
                    fill: "#3E2723",
                    fontWeight: 700,
                  }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                  dx={-10}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: "#3E2723",
                    strokeWidth: 2,
                    strokeDasharray: "4 4",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="#F5C518"
                  strokeWidth={6}
                  dot={{
                    r: 6,
                    fill: "#F5C518",
                    stroke: "#3E2723",
                    strokeWidth: 3,
                  }}
                  activeDot={{
                    r: 8,
                    fill: "#fff",
                    stroke: "#3E2723",
                    strokeWidth: 3,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border-2 border-brew-text rounded-[32px] p-6 md:p-8 shadow-[8px_8px_0px_0px_currentColor] animate-fade-up delay-400">
          <h3 className="inline-block self-start font-inter font-black text-xl text-brew-text mb-6 uppercase tracking-wider border-b-4 border-brew-text pb-2">
            Activity
          </h3>
          <div className="space-y-0">
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className={`flex items-start gap-4 py-4 ${i !== recentActivity.length - 1 ? "border-b-2 border-dashed border-brew-text/20" : ""}`}
              >
                <div className="w-12 h-12 rounded-xl border-2 border-brew-text bg-brew-yellow flex items-center justify-center shrink-0 shadow-[3px_3px_0px_0px_currentColor]">
                  <Coffee size={22} strokeWidth={3} />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="font-inter text-sm text-brew-text leading-tight mb-1">
                    <span className="font-black">{item.name}</span>{" "}
                    <span className="font-bold text-brew-text/70">
                      {item.action}
                    </span>
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="font-inter text-sm font-black bg-[#fffdf0] px-2.5 py-0.5 rounded-md border-2 border-brew-text shadow-[1px_1px_0px_0px_currentColor]">
                      {item.amount}
                    </span>
                    <span className="font-inter text-[10px] font-black text-brew-text/50 uppercase tracking-widest">
                      {item.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

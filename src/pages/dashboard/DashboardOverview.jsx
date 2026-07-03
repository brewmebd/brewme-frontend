import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/Card";
import Badge from "../../components/Badge";
import Skeleton from "../../components/Skeleton";
import { getDashboardStats, getDashboardSupporters, getDashboardSettings } from "../../lib/api";
import {
  DollarSign,
  Users,
  Coffee,
  FileText,
  TrendingUp,
  ArrowUpRight,
  Loader2,
  Sparkles,
  CheckCircle2,
  Circle,
  ChevronRight,
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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border-2 border-brew-text rounded-lg px-3 py-1.5 shadow-[2px_2px_0px_0px_currentColor]">
        <p className="font-inter text-[10px] font-black uppercase text-brew-text/40 mb-0.5">{label}</p>
        <p className="font-inter font-black text-sm text-brew-text">
          ${payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

function getRelativeTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function DashboardOverview() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, activityData, settingsData] = await Promise.all([
          getDashboardStats(),
          getDashboardSupporters(5),
          getDashboardSettings(),
        ]);
        setStats(statsData);
        setActivity(Array.isArray(activityData) ? activityData : []);
        setSettings(settingsData);
      } catch (err) {
        console.error("Failed to load dashboard overview:", err);
      } finally {
        // Short delay to show off the cool skeletons
        setTimeout(() => setLoading(false), 800);
      }
    }
    loadData();
  }, []);

  const linkCopied = localStorage.getItem("brewme_link_copied") === "true";

  const checklist = useMemo(() => {
    if (!settings || !stats) {
      return [
        { id: 1, text: "Set your profile name and bio", done: false, link: "/dashboard/settings" },
        { id: 2, text: "Upload a profile avatar", done: false, link: "/dashboard/settings" },
        { id: 3, text: "Connect your Stripe account", done: false, link: "/dashboard/settings" },
        { id: 4, text: "Create your first public post", done: false, link: "/dashboard/posts" },
        { id: 5, text: "Share your link on social media", done: false, link: "/dashboard/share" },
      ];
    }

    const hasNameAndBio = !!(settings.profile?.creator_name?.trim() && settings.profile?.creator_bio?.trim());
    const hasAvatar = !!settings.profile?.creator_image;
    const isStripeConnected = !!settings.stripe?.is_connected;
    const hasPost = (stats.total_posts || 0) > 0;
    const isShared = linkCopied || (stats.total_supporters || 0) > 0;

    return [
      { id: 1, text: "Set your profile name and bio", done: hasNameAndBio, link: "/dashboard/settings" },
      { id: 2, text: "Upload a profile avatar", done: hasAvatar, link: "/dashboard/settings" },
      { id: 3, text: "Connect your Stripe account", done: isStripeConnected, link: "/dashboard/settings" },
      { id: 4, text: "Create your first public post", done: hasPost, link: "/dashboard/posts" },
      { id: 5, text: "Share your link on social media", done: isShared, link: "/dashboard/share" },
    ];
  }, [settings, stats, linkCopied]);

  const completedCount = checklist.filter(t => t.done).length;
  const progressPercent = (completedCount / checklist.length) * 100;

  if (loading) {
    return (
      <div className="animate-fade-up">
        {/* Header Skeleton */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="w-20 h-6 rounded-full" />
            <Skeleton className="w-48 h-10" />
          </div>
          <Skeleton className="w-40 h-5" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32 border-2 border-transparent" />
          ))}
        </div>

        {/* Main Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <Skeleton className="lg:col-span-2 h-[350px]" />
          <Skeleton className="h-[350px]" />
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Earned", value: stats?.total_earned || "$0.00", icon: DollarSign, change: stats?.earnings_change || "+0%" },
    { label: "This Month", value: stats?.monthly_earned || "$0.00", icon: TrendingUp, change: stats?.monthly_change || "+0%" },
    { label: "Supporters", value: stats?.total_supporters || "0", icon: Users, change: stats?.supporters_change || "+0" },
    { label: "Posts", value: stats?.total_posts || "0", icon: FileText, change: stats?.posts_change || "+0" },
  ];

  return (
    <div className="animate-fade-up">
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-block mb-2 px-3 py-1 border-2 border-brew-text bg-brew-yellow font-inter font-black text-[10px] uppercase tracking-widest rounded-full shadow-[2px_2px_0px_0px_currentColor] -rotate-1">
            Overview
          </div>
          <h1 className="font-inter font-black text-3xl md:text-4xl text-brew-text uppercase tracking-tight">
            Dashboard
          </h1>
        </div>
        <p className="font-inter font-bold text-sm text-brew-text/50 mb-1">
          Everything's looking great today.
        </p>
      </div>

      {/* 🏁 ROAD TO FIRST $1 CHECKLIST */}
      {completedCount < checklist.length && (
        <div className="bg-white border-4 border-brew-text rounded-[32px] p-6 md:p-8 shadow-[8px_8px_0px_0px_currentColor] mb-10 overflow-hidden group">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h3 className="font-inter font-black text-xl uppercase tracking-tight flex items-center gap-3 mb-1">
                Road to your first $1 <Sparkles size={20} className="text-brew-yellow" />
              </h3>
              <p className="font-inter font-bold text-sm text-brew-text/50 uppercase tracking-widest">
                Complete your setup to start receiving support
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="font-inter font-black text-xs uppercase tracking-widest text-brew-text/40">
                {completedCount} / {checklist.length} Tasks
              </span>
              <div className="w-48 h-3 bg-[#fffdf0] border-2 border-brew-text rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-brew-yellow border-r-2 border-brew-text transition-all duration-1000" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {checklist.map((item) => (
              <Link
                key={item.id}
                to={item.link}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all group/item no-underline
                  ${item.done 
                    ? "bg-green-50/50 border-green-200 opacity-60 grayscale hover:grayscale-0 hover:opacity-100" 
                    : "bg-[#fffdf0] border-brew-text shadow-[3px_3px_0px_0px_currentColor] hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_currentColor]"}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {item.done ? (
                    <CheckCircle2 size={18} className="text-green-500 shrink-0" strokeWidth={3} />
                  ) : (
                    <Circle size={18} className="text-brew-text/20 shrink-0" strokeWidth={3} />
                  )}
                  <span className={`font-inter font-black text-[11px] uppercase tracking-tight truncate ${item.done ? 'line-through' : 'text-brew-text'}`}>
                    {item.text}
                  </span>
                </div>
                {!item.done && <ChevronRight size={14} className="text-brew-text/20 group-hover/item:translate-x-1 transition-transform" strokeWidth={3} />}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white border-2 border-brew-text p-5 rounded-2xl shadow-[4px_4px_0px_0px_currentColor] hover:-translate-y-0.5 transition-transform"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg border-2 border-brew-text bg-brew-yellow-light flex items-center justify-center shadow-[2px_2px_0px_0px_currentColor]">
                  <Icon size={18} strokeWidth={2.5} className="text-brew-text" />
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#fffdf0] border-2 border-brew-text rounded-full font-inter font-black text-[9px] shadow-[1px_1px_0px_0px_currentColor]">
                  <ArrowUpRight size={10} strokeWidth={3} />
                  {stat.change}
                </span>
              </div>
              <p className="font-inter font-black text-2xl text-brew-text mb-0.5 tracking-tight uppercase leading-none">
                {stat.value}
              </p>
              <p className="font-inter font-bold text-[10px] text-brew-text/40 uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Chart + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Earnings Chart */}
        <div className="lg:col-span-2 bg-white border-4 border-brew-text rounded-[24px] p-6 md:p-8 shadow-[6px_6px_0px_0px_currentColor] flex flex-col h-full min-h-[400px]">
          <h3 className="inline-block self-start font-inter font-black text-lg text-brew-text mb-8 uppercase tracking-wider border-b-4 border-brew-text pb-1">
            Performance
          </h3>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.chart_data || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3E2723" strokeOpacity={0.1} vertical={false} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 10, fontFamily: "Inter", fill: "#3E2723", fontWeight: 800 }} 
                  axisLine={{ stroke: "#3E2723", strokeWidth: 2 }}
                  tickLine={false}
                  dy={8}
                />
                <YAxis 
                  tick={{ fontSize: 10, fontFamily: "Inter", fill: "#3E2723", fontWeight: 800 }} 
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line type="stepAfter" dataKey="earnings" stroke="#F5C518" strokeWidth={4} dot={{ r: 4, fill: "#F5C518", stroke: "#3E2723", strokeWidth: 2 }} activeDot={{ r: 6, fill: "#fff", stroke: "#3E2723", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border-4 border-brew-text rounded-[24px] p-6 md:p-8 shadow-[6px_6px_0px_0px_currentColor] h-full min-h-[400px]">
          <h3 className="inline-block self-start font-inter font-black text-lg text-brew-text mb-6 uppercase tracking-wider border-b-4 border-brew-text pb-1">
            Latest
          </h3>
          <div className="space-y-0">
            {activity.length > 0 ? (
              activity.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 py-4 ${i !== activity.length - 1 ? "border-b-2 border-dashed border-brew-text/10" : ""}`}
                >
                  <div className="w-10 h-10 rounded-lg border-2 border-brew-text bg-brew-yellow flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_currentColor]">
                    <Coffee size={18} strokeWidth={3} />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="font-inter text-xs text-brew-text leading-tight mb-1">
                      <span className="font-black">{item.supporter_name || "Someone"}</span>{" "}
                      <span className="font-bold text-brew-text/50 lowercase">
                        bought {item.supporter_cups} cups
                      </span>
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-inter text-[10px] font-black bg-[#fffdf0] px-1.5 py-0.5 rounded border border-brew-text">
                        ${item.total_amount}
                      </span>
                      <span className="font-inter text-[8px] font-black text-brew-text/30 uppercase tracking-widest">
                        {getRelativeTime(item.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <div className="w-12 h-12 bg-[#fffdf0] border-2 border-dashed border-brew-text/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={20} className="text-brew-text/20" />
                </div>
                <p className="font-inter font-black text-xs text-brew-text/30 uppercase tracking-widest leading-relaxed">
                  Waiting for your <br /> first supporter!
                </p>
              </div>
            )}
          </div>
          {activity.length > 0 && (
            <Link to="/dashboard/supporters" className="block mt-6 text-center font-inter font-black text-[10px] uppercase tracking-widest text-brew-text/40 hover:text-brew-text transition-colors">
              View all activity →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

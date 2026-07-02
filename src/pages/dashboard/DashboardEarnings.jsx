import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Badge from "../../components/Badge";
import Toast from "../../components/Toast";
import Skeleton from "../../components/Skeleton";
import { DollarSign, ArrowUpRight, ArrowRight, Download, Loader2, Landmark, Check, X, Sparkles, TrendingUp } from "lucide-react";
import { getDashboardEarnings, requestPayout, getProfile } from "../../lib/api";
import { exportEarningsPDF } from "../../lib/export";
import {
  AreaChart,
  Area,
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

export default function DashboardEarnings() {
  const [data, setData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequestSubmitting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [payoutForm, setPayoutForm] = useState({ amount: "", method: "Stripe" });

  useEffect(() => {
    async function loadData() {
      try {
        const [earningsData, profileData] = await Promise.all([
          getDashboardEarnings(),
          getProfile()
        ]);
        setData(earningsData);
        if (profileData.status) setProfile(profileData.profile_info);
        const cleanBalance = (earningsData?.available_balance || "0").replace(/[^0-9.]+/g, "");
        setPayoutForm(prev => ({ ...prev, amount: cleanBalance }));
      } catch (err) {
        console.error("Failed to load earnings:", err);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    }
    loadData();
  }, []);

  const statCards = useMemo(() => [
    { label: "Total Earned", value: data?.total_earned || "$0.00", change: data?.total_change || "+0%" },
    { label: "Balance", value: data?.available_balance || "$0.00", change: "Available" },
    { label: "Payouts", value: data?.total_payouts_sum || "$0.00", change: `${data?.payouts?.length || 0} total` },
  ], [data]);

  const handleRequestPayout = async (e) => {
    e.preventDefault();
    if (requesting) return;
    const amountNum = parseFloat(payoutForm.amount);
    const balanceNum = parseFloat((data?.available_balance || "0").replace(/[^0-9.]+/g, ""));
    if (isNaN(amountNum) || amountNum <= 0) { setToast({ type: "error", message: "Please enter a valid amount." }); return; }
    if (amountNum > balanceNum) { setToast({ type: "error", message: "Amount exceeds balance." }); return; }

    setRequestSubmitting(true);
    try {
      const res = await requestPayout(payoutForm);
      setToast({ type: "success", message: `Request for $${amountNum.toFixed(2)} sent!` });
      const newBalance = balanceNum - amountNum;
      setData(prev => ({
        ...prev,
        available_balance: `$${newBalance.toFixed(2)}`,
        payouts: res?.payout ? [res.payout, ...(prev.payouts || [])] : prev.payouts,
      }));
      setShowModal(false);
    } catch (err) { setToast({ type: "error", message: err.message || "Failed to request payout." }); }
    finally { setRequestSubmitting(false); }
  };

  const handleExport = () => {
    if (!data || exporting) return;
    setExporting(true);
    try {
      exportEarningsPDF(data, profile);
      setToast({ type: "success", message: "Datasheet exported!" });
    } catch (err) { setToast({ type: "error", message: "Export failed." }); }
    finally { setExporting(false); }
  };

  if (loading) {
    return (
      <div className="animate-fade-up">
        <div className="mb-10 flex justify-between items-end">
          <div className="space-y-2">
            <Skeleton className="w-20 h-6 rounded-full" />
            <Skeleton className="w-48 h-10" />
          </div>
          <Skeleton className="w-32 h-12" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-28" />)}
        </div>
        <Skeleton className="h-80 w-full mb-10" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <>
      <div className="animate-fade-up">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 text-brew-text">
          <div>
            <div className="inline-block mb-2 px-3 py-1 border-2 border-brew-text bg-brew-yellow font-inter font-black text-[10px] uppercase tracking-widest rounded-full shadow-[2px_2px_0px_0px_currentColor] -rotate-1">
              Finances
            </div>
            <h1 className="font-space font-black text-3xl md:text-4xl uppercase tracking-tight mb-1 leading-none text-brew-text">
              Earnings
            </h1>
            <p className="font-inter font-bold text-sm opacity-60">
              Track your income and manage your balance.
            </p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 px-8 py-3 border-2 border-brew-text bg-brew-text text-[#fffdf0] font-inter font-black text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px_#F5C518] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all rounded-xl w-full sm:w-auto active-haptic"
          >
            <DollarSign size={16} strokeWidth={3} className="text-brew-yellow" />
            Payout Request
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {statCards.map((stat, i) => (
            <div
              key={i}
              className="bg-white border-2 border-brew-text p-5 rounded-2xl shadow-[4px_4px_0px_0px_currentColor] flex flex-col hover-lift transition-transform"
            >
              <div className="flex justify-between items-start mb-4">
                <p className="font-inter font-black text-[10px] text-brew-text/40 uppercase tracking-[0.2em]">
                  {stat.label}
                </p>
                {stat.label === "Total Earned" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-brew-yellow-light border-2 border-brew-text font-inter font-black text-[9px] uppercase tracking-widest shadow-[1px_1px_0px_0px_currentColor]">
                    <ArrowUpRight size={10} strokeWidth={3} />
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="font-space font-black text-3xl text-brew-text tracking-tighter mt-auto leading-none uppercase">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* History Chart */}
        <div className="bg-white border-4 border-brew-text rounded-[24px] p-6 md:p-8 shadow-[6px_6px_0px_0px_currentColor] mb-10 text-brew-text">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h3 className="font-space font-black text-xl uppercase tracking-widest border-b-4 border-brew-text pb-1 inline-block leading-none">
              Performance
            </h3>
            <button 
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-brew-text bg-[#fffdf0] font-inter font-black text-[10px] text-brew-text uppercase tracking-widest shadow-[2px_2px_0px_0px_currentColor] hover:-translate-y-px transition-all rounded-lg disabled:opacity-50 active-haptic"
            >
              {exporting ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} strokeWidth={3} />}
              {exporting ? "Exporting..." : "Export PDF"}
            </button>
          </div>

          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.chart_data || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3E2723" strokeOpacity={0.1} vertical={false} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 10, fontFamily: "Inter", fill: "#3E2723", fontWeight: 900 }} 
                  axisLine={{ stroke: "#3E2723", strokeWidth: 3 }}
                  tickLine={false}
                  dy={8}
                />
                <YAxis 
                  tick={{ fontSize: 10, fontFamily: "Inter", fill: "#3E2723", fontWeight: 900 }} 
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area type="stepAfter" dataKey="earnings" stroke="#3E2723" strokeWidth={3} fill="#F5C518" fillOpacity={1} activeDot={{ r: 6, fill: "#fff", stroke: "#3E2723", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payout Log */}
        <div className="bg-white border-4 border-brew-text rounded-[32px] shadow-[8px_8px_0px_0px_currentColor] overflow-hidden text-brew-text">
          <div className="bg-brew-yellow-light px-6 py-5 border-b-4 border-brew-text">
            <h3 className="font-space font-black text-xl uppercase tracking-widest leading-none">
              Payout History
            </h3>
          </div>
          <div className="overflow-x-auto">
            {data?.payouts?.length > 0 ? (
              <table className="w-full border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-brew-yellow/20 border-b-2 border-brew-text">
                    <th className="text-left px-6 py-4 font-inter font-black text-[10px] uppercase tracking-widest">ID</th>
                    <th className="text-left px-6 py-4 font-inter font-black text-[10px] uppercase tracking-widest">Amount</th>
                    <th className="text-left px-6 py-4 font-inter font-black text-[10px] uppercase tracking-widest">Date</th>
                    <th className="text-left px-6 py-4 font-inter font-black text-[10px] uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.payouts.map((p, i) => (
                    <tr key={i} className="border-b-2 border-brew-text/5 last:border-b-0 hover:bg-brew-yellow-light/10 transition-colors">
                      <td className="px-6 py-4 font-inter font-bold text-xs opacity-40">{p.id}</td>
                      <td className="px-6 py-4 font-space font-black text-base">${p.amount}</td>
                      <td className="px-6 py-4 font-inter font-bold text-xs opacity-60">{p.date}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-1 border-2 border-brew-text font-inter font-black text-[9px] uppercase tracking-widest shadow-[1px_1px_0px_0px_currentColor] ${p.status.toLowerCase() === "completed" ? "bg-brew-yellow" : "bg-white"}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-24 text-center">
                <div className="w-20 h-20 bg-brew-yellow/10 border-2 border-dashed border-brew-yellow/40 rounded-[32px] flex items-center justify-center mx-auto mb-8 -rotate-6">
                  <Landmark size={40} className="text-brew-yellow" strokeWidth={2} />
                </div>
                <h3 className="font-space font-black text-2xl text-brew-text uppercase tracking-tight mb-2">No payouts yet</h3>
                <p className="font-inter font-bold text-sm text-brew-text/40 uppercase tracking-widest leading-relaxed mb-8 max-w-sm mx-auto">
                  Earn your first $1 to unlock your first withdrawal!
                </p>
                <Link to="/dashboard/share" className="inline-flex items-center gap-2 px-8 py-4 bg-white border-4 border-brew-text rounded-[20px] font-space font-black text-xs uppercase tracking-widest shadow-[6px_6px_0px_0px_currentColor] hover:translate-x-1 hover:translate-y-1 active:shadow-none transition-all no-underline text-brew-text active-haptic">
                  Share your page <ArrowRight size={14} strokeWidth={4} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payout Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-brew-text/60 backdrop-blur-xl animate-fade-in" onClick={() => !requesting && setShowModal(false)} />
          <div className="relative w-full max-w-md bg-white border-4 border-brew-text rounded-[32px] p-8 shadow-[12px_12px_0px_0px_currentColor] animate-slide-in-up text-brew-text">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 hover:bg-brew-yellow-light rounded-full transition-colors"><X size={20} strokeWidth={3} /></button>
            <h3 className="font-space font-black text-2xl uppercase tracking-tight mb-6 flex items-center gap-3 leading-none">Request Funds <Landmark size={24} className="text-brew-yellow" /></h3>
            <form onSubmit={handleRequestPayout} className="space-y-6">
              <div>
                <label className="block font-inter font-black text-xs uppercase tracking-widest mb-2 opacity-60">Withdraw Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-space font-black text-lg">$</span>
                  <input type="number" step="0.01" value={payoutForm.amount} onChange={(e) => setPayoutForm({ ...payoutForm, amount: e.target.value })} className="w-full pl-10 pr-4 py-4 bg-[#fffdf0] border-2 border-brew-text rounded-2xl font-space font-black text-xl focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] transition-all" />
                </div>
                <p className="mt-2 font-inter font-bold text-[10px] uppercase tracking-widest opacity-40">Available: {data?.available_balance}</p>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {["Stripe", "PayPal"].map((method) => (
                  <button key={method} type="button" onClick={() => setPayoutForm({ ...payoutForm, method })} className={`flex items-center justify-between px-5 py-3 border-2 border-brew-text rounded-xl transition-all ${payoutForm.method === method ? "bg-brew-yellow shadow-[3px_3px_0px_0px_currentColor] -translate-x-1 -translate-y-1" : "bg-white hover:bg-brew-yellow-light"}`}>
                    <span className="font-inter font-black text-sm uppercase">{method}</span>
                    {payoutForm.method === method && <Check size={16} strokeWidth={4} />}
                  </button>
                ))}
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} disabled={requesting} className="flex-1 px-6 py-4 border-2 border-brew-text bg-white font-inter font-black text-xs uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={requesting} className="flex-1 px-6 py-4 border-2 border-brew-text bg-brew-text text-white font-inter font-black text-xs uppercase tracking-widest rounded-xl shadow-[4px_4px_0px_0px_#F5C518] hover:translate-x-1 hover:translate-y-1 active:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-2">{requesting ? <Loader2 size={14} className="animate-spin text-brew-yellow" /> : "Confirm"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}

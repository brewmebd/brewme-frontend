import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Toast from "../../components/Toast";
import Skeleton from "../../components/Skeleton";
import { MessageCircle, Search, Loader2, Coffee, Send, X, Check, SlidersHorizontal, DollarSign, Users, Crown, Clock } from "lucide-react";
import { getDashboardSupporters, replyToSupporter } from "../../lib/api";

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

export default function DashboardSupporters() {
  const [supporters, setSupporters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const [replyFilter, setReplyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    async function loadSupporters() {
      try {
        const data = await getDashboardSupporters(50);
        setSupporters(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load supporters:", err);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    }
    loadSupporters();
  }, []);

  const handleReplySubmit = async (supporterId) => {
    if (!replyText.trim() || submittingReply) return;
    setSubmittingReply(true);
    try {
      const response = await replyToSupporter(supporterId, replyText);

      setSupporters(prev => prev.map(s =>
        s.id === supporterId
          ? { ...s, support_replied: true, creator_reply: response.creator_reply || replyText }
          : s
      ));
      setToast({ type: "success", message: "Reply sent!" });
      setReplyingTo(null);
      setReplyText("");
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to send." });
    } finally {
      setSubmittingReply(false);
    }
  };

  // ── Derived metrics ──
  const stats = useMemo(() => {
    const totalRaised = supporters.reduce((sum, s) => sum + (s.total_amount || 0), 0);
    const totalCups = supporters.reduce((sum, s) => sum + (s.supporter_cups || 0), 0);
    const repliedCount = supporters.filter(s => s.support_replied).length;
    const pendingCount = supporters.length - repliedCount;
    const replyRate = supporters.length ? Math.round((repliedCount / supporters.length) * 100) : 0;
    return { totalRaised, totalCups, repliedCount, pendingCount, replyRate };
  }, [supporters]);

  // Highest-grossing supporter — gets a "top fan" crown.
  const topSupporterId = useMemo(() => {
    if (supporters.length === 0) return null;
    return supporters.reduce((top, s) => (s.total_amount > (top?.total_amount || 0) ? s : top), null)?.id ?? null;
  }, [supporters]);

  const counts = {
    all: supporters.length,
    pending: stats.pendingCount,
    replied: stats.repliedCount,
  };

  const filtered = supporters
    .filter((s) => {
      const matchesSearch = (s.supporter_name || "").toLowerCase().includes(search.toLowerCase()) || (s.supporter_message || "").toLowerCase().includes(search.toLowerCase());
      if (replyFilter === "replied") return matchesSearch && s.support_replied;
      if (replyFilter === "pending") return matchesSearch && !s.support_replied;
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === "oldest") return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === "highest") return b.total_amount - a.total_amount;
      if (sortBy === "lowest") return a.total_amount - b.total_amount;
      return 0;
    });

  if (loading) {
    return (
      <div className="animate-fade-up">
        <div className="mb-8 flex justify-between items-end">
          <div className="space-y-2">
            <Skeleton className="w-24 h-6 rounded-full" />
            <Skeleton className="w-52 h-10" />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <Skeleton className="h-14 w-full rounded-2xl mb-6" />
        <div className="space-y-5">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-36 w-full rounded-[28px]" />)}
        </div>
      </div>
    );
  }

  const statTiles = [
    { label: "Total Raised", value: `$${stats.totalRaised.toFixed(2)}`, icon: DollarSign },
    { label: "Supporters", value: supporters.length, icon: Users },
    { label: "Cups Served", value: stats.totalCups, icon: Coffee },
    { label: "Awaiting Reply", value: stats.pendingCount, icon: MessageCircle },
  ];

  const filterTabs = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "replied", label: "Replied" },
  ];

  return (
    <div className="animate-fade-up text-brew-text">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-block mb-2 px-3 py-1 border-2 border-brew-text bg-brew-yellow font-inter font-black text-[10px] uppercase tracking-widest rounded-full shadow-[2px_2px_0px_0px_currentColor] -rotate-1">
          Community
        </div>
        <h1 className="font-space font-black text-3xl md:text-4xl uppercase tracking-tight mb-1 leading-none text-brew-text">
          Supporters
        </h1>
        <p className="font-inter font-bold text-sm opacity-60">
          {supporters.length} {supporters.length === 1 ? "person has" : "people have"} fueled your work.
        </p>
      </div>

      {supporters.length === 0 ? (
        <div className="py-24 text-center bg-white border-4 border-dashed border-brew-text/10 rounded-[48px] max-w-2xl mx-auto shadow-[12px_12px_0px_0px_rgba(0,0,0,0.03)]">
          <div className="w-20 h-20 bg-brew-yellow/10 border-2 border-dashed border-brew-yellow/40 rounded-[32px] flex items-center justify-center mx-auto mb-8 -rotate-6">
            <Coffee size={40} className="text-brew-yellow" strokeWidth={2.5} />
          </div>
          <h3 className="font-space font-black text-3xl text-brew-text uppercase tracking-tight mb-4">No fans yet</h3>
          <p className="font-inter font-bold text-base text-brew-text/40 uppercase tracking-widest leading-relaxed mb-10 max-w-sm mx-auto">
            Share your page with the world to start receiving support!
          </p>
          <Link to="/dashboard/share" className="inline-flex items-center gap-3 px-10 py-5 bg-brew-yellow border-4 border-brew-text rounded-[24px] font-space font-black text-base uppercase tracking-widest shadow-[8px_8px_0px_0px_currentColor] hover:translate-x-1 hover:translate-y-1 active:shadow-none transition-all active-haptic">
            <Send size={20} strokeWidth={4} /> Promote Page
          </Link>
        </div>
      ) : (
        <>
          {/* Stats summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statTiles.map((tile, i) => {
              const Icon = tile.icon;
              const isPending = tile.label === "Awaiting Reply";
              return (
                <div
                  key={i}
                  className={`border-2 border-brew-text p-5 rounded-2xl shadow-[4px_4px_0px_0px_currentColor] hover:-translate-y-0.5 transition-transform ${isPending && stats.pendingCount > 0 ? "bg-brew-yellow" : "bg-white"}`}
                >
                  <div className="w-10 h-10 rounded-lg border-2 border-brew-text bg-brew-yellow-light flex items-center justify-center shadow-[2px_2px_0px_0px_currentColor] mb-4">
                    <Icon size={18} strokeWidth={2.5} className="text-brew-text" />
                  </div>
                  <p className="font-inter font-black text-2xl text-brew-text mb-0.5 tracking-tight uppercase leading-none">
                    {tile.value}
                  </p>
                  <p className="font-inter font-bold text-[10px] text-brew-text/40 uppercase tracking-widest">
                    {tile.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Toolbar: status pills + sort + search */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div className="inline-flex p-1 bg-white border-2 border-brew-text rounded-xl shadow-[3px_3px_0px_0px_currentColor] self-start">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setReplyFilter(tab.key)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-inter font-black text-[11px] uppercase tracking-widest transition-all ${replyFilter === tab.key ? "bg-brew-text text-white" : "text-brew-text/50 hover:text-brew-text"}`}
                >
                  {tab.label}
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${replyFilter === tab.key ? "bg-white/20" : "bg-brew-text/5"}`}>
                    {counts[tab.key]}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto lg:justify-end">
              <div className="relative group min-w-[150px]">
                <SlidersHorizontal size={14} strokeWidth={3} className="absolute left-3 top-1/2 -translate-y-1/2 text-brew-text/30 pointer-events-none transition-transform group-hover:-rotate-12 z-10" />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full appearance-none pl-9 pr-10 py-2.5 bg-white border-2 border-brew-text rounded-xl font-inter font-black text-[11px] uppercase tracking-widest shadow-[3px_3px_0px_0px_currentColor] focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] cursor-pointer transition-all relative z-0">
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="highest">Highest $</option>
                  <option value="lowest">Lowest $</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none font-black text-[10px] z-10">↓</div>
              </div>

              <div className="relative flex-grow sm:max-w-xs group text-brew-text">
                <Search size={18} strokeWidth={3} className="absolute left-4 top-1/2 -translate-y-1/2 text-brew-text/30 transition-transform group-focus-within:rotate-12" />
                <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-2.5 bg-white border-2 border-brew-text rounded-xl font-inter font-bold text-sm text-brew-text placeholder:text-brew-text/30 focus:outline-none focus:shadow-[3px_3px_0px_0px_currentColor] transition-all" />
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-24 text-center bg-white border-4 border-dashed border-brew-text/10 rounded-[40px] text-brew-text/20">
              <div className="w-16 h-16 bg-[#fffdf0] border-2 border-dashed border-brew-text/20 rounded-2xl flex items-center justify-center mx-auto mb-6"><Search size={32} /></div>
              <p className="font-inter font-black text-lg uppercase tracking-widest mb-4">No matches found</p>
              <button onClick={() => { setSearch(""); setReplyFilter("all"); setSortBy("newest"); }} className="text-brew-text font-black text-xs uppercase underline decoration-2 underline-offset-4 hover:bg-brew-yellow transition-colors px-2 py-1 rounded">Reset Filters</button>
            </div>
          ) : (
            <div className="space-y-5">
              {filtered.map((s) => {
                const isTop = s.id === topSupporterId;
                const isReplying = replyingTo === s.id;
                return (
                  <div key={s.id} className={`relative bg-white border-4 border-brew-text rounded-[28px] p-6 md:p-7 shadow-[6px_6px_0px_0px_currentColor] transition-all hover:-translate-y-1 active-haptic ${isReplying ? "ring-4 ring-brew-yellow ring-offset-2 shadow-none" : ""}`}>
                    {isTop && (
                      <div className="absolute -top-3 left-8 inline-flex items-center gap-1.5 px-3 py-1 bg-brew-yellow border-2 border-brew-text rounded-full font-inter font-black text-[9px] uppercase tracking-widest shadow-[2px_2px_0px_0px_currentColor] -rotate-2">
                        <Crown size={11} strokeWidth={3} /> Top Fan
                      </div>
                    )}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-5 text-brew-text">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className={`w-12 h-12 rounded-full border-2 border-brew-text flex items-center justify-center font-black text-xl shrink-0 shadow-[2px_2px_0px_0px_currentColor] ${isTop ? "bg-brew-yellow" : "bg-brew-yellow-light"}`}>
                          {(s.supporter_name || "A").charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-2">
                            <span className="font-space font-black text-lg md:text-xl leading-none">{s.supporter_name || "Anonymous"}</span>
                            <span className="font-inter font-black text-[10px] bg-[#fffdf0] border-2 border-brew-text px-2.5 py-1 rounded shadow-[1px_1px_0px_0px_currentColor] inline-flex items-center gap-1 uppercase">
                              <Coffee size={12} strokeWidth={3} /> × {s.supporter_cups}
                            </span>
                            <span className="font-inter font-black text-[10px] bg-brew-yellow border-2 border-brew-text px-2.5 py-1 rounded shadow-[1px_1px_0px_0px_currentColor] inline-flex items-center gap-0.5 uppercase">
                              ${s.total_amount}
                            </span>
                          </div>
                          {s.supporter_message && (
                            <div className="relative my-3 text-brew-text">
                              <div className="absolute -left-3 top-0 bottom-0 w-1.5 bg-brew-yellow rounded-full" />
                              <p className="font-inter font-bold text-base text-brew-text/70 leading-relaxed pl-5 italic">"{s.supporter_message}"</p>
                            </div>
                          )}
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-inter font-black text-[10px] opacity-30 uppercase tracking-widest inline-flex items-center gap-1">
                              <Clock size={11} strokeWidth={3} /> {getRelativeTime(s.created_at)}
                            </span>
                            {s.support_replied ? (
                              <span className="font-inter font-black text-[9px] text-green-600 uppercase tracking-widest bg-green-50 px-2.5 py-1 rounded border-2 border-green-200 flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#bbf7d0]"><Check size={10} strokeWidth={5} /> Replied</span>
                            ) : (
                              <span className="font-inter font-black text-[9px] text-brew-text/40 uppercase tracking-widest bg-[#fffdf0] px-2.5 py-1 rounded border-2 border-brew-text/15 flex items-center gap-1.5">Awaiting reply</span>
                            )}
                          </div>
                        </div>
                      </div>
                      {!s.support_replied && (
                        <button onClick={() => setReplyingTo(isReplying ? null : s.id)} className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 border-2 border-brew-text rounded-xl font-inter font-black text-[10px] uppercase tracking-widest transition-all shrink-0 ${isReplying ? "bg-brew-text text-white shadow-none translate-x-[2px] translate-y-[2px]" : "bg-white text-brew-text shadow-[3px_3px_0px_0px_currentColor] hover:-translate-y-0.5"}`}>
                          {isReplying ? <X size={14} strokeWidth={3} /> : <MessageCircle size={14} strokeWidth={3} />}
                          {isReplying ? "Cancel" : "Reply"}
                        </button>
                      )}
                    </div>
                    {isReplying && (
                      <div className="mt-7 pt-7 border-t-2 border-dashed border-brew-text/10 animate-slide-in-up">
                        <div className="bg-[#fffdf0] border-2 border-brew-text rounded-2xl p-5 shadow-[4px_4px_0px_0px_currentColor]">
                          <textarea placeholder={`Say something nice to ${s.supporter_name || "your supporter"}...`} value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={3} className="w-full bg-white border-2 border-brew-text rounded-xl p-4 font-inter font-bold text-sm text-brew-text focus:outline-none focus:shadow-[3px_3px_0px_0px_currentColor] transition-all resize-none" />
                          <div className="flex justify-end mt-4">
                            <button onClick={() => handleReplySubmit(s.id)} disabled={!replyText.trim() || submittingReply} className="inline-flex items-center gap-2 px-8 py-3 border-2 border-brew-text bg-brew-yellow font-inter font-black text-xs uppercase tracking-widest rounded-xl shadow-[4px_4px_0px_0px_currentColor] active-haptic disabled:opacity-50">
                              {submittingReply ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} strokeWidth={3} />}
                              {submittingReply ? "Sending..." : "Send Reply"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {s.support_replied && s.creator_reply && (
                      <div className="mt-6 pt-6 border-t-2 border-dashed border-brew-text/5">
                        <div className="bg-green-50/50 border-2 border-green-200 rounded-2xl p-4">
                          <div className="flex items-center gap-2 mb-2 text-green-600 opacity-60"><Check size={12} strokeWidth={5} /><span className="font-inter font-black text-[9px] uppercase tracking-widest">You replied</span></div>
                          <p className="font-inter font-bold text-sm text-brew-text/60 italic leading-relaxed">"{s.creator_reply}"</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

import { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Avatar from "../components/Avatar";
import { API_BASE, API_ORIGIN } from "../lib/api";
import {
  Lock,
  ExternalLink,
  Globe,
  Share2,
  Music,
  AtSign,
  ArrowRight,
  Eye,
  Coffee,
  Loader2,
} from "lucide-react";

/* ── Mock Supporter & Post Data (Temporarily kept as API doesn't provide these yet) ── */
const posts = [
  {
    title: "Behind the scenes: My latest illustration process",
    preview: "A deep dive into how I created the ocean sunset piece...",
    time: "3 days ago",
    membersOnly: false,
  },
  {
    title: "Exclusive: Full PSD files for January collection",
    preview: "Download all 12 high-res illustration files...",
    time: "1 week ago",
    membersOnly: true,
  },
  {
    title: "Monthly Q&A Recap — Your questions answered",
    preview: "Thank you for all the amazing questions this month...",
    time: "2 weeks ago",
    membersOnly: false,
  },
  {
    title: "Brush pack v3.0 — Premium Procreate brushes",
    preview: "My custom brush pack updated with 15 new brushes...",
    time: "3 weeks ago",
    membersOnly: true,
  },
];

const PRICE_PER_CUP = 5;

// Simple relative time formatter
function getRelativeTime(dateString) {
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
  
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function CreatorProfilePage() {
  const { username } = useParams();
  const [creator, setCreator] = useState(null);
  const [supporters, setSupporters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [supportersLoading, setSupportersLoading] = useState(true);
  const [error, setError] = useState(null);

  const [cupCount, setCupCount] = useState(1);
  const [customCups, setCustomCups] = useState("");
  const [supporterName, setSupporterName] = useState("");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("supporters");
  const [priceAnimating, setPriceAnimating] = useState(false);

  useEffect(() => {
    const fetchCreator = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/creators/${username}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Creator not found");
          throw new Error("Failed to fetch creator");
        }
        const data = await res.json();
        setCreator(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchSupporters = async () => {
      setSupportersLoading(true);
      try {
        const res = await fetch(`${API_BASE}/creators/${username}/supporters?limit=20`);
        if (res.ok) {
          const data = await res.json();
          setSupporters(data);
        }
      } catch (err) {
        console.error("Error fetching supporters:", err);
      } finally {
        setSupportersLoading(false);
      }
    };

    fetchCreator();
    fetchSupporters();
  }, [username]);

  const totalAmount = useMemo(() => {
    const cups = customCups ? parseInt(customCups) || 0 : cupCount;
    return cups * PRICE_PER_CUP;
  }, [cupCount, customCups]);

  const handleCupSelect = (count) => {
    setCupCount(count);
    setCustomCups("");
    setPriceAnimating(true);
    setTimeout(() => setPriceAnimating(false), 300);
  };

  const handleCustomChange = (e) => {
    setCustomCups(e.target.value);
    setPriceAnimating(true);
    setTimeout(() => setPriceAnimating(false), 300);
  };

  const getLinkIcon = (url) => {
    const u = url.toLowerCase();
    if (u.includes("twitter.com") || u.includes("x.com")) return AtSign;
    if (u.includes("instagram.com")) return Share2;
    if (u.includes("youtube.com")) return Music;
    return Globe;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <Loader2 className="h-12 w-12 animate-spin text-brew-yellow mb-4" />
        <p className="font-inter font-black text-brew-text uppercase tracking-widest animate-pulse">
          Brewing Profile...
        </p>
      </div>
    );
  }

  // 404 for unknown creators or errors
  if (error || !creator) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 bg-brew-yellow-light">
        <div className="bg-white border-4 border-brew-text p-10 md:p-14 rounded-[32px] shadow-[12px_12px_0px_0px_currentColor] text-center max-w-lg animate-fade-up">
          <div className="text-7xl mb-6 inline-block -rotate-12 drop-shadow-[4px_4px_0px_rgba(62,39,35,0.2)]">
            🫗
          </div>
          <h1 className="font-inter font-black text-4xl md:text-5xl text-brew-text uppercase tracking-tight mb-4">
            {error === "Creator not found" ? "Brew Not Found" : "Something went wrong"}
          </h1>
          <p className="font-inter font-bold text-lg text-brew-text/70 mb-8">
            {error === "Creator not found"
              ? "We couldn't find a creator with that username."
              : "Could not reach the server. Please try again later."}
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-8 py-4 border-4 border-brew-text bg-brew-yellow font-inter font-black text-lg uppercase tracking-widest shadow-[6px_6px_0px_0px_currentColor] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_currentColor] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all rounded-xl no-underline text-brew-text"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[680px] mx-auto px-4 py-12 md:py-20">
      {/* ── Profile Header ── */}
      <div className="text-center mb-12 animate-fade-up">
        {/* Brutalist Avatar */}
        <div className="w-32 h-32 mx-auto mb-6 rounded-full border-4 border-brew-text bg-brew-yellow shadow-[6px_6px_0px_0px_currentColor] flex items-center justify-center overflow-hidden">
          {creator.creator_image ? (
            <img
              src={`${API_ORIGIN}${creator.creator_image}`}
              alt={creator.creator_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Avatar
              name={creator.creator_name}
              size="xl"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <h1 className="font-inter font-black text-4xl md:text-5xl text-brew-text uppercase tracking-tight mb-3">
          {creator.creator_name}
        </h1>

        <div className="mb-5">
          <span className="inline-block px-4 py-1.5 border-2 border-brew-text bg-white font-inter font-black text-xs uppercase tracking-widest rounded-full shadow-[2px_2px_0px_0px_currentColor]">
            {creator.creator_category}
          </span>
        </div>

        <p className="font-inter font-bold text-base md:text-lg text-brew-text/80 leading-relaxed max-w-lg mx-auto mb-6">
          {creator.creator_bio}
        </p>

        {/* Social Links - Sorted in grid of three */}
        {creator.creator_links && creator.creator_links.length > 0 && (
          <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-center justify-center gap-4 max-w-sm mx-auto">
            {creator.creator_links.map((url, idx) => {
              const Icon = getLinkIcon(url);
              return (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-12 h-12 rounded-xl border-2 border-brew-text bg-[#fffdf0] flex items-center justify-center text-brew-text shadow-[3px_3px_0px_0px_currentColor] hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_currentColor] hover:bg-brew-yellow active:translate-y-[2px] active:shadow-none transition-all no-underline"
                  aria-label={`Link ${idx + 1}`}
                >
                  <Icon size={20} strokeWidth={3} />
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Support Widget ── */}
      <div className="bg-white border-4 border-brew-text rounded-[32px] p-6 md:p-10 shadow-[12px_12px_0px_0px_currentColor] mb-10 animate-fade-up delay-100 relative overflow-hidden">
        {/* Decorative corner stripe */}
        <div className="absolute -right-12 -top-12 w-24 h-24 bg-brew-yellow border-4 border-brew-text rotate-45" />

        <h2 className="font-inter font-black text-2xl text-brew-text mb-8 text-center uppercase tracking-wider relative z-10 flex items-center justify-center gap-2">
          Buy {creator.creator_name.split(" ")[0]} a coffee
          <Coffee size={24} strokeWidth={3} />
        </h2>

        {/* Tactile Cup Quantity Picker */}
        <div className="grid grid-cols-4 gap-3 md:gap-4 mb-8">
          {[1, 3, 5].map((count) => {
            const isActive = !customCups && cupCount === count;
            return (
              <button
                key={count}
                onClick={() => handleCupSelect(count)}
                className={`h-16 md:h-20 rounded-2xl border-4 border-brew-text flex flex-col items-center justify-center transition-all duration-150 outline-none
                  ${
                    isActive
                      ? "bg-brew-yellow shadow-none translate-y-1 md:translate-y-2"
                      : "bg-[#fffdf0] shadow-[4px_4px_0px_0px_currentColor] md:shadow-[6px_6px_0px_0px_currentColor] hover:-translate-y-1 hover:bg-white"
                  }`}
                aria-label={`${count} coffee${count > 1 ? "s" : ""}`}
              >
                <Coffee
                  size={24}
                  strokeWidth={3}
                  className="leading-none mb-1"
                />

                <span className="font-inter font-black text-xs md:text-sm text-brew-text">
                  ×{count}
                </span>
              </button>
            );
          })}

          {/* Custom Input */}
          <div
            className={`h-16 md:h-20 rounded-2xl border-4 border-brew-text flex items-center justify-center transition-all duration-150 overflow-hidden
            ${
              customCups
                ? "bg-brew-yellow shadow-none translate-y-1 md:translate-y-2"
                : "bg-[#fffdf0] shadow-[4px_4px_0px_0px_currentColor] md:shadow-[6px_6px_0px_0px_currentColor] focus-within:-translate-y-1 focus-within:bg-white"
            }`}
          >
            <input
              type="number"
              min="1"
              max="100"
              value={customCups}
              onChange={handleCustomChange}
              placeholder="#"
              className="w-full h-full text-center font-inter font-black text-lg md:text-xl bg-transparent outline-none text-brew-text placeholder:text-brew-text/30"
              aria-label="Custom number of coffees"
            />
          </div>
        </div>

        {/* Optional Name & Message */}
        <div className="space-y-4 mb-8">
          <input
            type="text"
            placeholder="Name or @username (optional)"
            value={supporterName}
            onChange={(e) => setSupporterName(e.target.value)}
            className="w-full px-5 py-4 bg-[#fffdf0] border-2 border-brew-text rounded-xl font-inter font-bold text-brew-text placeholder:text-brew-text/40 focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] focus:-translate-y-1 transition-all duration-200"
          />
          <textarea
            placeholder="Say something nice... (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full px-5 py-4 bg-[#fffdf0] border-2 border-brew-text rounded-xl font-inter font-bold text-brew-text placeholder:text-brew-text/40 focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] focus:-translate-y-1 transition-all duration-200 resize-none"
          />
        </div>

        {/* Massive Support CTA */}
        <button className="flex w-full min-h-[64px] items-center justify-center gap-3 rounded-2xl border-4 border-brew-text bg-brew-text text-[#fffdf0] px-8 py-4 font-inter text-xl font-black shadow-[6px_6px_0px_0px_#F5C518] transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#F5C518] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none mb-4 group overflow-hidden relative">
          <span className="relative z-10 flex items-center gap-2">
            Support ${totalAmount.toFixed(2)}{" "}
            <ArrowRight
              size={24}
              strokeWidth={4}
              className="text-brew-yellow group-hover:translate-x-1 transition-transform"
            />
          </span>
        </button>

        <p className="text-center font-inter font-black text-[10px] text-brew-text/50 uppercase tracking-widest">
          🔒 Secured by Stripe · No account needed
        </p>
      </div>

      {/* ── Tabs ── */}
      <div className="flex border-b-4 border-brew-text mb-8 animate-fade-up delay-300">
        {["supporters", "posts", "about"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 font-inter font-black text-sm md:text-base text-center uppercase tracking-widest transition-all cursor-pointer rounded-t-xl border-x-4 border-t-4 mb-[-4px]
              ${
                activeTab === tab
                  ? "bg-white text-brew-text border-brew-text z-10"
                  : "bg-brew-yellow-light text-brew-text/60 border-transparent hover:text-brew-text hover:bg-[#fffdf0] z-0"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in bg-white border-4 border-brew-text border-t-0 -mt-8 pt-12 p-6 md:p-8 rounded-b-3xl shadow-[8px_8px_0px_0px_currentColor] min-h-[300px]">
        {activeTab === "supporters" && (
          <div className="space-y-4">
            {supportersLoading ? (
              <div className="py-12 flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-brew-text/20 mb-3" />
                <p className="font-inter font-black text-xs text-brew-text/40 uppercase tracking-widest">
                  Loading Feed...
                </p>
              </div>
            ) : supporters.length > 0 ? (
              supporters.map((s, i) => (
                <div
                  key={i}
                  className="bg-[#fffdf0] border-2 border-brew-text rounded-xl p-5 shadow-[4px_4px_0px_0px_currentColor] flex gap-4"
                >
                  <div className="w-12 h-12 rounded-full border-2 border-brew-text bg-brew-yellow flex items-center justify-center font-black text-xl text-brew-text shrink-0 shadow-[2px_2px_0px_0px_currentColor]">
                    {s.supporter_name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="font-inter font-black text-lg text-brew-text">
                        {s.supporter_name}
                      </span>
                      <span className="font-inter font-black text-xs text-brew-text bg-white border-2 border-brew-text px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_currentColor] inline-flex items-center gap-0.5">
                        {s.support_type === "coffee" ? (
                          <>
                            {Array.from({ length: Math.min(s.supporter_cups, 5) }).map(
                              (_, idx) => (
                                <Coffee key={idx} size={14} strokeWidth={3} />
                              ),
                            )}
                            {s.supporter_cups > 5 && <span className="text-[10px]">+{s.supporter_cups - 5}</span>}
                          </>
                        ) : (
                          <span className="text-[10px] uppercase">Membership</span>
                        )}
                        <span className="ml-1">· ${s.total_amount}</span>
                      </span>
                    </div>
                    {s.supporter_message && (
                      <p className="font-inter font-bold text-sm text-brew-text/80 leading-relaxed mb-3 bg-white border-2 border-brew-text border-dashed p-3 rounded-lg">
                        "{s.supporter_message}"
                      </p>
                    )}
                    <div className="flex items-center gap-3">
                      <span className="font-inter font-bold text-[10px] text-brew-text/40 uppercase tracking-widest">
                        {getRelativeTime(s.created_at)}
                      </span>
                      {s.support_replied && (
                        <span className="font-inter font-black text-[9px] text-green-600 uppercase tracking-widest bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
                          Replied
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center bg-[#fffdf0] border-2 border-dashed border-brew-text/20 rounded-3xl">
                <div className="text-4xl mb-4 grayscale opacity-20">☕️</div>
                <h3 className="font-inter font-black text-lg text-brew-text/30 uppercase tracking-tight">
                  No supporters yet
                </h3>
                <p className="font-inter font-bold text-xs text-brew-text/20 uppercase tracking-widest mt-1">
                  Be the first to buy a coffee!
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "posts" && (
          <div className="space-y-4">
            {posts.map((post, i) => (
              <div
                key={i}
                className="bg-white border-2 border-brew-text rounded-xl p-5 shadow-[4px_4px_0px_0px_currentColor] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_currentColor] transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-inter font-black text-lg text-brew-text group-hover:text-brew-yellow-hover transition-colors">
                        {post.title}
                      </h3>
                      {post.membersOnly && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-brew-text text-[#fffdf0] border border-brew-text rounded text-[10px] font-black uppercase tracking-widest">
                          <Lock size={10} strokeWidth={3} /> Members
                        </span>
                      )}
                    </div>
                    <p className="font-inter font-medium text-sm text-brew-text/70 leading-relaxed mb-4">
                      {post.preview}
                    </p>
                    <span className="font-inter font-bold text-[10px] text-brew-text/50 uppercase tracking-widest">
                      {post.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "about" && (
          <div className="bg-[#fffdf0] border-2 border-brew-text rounded-xl p-6 md:p-8 shadow-[4px_4px_0px_0px_currentColor]">
            <h3 className="font-inter font-black text-2xl text-brew-text mb-4 uppercase tracking-tight">
              About {creator.creator_name}
            </h3>
            <p className="font-inter font-bold text-base text-brew-text/80 leading-relaxed mb-8">
              {creator.creator_bio}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm font-inter font-black text-brew-text uppercase tracking-widest pt-6 border-t-2 border-brew-text border-dashed">
              <span className="bg-white border-2 border-brew-text px-3 py-1.5 rounded shadow-[2px_2px_0px_0px_currentColor] inline-flex items-center gap-1.5">
                <Coffee size={16} strokeWidth={3} />
                {creator.total_cups.toLocaleString()} CUPS
              </span>
              <span className="bg-brew-yellow-light border-2 border-brew-text px-3 py-1.5 rounded shadow-[2px_2px_0px_0px_currentColor]">
                {creator.creator_category}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

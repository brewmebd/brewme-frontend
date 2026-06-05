import { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Avatar from "../components/Avatar";
import Toast from "../components/Toast";
import Skeleton from "../components/Skeleton";
import { API_BASE, API_ORIGIN, getCreatorPosts } from "../lib/api";
import {
  Lock,
  Globe,
  Share2,
  Music,
  AtSign,
  ArrowRight,
  Coffee,
  Loader2,
  FileText,
  Heart,
  MessageSquare,
  Share,
  Check,
  Trophy,
  Users as UsersIcon,
  Crown,
  TrendingUp,
  X,
} from "lucide-react";

const PRICE_PER_CUP = 5;

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

const membershipTiers = [
  {
    id: 1,
    name: "Supporter",
    price: 5,
    perks: ["Access to exclusive posts", "Supporter badge"],
    color: "bg-blue-50",
  },
  {
    id: 2,
    name: "VIP Elite",
    price: 15,
    perks: ["Everything in Supporter", "Direct messaging", "Hi-res content"],
    color: "bg-brew-yellow-light/40",
  },
];

export default function CreatorProfilePage() {
  const { username } = useParams();
  const [creator, setCreator] = useState(null);
  const [supporters, setSupporters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [supportersLoading, setSupportersLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [cupCount, setCupCount] = useState(1);
  const [customCups, setCustomCups] = useState("");
  const [supporterName, setSupporterName] = useState("");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("supporters");
  const [showCheckout, setShowCheckout] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCreator = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/creators/${username}`);
        if (!res.ok) throw new Error(res.status === 404 ? "Creator not found" : "Error");
        const data = await res.json();
        setCreator(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };

    const fetchSupporters = async () => {
      setSupportersLoading(true);
      try {
        const res = await fetch(`${API_BASE}/creators/${username}/supporters?limit=20`);
        if (res.ok) {
          const data = await res.json();
          setSupporters(Array.isArray(data) ? data : []);
        }
      } catch (err) { console.error(err); } finally { setTimeout(() => setSupportersLoading(false), 800); }
    };

    const fetchPosts = async () => {
      setPostsLoading(true);
      try {
        const data = await getCreatorPosts(username);
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) { console.error(err); } finally { setTimeout(() => setPostsLoading(false), 1000); }
    };

    if (username) { fetchCreator(); fetchSupporters(); fetchPosts(); }

    const handleScroll = () => {
      if (window.scrollY > 400) setShowSticky(true);
      else setShowSticky(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [username]);

  const totalAmount = useMemo(() => {
    const cups = customCups ? parseInt(customCups) || 0 : cupCount;
    return cups * PRICE_PER_CUP;
  }, [cupCount, customCups]);

  const handleCupSelect = (count) => { setCupCount(count); setCustomCups(""); };
  const handleCustomChange = (e) => {
    const val = e.target.value;
    if (val === "" || (parseInt(val) >= 1 && parseInt(val) <= 1000)) setCustomCups(val);
  };
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowToast({ message: "Link copied!", type: "success" });
  };
  const handleSupportClick = () => setShowCheckout(true);

  const toggleLike = (postId, e) => {
    e.stopPropagation();
    const newLiked = new Set(likedPosts);
    if (newLiked.has(postId)) newLiked.delete(postId);
    else newLiked.add(postId);
    setLikedPosts(newLiked);
  };

  const getLinkIcon = (url) => {
    const u = url.toLowerCase();
    if (u.includes("twitter.com") || u.includes("x.com")) return AtSign;
    if (u.includes("instagram.com")) return Share2;
    if (u.includes("youtube.com")) return Music;
    return Globe;
  };

  if (loading) return (
    <div className="min-h-screen bg-[#fffdf0] flex flex-col">
      <Skeleton className="h-40 md:h-56 w-full rounded-none" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full relative z-20 -mt-16 md:-mt-20">
        <div className="flex flex-col items-center">
          <Skeleton className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white shadow-none" />
          <Skeleton className="w-48 h-8 mt-6" />
          <Skeleton className="w-64 h-4 mt-4" />
          <div className="flex gap-3 mt-8">
            <Skeleton className="w-24 h-10 rounded-xl" />
            <Skeleton className="w-10 h-10 rounded-xl" />
            <Skeleton className="w-10 h-10 rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
          <div className="lg:col-span-8 space-y-4">
            <Skeleton className="h-14 w-full rounded-t-xl" />
            <Skeleton className="h-96 w-full rounded-b-[28px]" />
          </div>
          <div className="lg:col-span-4">
            <Skeleton className="h-[400px] w-full rounded-[32px]" />
          </div>
        </div>
      </div>
    </div>
  );

  if (error || !creator) return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-brew-yellow-light">
      <div className="bg-white border-4 border-brew-text p-10 rounded-[32px] shadow-[8px_8px_0px_0px_currentColor] text-center max-w-sm">
        <h1 className="font-inter font-black text-2xl uppercase mb-4 text-brew-text">Oops! Not Found</h1>
        <Link to="/" className="inline-block px-6 py-3 border-2 border-brew-text bg-brew-yellow font-black text-xs uppercase shadow-[3px_3px_0px_0px_currentColor] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all rounded-xl no-underline text-brew-text">Go Home</Link>
      </div>
    </div>
  );

  const creatorFirstName = (creator.creator_name || "").split(" ")[0];

  return (
    <div className="min-h-screen bg-[#fffdf0] selection:bg-brew-yellow selection:text-brew-text font-inter flex flex-col overflow-x-hidden">
      {/* ── Header ── */}
      <div className="relative h-40 md:h-56 w-full overflow-hidden border-b-4 border-brew-text bg-brew-yellow shrink-0">
        {creator.cover_image ? (
          <img src={`${API_ORIGIN}${creator.cover_image}`} className="w-full h-full object-cover" alt="" />
        ) : (
          <div className="w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(#3E2723 2px, transparent 2px)', backgroundSize: '24px 24px' }} />
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full relative z-20">
        <div className="flex flex-col items-center text-center -mt-16 md:-mt-20 mb-12">
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-brew-text bg-white shadow-[6px_6px_0px_0px_currentColor] flex items-center justify-center overflow-hidden mb-6 ring-4 ring-[#fffdf0] hover-lift transition-transform">
            {creator.creator_image ? (
              <img src={`${API_ORIGIN}${creator.creator_image}`} alt={creator.creator_name} className="w-full h-full object-cover" />
            ) : (
              <Avatar name={creator.creator_name} size="xl" className="w-full h-full object-cover" />
            )}
          </div>
          
          <h1 className="font-inter font-black text-3xl md:text-4xl text-brew-text uppercase tracking-tight mb-2 leading-none">{creator.creator_name}</h1>
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-brew-yellow border-2 border-brew-text font-inter font-black text-[9px] uppercase tracking-widest rounded shadow-[2px_2px_0px_0px_currentColor]">{creator.creator_category}</span>
            <span className="font-inter font-bold text-xs opacity-40 uppercase">{(creator.total_supporters || 0).toLocaleString()} Supporters</span>
          </div>
          <p className="font-inter font-medium text-base text-brew-text/80 max-w-xl leading-relaxed mb-8 text-pretty">{creator.creator_bio}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button onClick={handleCopyLink} className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-brew-text rounded-xl font-inter font-black text-[10px] uppercase shadow-[3px_3px_0px_0px_currentColor] hover:-translate-y-0.5 active-haptic transition-all"><Share size={14} strokeWidth={3} /> Share</button>
            {creator.creator_links?.map((url, idx) => {
              const Icon = getLinkIcon(url);
              return (<a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl border-2 border-brew-text bg-[#fffdf0] flex items-center justify-center text-brew-text shadow-[2px_2px_0px_0px_currentColor] hover:-translate-y-1 active-haptic transition-all"><Icon size={16} strokeWidth={3} /></a>);
            })}
          </div>
        </div>

        {/* ── Content Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative pb-20">
          
          {/* LEFT: Content */}
          <main className="lg:col-span-7 xl:col-span-8 h-fit order-2 lg:order-1 w-full">
            <div className="flex border-b-4 border-brew-text mb-8">
              {["supporters", "posts", "about"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 font-inter font-black text-xs md:text-sm text-center uppercase tracking-widest transition-all cursor-pointer rounded-t-xl border-x-4 border-t-4 mb-[-4px]
                    ${activeTab === tab ? "bg-white text-brew-text border-brew-text z-10 shadow-[0_-4px_0_0_#fff]" : "bg-transparent text-brew-text/30 border-transparent hover:bg-white/50 z-0"}`}
                >{tab}</button>
              ))}
            </div>

            <div className="bg-white border-4 border-brew-text rounded-b-[28px] -mt-8 pt-10 p-5 md:p-8 shadow-[6px_6px_0px_0px_currentColor] min-h-[400px]">
              {activeTab === "supporters" && (
                <div className="space-y-4">
                  {supportersLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
                    </div>
                  ) : supporters.length > 0 ? (
                    supporters.map((s, i) => (
                      <div key={i} className="bg-[#fffdf0] border-2 border-brew-text rounded-2xl p-4 md:p-5 shadow-[3px_3px_0px_0px_currentColor] flex gap-4 transition-all hover:-translate-y-0.5">
                        <div className="w-12 h-12 rounded-full border-2 border-brew-text bg-brew-yellow flex items-center justify-center font-black text-xl shrink-0">{(s.supporter_name || "A").charAt(0)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="font-black text-sm md:text-base">{s.supporter_name || "Anonymous"}</span>
                            <span className="font-black text-[8px] bg-white border-2 border-brew-text px-1.5 py-0.5 rounded shadow-[1px_1px_0px_0px_currentColor] inline-flex items-center gap-1 uppercase shrink-0">
                              {s.support_type === "coffee" ? (<><Coffee size={10} /> × {s.supporter_cups}</>) : (<><Crown size={10} className="text-brew-yellow" /> VIP</>)}
                              <span className="opacity-30">·</span><span>${s.total_amount}</span>
                            </span>
                          </div>
                          {s.supporter_message && (<p className="font-bold text-xs md:text-sm text-brew-text/70 italic mb-2 leading-relaxed">"{s.supporter_message}"</p>)}
                          <span className="font-black text-[8px] opacity-20 uppercase tracking-widest">{getRelativeTime(s.created_at)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-24 text-center text-brew-text/20 uppercase font-black text-[10px] tracking-[0.2em]">No supporters yet</div>
                  )}
                </div>
              )}

              {activeTab === "posts" && (
                <div className="space-y-6">
                  {postsLoading ? (
                    <div className="space-y-6">
                      {[1, 2].map(i => <Skeleton key={i} className="h-64 w-full" />)}
                    </div>
                  ) : posts.length > 0 ? (
                    posts.map((post) => (
                      <article key={post.id} className="bg-white border-2 border-brew-text rounded-2xl p-5 shadow-[4px_4px_0px_0px_currentColor] hover:-translate-y-0.5 transition-all group relative overflow-hidden active-haptic">
                        {post.membersOnly && (<div className="absolute top-0 right-0 px-3 py-1 bg-brew-text text-brew-yellow font-black text-[8px] uppercase tracking-widest rounded-bl-xl z-10">VIP</div>)}
                        <div className="flex flex-col gap-4">
                          {post.image && (<div className="w-full h-48 md:h-64 rounded-xl border-2 border-brew-text overflow-hidden shadow-[3px_3px_0px_0px_currentColor] bg-[#fffdf0]"><img src={post.image} className="w-full h-full object-cover" alt="" /></div>)}
                          <div>
                            <h3 className="font-black text-lg text-brew-text mb-2 transition-colors leading-tight group-hover:text-brew-yellow-hover">{post.title}</h3>
                            <p className={`text-sm text-brew-text/70 leading-relaxed mb-4 ${post.membersOnly ? 'blur-[6px] select-none opacity-10' : ''}`}>{post.preview}</p>
                            <div className="flex items-center justify-between gap-4 pt-3 border-t-2 border-dashed border-brew-text/10 text-brew-text/30 font-black text-[8px] uppercase tracking-widest">
                              <div className="flex gap-3">
                                <button 
                                  onClick={(e) => toggleLike(post.id, e)}
                                  className={`flex items-center gap-1.5 transition-all hover:text-red-500 ${likedPosts.has(post.id) ? 'text-red-500' : ''}`}
                                >
                                  <Heart size={14} className={`${likedPosts.has(post.id) ? 'fill-red-500 animate-heart-pop' : ''}`} strokeWidth={3} /> {post.likes_count + (likedPosts.has(post.id) ? 1 : 0) || 0}
                                </button>
                                <span className="flex items-center gap-1.5"><MessageSquare size={14} strokeWidth={3} /> {post.comments_count || 0}</span>
                              </div>
                              <span>{getRelativeTime(post.published_at)}</span>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="py-24 text-center text-brew-text/20 uppercase font-black text-[10px] tracking-[0.2em]">No posts yet</div>
                  )}
                </div>
              )}

              {activeTab === "about" && (
                <div className="text-brew-text">
                  <h3 className="font-black text-xl mb-6 uppercase border-b-4 border-brew-text pb-2 inline-block">The Story</h3>
                  <p className="font-bold text-sm md:text-base text-brew-text/80 leading-relaxed mb-10 text-pretty">{creator.creator_bio}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[#fffdf0] border-2 border-brew-text p-5 rounded-2xl shadow-[3px_3px_0px_0px_currentColor] flex flex-col justify-center hover-lift transition-transform">
                      <p className="font-black text-[8px] opacity-30 uppercase mb-2">Total Support</p>
                      <div className="flex items-center gap-3"><Coffee size={18} className="text-brew-yellow shrink-0" /><span className="font-black text-lg md:text-xl uppercase truncate">{(creator.total_cups || 0).toLocaleString()} CUPS</span></div>
                    </div>
                    <div className="bg-[#fffdf0] border-2 border-brew-text p-5 rounded-2xl shadow-[3px_3px_0px_0px_currentColor] flex flex-col justify-center hover-lift transition-transform">
                      <p className="font-black text-[8px] opacity-30 uppercase mb-2">Focus Area</p>
                      <div className="flex items-center gap-3"><Trophy size={18} className="shrink-0" /><span className="font-black text-lg md:text-xl uppercase truncate">{creator.creator_category}</span></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* RIGHT: Sidebar */}
          <aside className="lg:col-span-5 xl:col-span-4 space-y-8 order-1 lg:order-2 lg:sticky lg:top-8 h-fit">
            {/* Dynamic Goal Widget */}
            {creator.goal_title && (
              <div className="bg-[#fffdf0] border-4 border-brew-text rounded-[32px] p-6 shadow-[6px_6px_0px_0px_currentColor] animate-fade-up">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brew-yellow border-2 border-brew-text flex items-center justify-center shadow-[2px_2px_0px_0px_currentColor]">
                      <TrendingUp size={16} strokeWidth={3} />
                    </div>
                    <h3 className="font-inter font-black text-[10px] uppercase tracking-widest leading-none">Creator Goal</h3>
                  </div>
                  <span className="font-inter font-black text-lg text-brew-yellow-hover">
                    {Math.round(((creator.total_cups * PRICE_PER_CUP) / (creator.goal_amount || 500)) * 100)}%
                  </span>
                </div>
                <p className="font-inter font-bold text-sm text-brew-text mb-4 leading-tight">{creator.goal_title}</p>
                <div className="h-3 w-full bg-white border-2 border-brew-text rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-brew-yellow border-r-2 border-brew-text transition-all duration-1000" 
                    style={{ width: `${Math.min(100, ((creator.total_cups * PRICE_PER_CUP) / (creator.goal_amount || 500)) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between font-inter font-black text-[8px] uppercase tracking-widest opacity-40">
                  <span>${(creator.total_cups * PRICE_PER_CUP).toLocaleString()} reached</span>
                  <span>${(creator.goal_amount || 500).toLocaleString()} target</span>
                </div>
              </div>
            )}

            {/* Tip Box */}
            <div id="support-box" className="bg-white border-4 border-brew-text rounded-[32px] p-6 shadow-[6px_6px_0px_0px_currentColor] text-brew-text">
              <h2 className="font-black text-lg mb-6 uppercase tracking-widest flex items-center gap-3 leading-none">Support <Coffee size={24} className="text-brew-yellow" /></h2>
              <div className="grid grid-cols-4 gap-2 mb-6">
                {[1, 3, 5].map((count) => (
                  <button key={count} onClick={() => handleCupSelect(count)} className={`h-12 rounded-xl border-2 border-brew-text flex items-center justify-center transition-all shadow-[2px_2px_0px_0px_currentColor] active-haptic
                      ${!customCups && cupCount === count ? "bg-brew-yellow -translate-x-[1px] -translate-y-[1px] shadow-[4px_4px_0px_0px_currentColor]" : "bg-[#fffdf0] hover:-translate-y-0.5"}`}
                  ><span className="font-black text-sm">×{count}</span></button>
                ))}
                <div className={`h-12 rounded-xl border-2 border-brew-text flex items-center justify-center transition-all shadow-[2px_2px_0px_0px_currentColor] ${customCups ? "bg-brew-yellow shadow-[3px_3px_0px_0px_currentColor]" : "bg-[#fffdf0]"}`}><input type="number" min="1" max="1000" value={customCups} onChange={handleCustomChange} placeholder="#" className="w-full h-full text-center font-black text-sm bg-transparent outline-none placeholder:text-brew-text/20" /></div>
              </div>
              <div className="space-y-3 mb-6">
                <input type="text" placeholder="Your Name" value={supporterName} onChange={(e) => setSupporterName(e.target.value)} className="w-full px-4 py-3 bg-[#fffdf0] border-2 border-brew-text rounded-xl font-bold text-xs focus:outline-none focus:bg-white transition-all shadow-[2px_2px_0px_0px_currentColor]" />
                <textarea placeholder="Say something nice..." value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className="w-full px-4 py-3 bg-[#fffdf0] border-2 border-brew-text rounded-xl font-bold text-xs focus:outline-none focus:bg-white transition-all resize-none shadow-[2px_2px_0px_0px_currentColor]" />
              </div>
              <button onClick={handleSupportClick} className="flex w-full min-h-[60px] items-center justify-center gap-3 rounded-xl border-4 border-brew-text bg-brew-text text-[#fffdf0] px-6 py-3 font-black text-lg shadow-[4px_4px_0px_0px_#F5C518] hover:translate-x-[1px] hover:translate-y-[1px] active-haptic transition-all group">Support ${totalAmount.toFixed(2)} <ArrowRight size={20} strokeWidth={4} className="text-brew-yellow transition-transform group-hover:translate-x-1 shrink-0" /></button>
              <div className="flex items-center justify-center gap-2 mt-5 opacity-30 text-[9px] font-black uppercase tracking-widest"><Lock size={10} /> Secure Stripe</div>
            </div>

            <div className="space-y-4 pb-10">
              <h3 className="font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-3 px-3 text-brew-text/30">Membership Tiers</h3>
              {membershipTiers.map((tier) => (
                <div key={tier.id} className={`${tier.color} border-4 border-brew-text rounded-[28px] p-5 shadow-[4px_4px_0px_0px_currentColor] transition-all hover:scale-[1.02] flex flex-col h-full text-brew-text active-haptic`}>
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-black text-lg uppercase leading-none tracking-tight">{tier.name}</h4>
                    <div className="text-right"><p className="font-black text-lg leading-none">${tier.price}</p><p className="text-[8px] font-bold opacity-30 uppercase tracking-widest mt-1">/month</p></div>
                  </div>
                  <ul className="space-y-2 mb-8 flex-grow">
                    {tier.perks.map((perk, i) => (
                      <li key={i} className="flex items-start gap-2 font-bold text-[11px] text-brew-text/80 leading-snug">
                        <Check size={12} strokeWidth={5} className="mt-0.5 shrink-0 text-brew-text" /> {perk}
                      </li>
                    ))}
                  </ul>
                  <button onClick={handleSupportClick} className="w-full py-3 bg-white border-2 border-brew-text rounded-xl font-black text-[10px] uppercase tracking-widest shadow-[3px_3px_0px_0px_currentColor] hover:-translate-y-0.5 transition-all">Join Tier</button>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>

      {/* ── Mobile Sticky Support Bar ── */}
      <div className={`lg:hidden fixed bottom-4 left-4 right-4 z-[60] transition-all duration-500 transform ${showSticky ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'}`}>
        <div className="bg-brew-text border-2 border-brew-text rounded-2xl p-3 flex items-center justify-between gap-4 shadow-[6px_6px_0px_0px_#F5C518]">
          <div className="flex items-center gap-3 min-w-0 pl-2">
            <Avatar name={creator.creator_name} src={creator.creator_image ? `${API_ORIGIN}${creator.creator_image}` : ""} size="sm" className="border-2 border-white" />
            <div className="min-w-0">
              <p className="font-black text-white text-xs truncate leading-none mb-1">Support {creatorFirstName}</p>
              <p className="font-bold text-brew-yellow text-[9px] uppercase tracking-widest leading-none">One cup at a time</p>
            </div>
          </div>
          <button 
            onClick={() => {
              const el = document.getElementById('support-box');
              el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            className="px-6 py-2.5 bg-brew-yellow border-2 border-brew-text rounded-xl font-inter font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all"
          >
            Support
          </button>
        </div>
      </div>

      {showToast && <Toast message={showToast.message} type={showToast.type} onClose={() => setShowToast(null)} />}
      
      {/* ── Checkout Modal ── */}
      {showCheckout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-brew-text/60 backdrop-blur-xl animate-fade-in" onClick={() => setShowCheckout(false)} />
          <div className="relative w-full max-w-sm bg-white border-4 border-brew-text rounded-[32px] p-8 shadow-[10px_10px_0px_0px_currentColor] animate-slide-in-up text-brew-text text-center">
            <button onClick={() => setShowCheckout(false)} className="absolute top-6 right-6 p-2 hover:bg-brew-yellow-light rounded-full transition-colors"><X size={20} strokeWidth={3} /></button>
            <div className="w-16 h-16 bg-brew-yellow border-4 border-brew-text rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_currentColor] animate-float"><Coffee size={32} strokeWidth={3} /></div>
            <h3 className="font-inter font-black text-2xl uppercase tracking-tight mb-4">Complete Payment</h3>
            <p className="font-bold text-sm text-brew-text/60 mb-8 leading-relaxed">You're about to support <span className="text-brew-text font-black">{creatorFirstName}</span> with a contribution of <span className="text-brew-text font-black">${totalAmount.toFixed(2)}</span>. Redirecting to our secure Stripe checkout...</p>
            <button onClick={() => setShowCheckout(false)} className="w-full py-4 bg-brew-text text-white border-2 border-brew-text rounded-2xl font-black text-base uppercase tracking-widest shadow-[6px_6px_0px_0px_#F5C518] hover:translate-x-1 hover:translate-y-1 active:shadow-none transition-all">Continue to Stripe</button>
            <p className="mt-6 text-[9px] font-black uppercase tracking-[0.2em] opacity-30">Transaction Secured by 256-bit Encryption</p>
          </div>
        </div>
      )}

      <footer className="border-t-4 border-brew-text bg-white py-12 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="font-black text-[10px] uppercase tracking-[0.4em] text-brew-text/20">BrewMe · Fueling Creativity · 2026</p>
        </div>
      </footer>
    </div>
  );
}

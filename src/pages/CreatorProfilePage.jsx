import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import Avatar from "../components/Avatar";
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
} from "lucide-react";

/* ── Mock Creator Data ── */
const creatorsData = {
  sarahchen: {
    name: "Sarah Chen",
    bio: "Digital artist creating illustrations, tutorials, and design resources. I share weekly art process videos and exclusive assets for my supporters.",
    category: "Digital Art",
    supporters: 1247,
    goal: {
      current: 340,
      target: 500,
      label: "New iPad Pro for drawing streams",
    },
    socials: { twitter: "#", instagram: "#", website: "#" },
  },
  alexrivera: {
    name: "Alex Rivera",
    bio: "Indie musician crafting lo-fi beats and ambient soundscapes. Every coffee helps me produce my next album.",
    category: "Music",
    supporters: 892,
    goal: { current: 180, target: 300, label: "Studio equipment upgrade" },
    socials: { twitter: "#", youtube: "#" },
  },
  jordanpark: {
    name: "Jordan Park",
    bio: "Fiction writer and poet. I publish weekly short stories and poetry for my supporters.",
    category: "Writing",
    supporters: 634,
    goal: null,
    socials: { twitter: "#" },
  },
  mayajohnson: {
    name: "Maya Johnson",
    bio: 'Host of "The Creative Hour" — a weekly podcast interviewing artists, designers, and creative entrepreneurs.',
    category: "Podcasting",
    supporters: 2103,
    goal: { current: 450, target: 500, label: "New podcast microphone setup" },
    socials: { twitter: "#", instagram: "#", youtube: "#" },
  },
};

const recentSupporters = [
  {
    name: "Emily R.",
    message: "Love your work! Keep creating amazing art! 🎨",
    amount: 15,
    time: "2 hours ago",
    cups: 3,
  },
  {
    name: "Marcus T.",
    message: "Your tutorials saved my portfolio. Thank you!",
    amount: 5,
    time: "5 hours ago",
    cups: 1,
  },
  { name: "Anonymous", message: "", amount: 25, time: "1 day ago", cups: 5 },
  {
    name: "Lily K.",
    message: "Supporting your journey! Can't wait for more content.",
    amount: 10,
    time: "2 days ago",
    cups: 2,
  },
  {
    name: "James W.",
    message: "Incredible artist. Honored to support.",
    amount: 5,
    time: "3 days ago",
    cups: 1,
  },
];

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

export default function CreatorProfilePage() {
  const { username } = useParams();
  const creator = creatorsData[username];
  const [cupCount, setCupCount] = useState(1);
  const [customCups, setCustomCups] = useState("");
  const [supporterName, setSupporterName] = useState("");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("supporters");
  const [priceAnimating, setPriceAnimating] = useState(false);

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

  // 404 for unknown creators
  if (!creator) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 bg-brew-yellow-light">
        <div className="bg-white border-4 border-brew-text p-10 md:p-14 rounded-[32px] shadow-[12px_12px_0px_0px_currentColor] text-center max-w-lg animate-fade-up">
          <div className="text-7xl mb-6 inline-block -rotate-12 drop-shadow-[4px_4px_0px_rgba(62,39,35,0.2)]">
            🫗
          </div>
          <h1 className="font-inter font-black text-4xl md:text-5xl text-brew-text uppercase tracking-tight mb-4">
            Brew Not Found
          </h1>
          <p className="font-inter font-bold text-lg text-brew-text/70 mb-8">
            We couldn't find a creator with that username.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 border-4 border-brew-text bg-brew-yellow font-inter font-black text-lg uppercase tracking-widest shadow-[6px_6px_0px_0px_currentColor] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_currentColor] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all rounded-xl no-underline text-brew-text"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  const socialIcons = {
    twitter: AtSign,
    instagram: Share2,
    youtube: Music,
    website: Globe,
  };

  return (
    <div className="max-w-[680px] mx-auto px-4 py-12 md:py-20">
      {/* ── Profile Header ── */}
      <div className="text-center mb-12 animate-fade-up">
        {/* Brutalist Avatar */}
        <div className="w-32 h-32 mx-auto mb-6 rounded-full border-4 border-brew-text bg-brew-yellow shadow-[6px_6px_0px_0px_currentColor] flex items-center justify-center overflow-hidden">
          <Avatar
            name={creator.name}
            size="xl"
            className="w-full h-full object-cover"
          />
        </div>

        <h1 className="font-inter font-black text-4xl md:text-5xl text-brew-text uppercase tracking-tight mb-3">
          {creator.name}
        </h1>

        <div className="mb-5">
          <span className="inline-block px-4 py-1.5 border-2 border-brew-text bg-white font-inter font-black text-xs uppercase tracking-widest rounded-full shadow-[2px_2px_0px_0px_currentColor]">
            {creator.category}
          </span>
        </div>

        <p className="font-inter font-bold text-base md:text-lg text-brew-text/80 leading-relaxed max-w-lg mx-auto mb-6">
          {creator.bio}
        </p>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-4">
          {Object.entries(creator.socials).map(([key, url]) => {
            const Icon = socialIcons[key] || ExternalLink;
            return (
              <a
                key={key}
                href={url}
                className="w-12 h-12 rounded-xl border-2 border-brew-text bg-[#fffdf0] flex items-center justify-center text-brew-text shadow-[3px_3px_0px_0px_currentColor] hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_currentColor] hover:bg-brew-yellow active:translate-y-[2px] active:shadow-none transition-all no-underline"
                aria-label={key}
              >
                <Icon size={20} strokeWidth={3} />
              </a>
            );
          })}
        </div>
      </div>

      {/* ── Support Widget ── */}
      <div className="bg-white border-4 border-brew-text rounded-[32px] p-6 md:p-10 shadow-[12px_12px_0px_0px_currentColor] mb-10 animate-fade-up delay-100 relative overflow-hidden">
        {/* Decorative corner stripe */}
        <div className="absolute -right-12 -top-12 w-24 h-24 bg-brew-yellow border-4 border-brew-text rotate-45" />

        <h2 className="font-inter font-black text-2xl text-brew-text mb-8 text-center uppercase tracking-wider relative z-10 flex items-center justify-center gap-2">
          Buy {creator.name.split(" ")[0]} a coffee
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

      {/* ── Goal Bar ── */}
      {creator.goal && (
        <div className="bg-[#fffdf0] border-4 border-brew-text rounded-2xl p-6 shadow-[6px_6px_0px_0px_currentColor] mb-12 animate-fade-up delay-200">
          <div className="flex items-end justify-between mb-3">
            <span className="font-inter font-black text-sm text-brew-text uppercase tracking-widest">
              {creator.goal.label}
            </span>
            <span className="font-inter font-black text-lg text-brew-text">
              ${creator.goal.current}{" "}
              <span className="text-sm text-brew-text/50">
                / ${creator.goal.target}
              </span>
            </span>
          </div>
          {/* Brutalist Progress Bar */}
          <div className="h-6 w-full bg-white border-2 border-brew-text rounded-full overflow-hidden shadow-inner relative">
            <div
              className="h-full bg-brew-yellow border-r-2 border-brew-text transition-all duration-500 ease-out relative overflow-hidden"
              style={{
                width: `${Math.min(
                  (creator.goal.current / creator.goal.target) * 100,
                  100,
                )}%`,
              }}
            >
              {/* Striped pattern overlay for progress fill */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)",
                }}
              />
            </div>
          </div>
        </div>
      )}

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
            {recentSupporters.map((s, i) => (
              <div
                key={i}
                className="bg-[#fffdf0] border-2 border-brew-text rounded-xl p-5 shadow-[4px_4px_0px_0px_currentColor] flex gap-4"
              >
                <div className="w-12 h-12 rounded-full border-2 border-brew-text bg-brew-yellow flex items-center justify-center font-black text-xl text-brew-text shrink-0 shadow-[2px_2px_0px_0px_currentColor]">
                  {s.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className="font-inter font-black text-lg text-brew-text">
                      {s.name}
                    </span>
                    <span className="font-inter font-black text-xs text-brew-text bg-white border-2 border-brew-text px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_currentColor] inline-flex items-center gap-0.5">
                      {Array.from({ length: Math.min(s.cups, 5) }).map(
                        (_, idx) => (
                          <Coffee key={idx} size={14} strokeWidth={3} />
                        ),
                      )}
                      <span className="ml-1">· ${s.amount}</span>
                    </span>
                  </div>
                  {s.message && (
                    <p className="font-inter font-bold text-sm text-brew-text/80 leading-relaxed mb-3 bg-white border-2 border-brew-text border-dashed p-3 rounded-lg">
                      "{s.message}"
                    </p>
                  )}
                  <span className="font-inter font-bold text-[10px] text-brew-text/40 uppercase tracking-widest">
                    {s.time}
                  </span>
                </div>
              </div>
            ))}
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
              About {creator.name}
            </h3>
            <p className="font-inter font-bold text-base text-brew-text/80 leading-relaxed mb-8">
              {creator.bio}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm font-inter font-black text-brew-text uppercase tracking-widest pt-6 border-t-2 border-brew-text border-dashed">
              <span className="bg-white border-2 border-brew-text px-3 py-1.5 rounded shadow-[2px_2px_0px_0px_currentColor] inline-flex items-center gap-1.5">
                <Coffee size={16} strokeWidth={3} />
                {creator.supporters.toLocaleString()} SUPPORTERS
              </span>
              <span className="bg-brew-yellow-light border-2 border-brew-text px-3 py-1.5 rounded shadow-[2px_2px_0px_0px_currentColor]">
                {creator.category}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

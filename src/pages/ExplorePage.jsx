import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Avatar from "../components/Avatar";
import Input from "../components/Input";
import { Search } from "lucide-react";

const allCreators = [
  {
    name: "Sarah Chen",
    category: "Digital Art",
    supporters: 1247,
    username: "sarahchen",
    bio: "Creating digital illustrations and design tutorials.",
  },
  {
    name: "Alex Rivera",
    category: "Music",
    supporters: 892,
    username: "alexrivera",
    bio: "Indie musician crafting lo-fi beats and ambient sounds.",
  },
  {
    name: "Jordan Park",
    category: "Writing",
    supporters: 634,
    username: "jordanpark",
    bio: "Fiction writer and poet sharing weekly stories.",
  },
  {
    name: "Maya Johnson",
    category: "Podcasting",
    supporters: 2103,
    username: "mayajohnson",
    bio: 'Host of "The Creative Hour" — weekly interviews with artists.',
  },
  {
    name: "Leo Tanaka",
    category: "Open Source",
    supporters: 1568,
    username: "leotanaka",
    bio: "Full-stack developer maintaining open source tools.",
  },
  {
    name: "Priya Sharma",
    category: "Education",
    supporters: 945,
    username: "priyasharma",
    bio: "Teaching math and science through visual explainers.",
  },
  {
    name: "Chris Lee",
    category: "Gaming",
    supporters: 3201,
    username: "chrislee",
    bio: "Retro game streamer and speedrun enthusiast.",
  },
  {
    name: "Nina Costa",
    category: "Photography",
    supporters: 712,
    username: "ninacosta",
    bio: "Street and travel photographer based in Lisbon.",
  },
  {
    name: "David Kim",
    category: "Film",
    supporters: 523,
    username: "davidkim",
    bio: "Indie filmmaker documenting untold stories.",
  },
  {
    name: "Emma Wilson",
    category: "Cooking",
    supporters: 1890,
    username: "emmawilson",
    bio: "Home cook sharing plant-based recipes.",
  },
  {
    name: "Raj Patel",
    category: "Tech",
    supporters: 1345,
    username: "rajpatel",
    bio: "Tech reviewer and gadget enthusiast.",
  },
  {
    name: "Sofia Garcia",
    category: "Fitness",
    supporters: 2456,
    username: "sofiagarcia",
    bio: "Yoga instructor and wellness advocate.",
  },
];

const categories = [
  "All",
  "Digital Art",
  "Music",
  "Writing",
  "Podcasting",
  "Open Source",
  "Education",
  "Gaming",
  "Photography",
  "Film",
  "Cooking",
  "Tech",
  "Fitness",
];

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = allCreators.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      activeCategory === "All" || c.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="bg-[#fffdf0] min-h-[calc(100vh-80px)] border-t-4 border-brew-text py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-up">
          <div className="inline-block mb-6 px-5 py-2 border-2 border-brew-text bg-brew-yellow font-inter font-bold text-sm rounded-full shadow-[3px_3px_0px_0px_currentColor] -rotate-2">
            Directory
          </div>
          <h1 className="font-inter font-black text-5xl md:text-6xl text-brew-text mb-6 uppercase tracking-tight">
            Discover Creators
          </h1>
          <p className="font-inter font-bold text-lg text-brew-text/80 max-w-xl mx-auto">
            Find and support amazing creators doing incredible work.
          </p>
        </div>

        {/* Chunky Search Bar */}
        <div className="max-w-2xl mx-auto mb-12 animate-fade-up delay-100">
          <div className="relative group">
            <Search
              size={24}
              strokeWidth={3}
              className="absolute left-6 top-1/2 -translate-y-1/2 text-brew-text transition-transform group-focus-within:rotate-12"
            />
            <input
              type="text"
              placeholder="Search creators..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-16 pr-6 py-4 bg-white border-4 border-brew-text rounded-2xl text-lg font-inter font-bold text-brew-text placeholder:text-brew-text/40 focus:outline-none focus:shadow-[6px_6px_0px_0px_currentColor] focus:-translate-y-1 transition-all duration-200"
            />
          </div>
        </div>

        {/* Tactile Category Pills */}
        <div
          className="flex gap-4 overflow-x-auto pb-6 mb-12 snap-x scrollbar-hide animate-fade-up delay-200 px-2"
          style={{ scrollbarWidth: "none" }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-6 py-3 rounded-xl text-sm font-inter font-black uppercase tracking-wider transition-all duration-150 min-h-[48px] cursor-pointer border-2
            ${
              activeCategory === cat
                ? "bg-brew-text text-[#fffdf0] border-brew-text shadow-[4px_4px_0px_0px_#F5C518] translate-y-0"
                : "bg-white text-brew-text border-brew-text shadow-[4px_4px_0px_0px_currentColor] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_currentColor] hover:bg-brew-yellow-light active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_currentColor]"
            }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Creator Grid & Empty State */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 animate-fade-up bg-white border-4 border-dashed border-brew-text/30 rounded-[32px] max-w-3xl mx-auto">
            <div className="text-7xl mb-6 inline-block -rotate-12 drop-shadow-[4px_4px_0px_rgba(62,39,35,0.2)]">
              🫗
            </div>
            <h3 className="font-inter font-black text-3xl text-brew-text mb-3 uppercase tracking-tight">
              Nobody here
            </h3>
            <p className="font-inter font-bold text-lg text-brew-text/70">
              Try adjusting your search or category filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map((creator, i) => (
              <Link
                to={`/${creator.username}`}
                key={creator.username}
                className="no-underline animate-fade-up group block outline-none"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="bg-white border-2 border-brew-text rounded-3xl p-6 text-center shadow-[6px_6px_0px_0px_currentColor] transition-all duration-200 group-hover:-translate-y-2 group-hover:shadow-[8px_8px_0px_0px_currentColor] group-focus-visible:-translate-y-2 group-focus-visible:ring-4 group-focus-visible:ring-brew-yellow h-full flex flex-col">
                  <div className="w-20 h-20 mx-auto mb-5 rounded-full border-2 border-brew-text bg-brew-yellow shadow-[4px_4px_0px_0px_currentColor] flex items-center justify-center overflow-hidden">
                    <Avatar
                      name={creator.name}
                      size="lg"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="font-inter font-black text-xl text-brew-text mb-2">
                    {creator.name}
                  </h3>

                  <div className="mb-4">
                    <span className="inline-block border-2 border-brew-text bg-[#fffdf0] px-3 py-1 text-xs font-bold rounded-full shadow-[2px_2px_0px_0px_currentColor] uppercase tracking-wider">
                      {creator.category}
                    </span>
                  </div>

                  <p className="font-inter text-sm font-medium text-brew-text/80 leading-relaxed mb-6 flex-grow">
                    {creator.bio}
                  </p>

                  <div className="mt-auto border-t-2 border-brew-text pt-4 bg-brew-yellow-light/50 -mx-6 -mb-6 p-4 rounded-b-3xl">
                    <p className="font-inter text-xs font-black text-brew-text uppercase tracking-widest">
                      ☕ {creator.supporters.toLocaleString()} supporters
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Avatar from "../components/Avatar";
import Skeleton from "../components/Skeleton";
import { API_ORIGIN, getDiscoverCreators } from "../lib/api";
import { Search, Coffee } from "lucide-react";

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDiscoverCreators();
        if (!cancelled) setCreators(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load creators");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Build the category pill list from the categories that actually exist in the
  // fetched creators, with "All" always first.
  const categories = useMemo(() => {
    const unique = [
      ...new Set(creators.map((c) => c.creator_category).filter(Boolean)),
    ].sort();
    return ["All", ...unique];
  }, [creators]);

  const filtered = creators.filter((c) => {
    const term = search.toLowerCase();
    const matchSearch =
      (c.creator_name || "").toLowerCase().includes(term) ||
      (c.creator_username || "").toLowerCase().includes(term) ||
      (c.creator_category || "").toLowerCase().includes(term);
    const matchCategory =
      activeCategory === "All" || c.creator_category === activeCategory;
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
        {!loading && !error && categories.length > 1 && (
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
        )}

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border-2 border-brew-text rounded-3xl p-6 text-center shadow-[6px_6px_0px_0px_currentColor] h-full flex flex-col"
              >
                <Skeleton variant="circle" className="w-20 h-20 mx-auto mb-5" />
                <Skeleton className="h-6 w-2/3 mx-auto mb-3" />
                <Skeleton className="h-5 w-1/3 mx-auto mb-4 rounded-full" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mx-auto mb-6" />
                <div className="mt-auto pt-4">
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="text-center py-24 animate-fade-up bg-white border-4 border-dashed border-brew-text/30 rounded-[32px] max-w-3xl mx-auto">
            <div className="text-7xl mb-6 inline-block -rotate-12 drop-shadow-[4px_4px_0px_rgba(62,39,35,0.2)]">
              <img src="/icons/coffee-cup.png" className="w-16 h-full"></img>
            </div>
            <h3 className="font-inter font-black text-3xl text-brew-text mb-3 uppercase tracking-tight">
              Something spilled
            </h3>
            <p className="font-inter font-bold text-lg text-brew-text/70">
              We couldn't load creators right now. Please try again later.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          /* Empty State */
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
                to={`/${creator.creator_username}`}
                key={creator.creator_id}
                className="no-underline animate-fade-up group block outline-none"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="bg-white border-2 border-brew-text rounded-3xl p-6 text-center shadow-[6px_6px_0px_0px_currentColor] transition-all duration-200 group-hover:-translate-y-2 group-hover:shadow-[8px_8px_0px_0px_currentColor] group-focus-visible:-translate-y-2 group-focus-visible:ring-4 group-focus-visible:ring-brew-yellow h-full flex flex-col">
                  <div className="w-20 h-20 mx-auto mb-5 rounded-full border-2 border-brew-text bg-brew-yellow shadow-[4px_4px_0px_0px_currentColor] flex items-center justify-center overflow-hidden">
                    <Avatar
                      name={creator.creator_name}
                      src={
                        creator.creator_profile_picture
                          ? `${API_ORIGIN}${creator.creator_profile_picture}`
                          : ""
                      }
                      size="lg"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="font-inter font-black text-xl text-brew-text mb-2">
                    {creator.creator_name}
                  </h3>

                  {creator.creator_category && (
                    <div className="mb-4">
                      <span className="inline-block border-2 border-brew-text bg-[#fffdf0] px-3 py-1 text-xs font-bold rounded-full shadow-[2px_2px_0px_0px_currentColor] uppercase tracking-wider">
                        {creator.creator_category}
                      </span>
                    </div>
                  )}

                  <p className="font-inter text-sm font-medium text-brew-text/80 leading-relaxed mb-6 flex-grow">
                    {creator.creator_description}
                  </p>

                  <div className="mt-auto border-t-2 border-brew-text pt-4 bg-brew-yellow-light/50 -mx-6 -mb-6 p-4 rounded-b-3xl">
                    <p className="font-inter text-xs font-black text-brew-text uppercase tracking-widest inline-flex items-center gap-1.5">
                      <Coffee size={14} strokeWidth={3} />
                      {(
                        creator.total_supporters_cup || 0
                      ).toLocaleString()}{" "}
                      cups
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

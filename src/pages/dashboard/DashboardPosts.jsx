import { useEffect, useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Badge from "../../components/Badge";
import Toast from "../../components/Toast";
import Skeleton from "../../components/Skeleton";
import { FileText, Plus, Search, Loader2, Sparkles, Filter, MoreVertical, Eye, Edit2, Trash2, Crown, Globe, Lock, ArrowRight, Clock } from "lucide-react";
import { getCreatorPosts } from "../../lib/api";

export default function DashboardPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await getCreatorPosts();
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load posts:", err);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    }
    loadPosts();
  }, []);

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.preview.toLowerCase().includes(search.toLowerCase())
  );

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
        <div className="space-y-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-[28px]" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up text-brew-text">
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 text-brew-text">
        <div>
          <div className="inline-block mb-2 px-3 py-1 border-2 border-brew-text bg-brew-yellow font-inter font-black text-[10px] uppercase tracking-widest rounded-full shadow-[2px_2px_0px_0px_currentColor] -rotate-1">
            Content
          </div>
          <h1 className="font-space font-black text-3xl md:text-4xl uppercase tracking-tight mb-1 leading-none text-brew-text">
            Posts
          </h1>
          <p className="font-inter font-bold text-sm opacity-60">
            Share updates and exclusive content with your fans.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-8 py-3 border-2 border-brew-text bg-brew-text text-[#fffdf0] font-inter font-black text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px_#F5C518] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all rounded-xl w-full sm:w-auto active-haptic">
          <Plus size={16} strokeWidth={4} className="text-brew-yellow" />
          Create Post
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
        <div className="relative flex-grow group w-full">
          <Search size={18} strokeWidth={3} className="absolute left-4 top-1/2 -translate-y-1/2 text-brew-text/30 transition-transform group-focus-within:rotate-12" />
          <input type="text" placeholder="Search posts..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border-2 border-brew-text rounded-xl font-inter font-bold text-sm text-brew-text placeholder:text-brew-text/30 focus:outline-none focus:shadow-[3px_3px_0px_0px_currentColor] transition-all" />
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="py-24 text-center bg-white border-4 border-dashed border-brew-text/10 rounded-[48px] max-w-2xl mx-auto shadow-[12px_12px_0px_0px_rgba(0,0,0,0.03)]">
          <div className="w-20 h-20 bg-brew-yellow/10 border-2 border-dashed border-brew-yellow/40 rounded-[32px] flex items-center justify-center mx-auto mb-8 -rotate-6">
            <FileText size={40} className="text-brew-yellow" strokeWidth={2} />
          </div>
          <h3 className="font-space font-black text-3xl text-brew-text uppercase tracking-tight mb-4">Start sharing</h3>
          <p className="font-inter font-bold text-base text-brew-text/40 uppercase tracking-widest leading-relaxed mb-10 max-w-sm mx-auto">
            Share updates, behind-the-scenes content, or exclusive perks with your community!
          </p>
          <button className="inline-flex items-center gap-3 px-10 py-5 bg-brew-yellow border-4 border-brew-text rounded-[24px] font-space font-black text-base uppercase tracking-widest shadow-[8px_8px_0px_0px_currentColor] hover:translate-x-1 hover:translate-y-1 active:shadow-none transition-all active-haptic">
            <Plus size={20} strokeWidth={4} /> Write First Post
          </button>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="py-24 text-center bg-white border-4 border-dashed border-brew-text/10 rounded-[40px] text-brew-text/20">
          <p className="font-inter font-black text-lg uppercase tracking-widest mb-4">No matching posts</p>
          <button onClick={() => setSearch("")} className="text-brew-text font-black text-xs uppercase underline decoration-2 underline-offset-4 hover:bg-brew-yellow px-2 py-1 rounded transition-colors">Clear Search</button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white border-4 border-brew-text rounded-[28px] p-5 md:p-6 shadow-[6px_6px_0px_0px_currentColor] hover:-translate-y-1 transition-all active-haptic group">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-5 min-w-0">
                  <div className="w-16 h-16 rounded-2xl border-2 border-brew-text bg-brew-yellow-light flex items-center justify-center shrink-0 overflow-hidden shadow-[3px_3px_0px_0px_currentColor]">
                    {post.image ? <img src={post.image} className="w-full h-full object-cover" alt="" /> : <FileText size={24} className="text-brew-text/20" />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-space font-black text-lg md:text-xl text-brew-text truncate mb-1">{post.title}</h3>
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="flex items-center gap-1.5 font-inter font-black text-[9px] uppercase tracking-widest opacity-40">
                        <Clock size={12} /> {new Date(post.published_at).toLocaleDateString()}
                      </span>
                      {post.membersOnly ? (
                        <span className="bg-brew-text text-brew-yellow px-2 py-0.5 rounded border-2 border-brew-text font-inter font-black text-[8px] uppercase tracking-widest inline-flex items-center gap-1">
                          <Crown size={10} /> VIP Only
                        </span>
                      ) : (
                        <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded border-2 border-green-200 font-inter font-black text-[8px] uppercase tracking-widest inline-flex items-center gap-1">
                          <Globe size={10} /> Public
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="hidden sm:flex items-center justify-center w-10 h-10 border-2 border-brew-text bg-white rounded-xl shadow-[2px_2px_0px_0px_currentColor] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-none transition-all">
                    <Eye size={18} strokeWidth={3} />
                  </button>
                  <button className="flex items-center justify-center w-10 h-10 border-2 border-brew-text bg-white rounded-xl shadow-[2px_2px_0px_0px_currentColor] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-none transition-all">
                    <MoreVertical size={18} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

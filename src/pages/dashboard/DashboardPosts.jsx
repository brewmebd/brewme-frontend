import { useEffect, useState } from "react";
import Toast from "../../components/Toast";
import Skeleton from "../../components/Skeleton";
import { FileText, Plus, Search, Loader2, Sparkles, Eye, Edit2, Trash2, Crown, Globe, Lock, Clock, X, Image as ImageIcon, AlertTriangle } from "lucide-react";
import { getDashboardPosts, createPost, updatePost, deletePost, API_ORIGIN } from "../../lib/api";

// Normalize a post from any source (API or freshly created) into the shape this
// page renders. Image paths from the backend are relative (e.g. /uploads/...),
// so prefix them with the API origin; leave absolute URLs untouched.
function normalizePost(p) {
  const rawImage = p.image || null;
  const image = rawImage
    ? (rawImage.startsWith("http") ? rawImage : `${API_ORIGIN}${rawImage}`)
    : null;
  return {
    id: p.id,
    title: p.title || "Untitled",
    preview: p.preview || "",
    body: p.body || p.preview || "",
    image,
    membersOnly: p.membersOnly ?? (p.visibility === "members"),
    status: p.status || "published",
    published_at: p.published_at || p.created_at || new Date().toISOString(),
  };
}

export default function DashboardPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  // Editor modal (shared for create + edit).
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", preview: "", membersOnly: false });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);

  // View + delete-confirm modals.
  const [viewPost, setViewPost] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await getDashboardPosts();
        setPosts(Array.isArray(data) ? data.map(normalizePost) : []);
      } catch (err) {
        console.error("Failed to load posts:", err);
        setToast({ type: "error", message: "Couldn't load posts." });
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    }
    loadPosts();
  }, []);

  const resetForm = () => {
    setForm({ title: "", preview: "", membersOnly: false });
    setImageFile(null);
    setImagePreview(null);
    setOriginalImage(null);
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (post) => {
    setForm({ title: post.title, preview: post.body || post.preview || "", membersOnly: post.membersOnly });
    setImageFile(null);
    setImagePreview(post.image || null);
    setOriginalImage(post.image || null);
    setEditingId(post.id);
    setShowModal(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setShowModal(false);
    resetForm();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setToast({ type: "error", message: "Image must be under 5MB." });
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (status) => {
    if (submitting) return;
    if (!form.title.trim() || !form.preview.trim()) {
      setToast({ type: "error", message: "Title and content are required." });
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("preview", form.preview.trim());
      fd.append("membersOnly", String(form.membersOnly));
      fd.append("visibility", form.membersOnly ? "members" : "public");
      fd.append("status", status);
      if (imageFile) {
        fd.append("image", imageFile);
      } else if (editingId && !imagePreview && originalImage) {
        fd.append("removeImage", "true"); // existing image was cleared
      }

      if (editingId) {
        const updated = normalizePost(await updatePost(editingId, fd));
        setPosts(prev => prev.map(p => (p.id === editingId ? updated : p)));
        setToast({ type: "success", message: status === "draft" ? "Draft saved!" : "Post updated!" });
      } else {
        const created = normalizePost(await createPost(fd));
        setPosts(prev => [created, ...prev]);
        setToast({ type: "success", message: status === "draft" ? "Draft saved!" : "Post published!" });
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      setToast({ type: "error", message: err.message || "Something went wrong." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      await deletePost(deleteTarget.id);
      setPosts(prev => prev.filter(p => p.id !== deleteTarget.id));
      setToast({ type: "success", message: "Post deleted." });
      setDeleteTarget(null);
    } catch (err) {
      setToast({ type: "error", message: err.message || "Failed to delete post." });
    } finally {
      setDeleting(false);
    }
  };

  const filteredPosts = posts.filter(p =>
    (p.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.preview || "").toLowerCase().includes(search.toLowerCase())
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

  const iconBtn = "flex items-center justify-center w-10 h-10 border-2 border-brew-text bg-white rounded-xl shadow-[2px_2px_0px_0px_currentColor] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none transition-all";

  return (
    <>
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
        <button onClick={openCreate} className="flex items-center justify-center gap-2 px-8 py-3 border-2 border-brew-text bg-brew-text text-[#fffdf0] font-inter font-black text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px_#F5C518] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all rounded-xl w-full sm:w-auto active-haptic">
          <Plus size={16} strokeWidth={4} className="text-brew-yellow" />
          Create Post
        </button>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
        <div className="relative grow group w-full">
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
          <button onClick={openCreate} className="inline-flex items-center gap-3 px-10 py-5 bg-brew-yellow border-4 border-brew-text rounded-[24px] font-space font-black text-base uppercase tracking-widest shadow-[8px_8px_0px_0px_currentColor] hover:translate-x-1 hover:translate-y-1 active:shadow-none transition-all active-haptic">
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
            <div key={post.id} className="bg-white border-4 border-brew-text rounded-[28px] p-5 md:p-6 shadow-[6px_6px_0px_0px_currentColor] hover:-translate-y-1 transition-all group">
              <div className="flex items-center justify-between gap-6">
                <button onClick={() => setViewPost(post)} className="flex items-center gap-5 min-w-0 text-left flex-1">
                  <div className="w-16 h-16 rounded-2xl border-2 border-brew-text bg-brew-yellow-light flex items-center justify-center shrink-0 overflow-hidden shadow-[3px_3px_0px_0px_currentColor]">
                    {post.image ? <img src={post.image} className="w-full h-full object-cover" alt="" /> : <FileText size={24} className="text-brew-text/20" />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-space font-black text-lg md:text-xl text-brew-text truncate mb-1">{post.title}</h3>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="flex items-center gap-1.5 font-inter font-black text-[9px] uppercase tracking-widest opacity-40">
                        <Clock size={12} /> {new Date(post.published_at).toLocaleDateString()}
                      </span>
                      {post.status === "draft" && (
                        <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded border-2 border-amber-300 font-inter font-black text-[8px] uppercase tracking-widest inline-flex items-center gap-1">
                          Draft
                        </span>
                      )}
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
                </button>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setViewPost(post)} title="View" className={`hidden sm:flex ${iconBtn}`}>
                    <Eye size={18} strokeWidth={3} />
                  </button>
                  <button onClick={() => openEdit(post)} title="Edit" className={iconBtn}>
                    <Edit2 size={16} strokeWidth={3} />
                  </button>
                  <button onClick={() => setDeleteTarget(post)} title="Delete" className={`${iconBtn} hover:bg-red-50 hover:text-red-600`}>
                    <Trash2 size={16} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

      {/* Editor Modal (create + edit) */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-brew-text/60 backdrop-blur-xl animate-fade-in" onClick={closeModal} />
          <div className="relative w-full max-w-lg bg-white border-4 border-brew-text rounded-[32px] p-8 shadow-[12px_12px_0px_0px_currentColor] animate-slide-in-up text-brew-text max-h-[90vh] overflow-y-auto">
            <button onClick={closeModal} className="absolute top-6 right-6 p-2 hover:bg-brew-yellow-light rounded-full transition-colors"><X size={20} strokeWidth={3} /></button>
            <h3 className="font-space font-black text-2xl uppercase tracking-tight mb-6 flex items-center gap-3 leading-none">
              {editingId ? "Edit Post" : "New Post"} <Sparkles size={22} className="text-brew-yellow" />
            </h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit("published"); }} className="space-y-6">
              <div>
                <label className="block font-inter font-black text-xs uppercase tracking-widest mb-2 opacity-60">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Give your post a headline..."
                  className="w-full px-4 py-3.5 bg-[#fffdf0] border-2 border-brew-text rounded-2xl font-space font-black text-lg placeholder:text-brew-text/30 placeholder:font-inter placeholder:font-bold placeholder:text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] transition-all"
                />
              </div>

              <div>
                <label className="block font-inter font-black text-xs uppercase tracking-widest mb-2 opacity-60">Content</label>
                <textarea
                  value={form.preview}
                  onChange={(e) => setForm({ ...form, preview: e.target.value })}
                  rows={4}
                  placeholder="Share your update, story, or exclusive perk..."
                  className="w-full px-4 py-3.5 bg-[#fffdf0] border-2 border-brew-text rounded-2xl font-inter font-bold text-sm placeholder:text-brew-text/30 focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] transition-all resize-none"
                />
              </div>

              <div>
                <label className="block font-inter font-black text-xs uppercase tracking-widest mb-2 opacity-60">Cover Image <span className="opacity-40">(optional)</span></label>
                {imagePreview ? (
                  <div className="relative border-2 border-brew-text rounded-2xl overflow-hidden shadow-[3px_3px_0px_0px_currentColor]">
                    <img src={imagePreview} alt="Preview" className="w-full h-44 object-cover" />
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                      className="absolute top-2 right-2 p-1.5 bg-white border-2 border-brew-text rounded-full shadow-[2px_2px_0px_0px_currentColor] hover:bg-brew-yellow-light transition-colors"
                      aria-label="Remove image"
                    >
                      <X size={14} strokeWidth={3} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 w-full py-8 bg-[#fffdf0] border-2 border-dashed border-brew-text/40 rounded-2xl cursor-pointer hover:border-brew-text hover:bg-brew-yellow-light transition-all">
                    <ImageIcon size={26} strokeWidth={2.5} className="text-brew-text/40" />
                    <span className="font-inter font-black text-[11px] uppercase tracking-widest text-brew-text/50">Click to upload</span>
                    <span className="font-inter font-bold text-[10px] text-brew-text/30">JPG, PNG, GIF or WebP · max 5MB</span>
                    <input type="file" accept="image/png,image/jpeg,image/gif,image/webp" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>

              <div>
                <label className="block font-inter font-black text-xs uppercase tracking-widest mb-2 opacity-60">Visibility</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setForm({ ...form, membersOnly: false })} className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-brew-text rounded-xl font-inter font-black text-xs uppercase tracking-widest transition-all ${!form.membersOnly ? "bg-brew-yellow shadow-[3px_3px_0px_0px_currentColor] -translate-x-0.5 -translate-y-0.5" : "bg-white hover:bg-brew-yellow-light"}`}>
                    <Globe size={14} strokeWidth={3} /> Public
                  </button>
                  <button type="button" onClick={() => setForm({ ...form, membersOnly: true })} className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-brew-text rounded-xl font-inter font-black text-xs uppercase tracking-widest transition-all ${form.membersOnly ? "bg-brew-yellow shadow-[3px_3px_0px_0px_currentColor] -translate-x-0.5 -translate-y-0.5" : "bg-white hover:bg-brew-yellow-light"}`}>
                    <Crown size={14} strokeWidth={3} /> VIP Only
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button type="button" onClick={closeModal} disabled={submitting} className="flex-1 min-w-[90px] px-4 py-4 border-2 border-brew-text bg-white font-inter font-black text-xs uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50">Cancel</button>
                <button type="button" onClick={() => handleSubmit("draft")} disabled={submitting} className="flex-1 min-w-[110px] px-4 py-4 border-2 border-brew-text bg-brew-yellow-light font-inter font-black text-xs uppercase tracking-widest rounded-xl hover:bg-brew-yellow transition-colors disabled:opacity-50">Save Draft</button>
                <button type="submit" disabled={submitting} className="flex-1 min-w-[110px] px-4 py-4 border-2 border-brew-text bg-brew-text text-white font-inter font-black text-xs uppercase tracking-widest rounded-xl shadow-[4px_4px_0px_0px_#F5C518] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {submitting ? <Loader2 size={14} className="animate-spin text-brew-yellow" /> : <Plus size={14} strokeWidth={4} className="text-brew-yellow" />}
                  {submitting ? "Saving..." : (editingId ? "Save Changes" : "Publish")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-brew-text/60 backdrop-blur-xl animate-fade-in" onClick={() => setViewPost(null)} />
          <div className="relative w-full max-w-lg bg-white border-4 border-brew-text rounded-[32px] shadow-[12px_12px_0px_0px_currentColor] animate-slide-in-up text-brew-text max-h-[90vh] overflow-y-auto">
            <button onClick={() => setViewPost(null)} className="absolute top-4 right-4 z-10 p-2 bg-white border-2 border-brew-text rounded-full shadow-[2px_2px_0px_0px_currentColor] hover:bg-brew-yellow-light transition-colors"><X size={18} strokeWidth={3} /></button>
            {viewPost.image && (
              <img src={viewPost.image} alt="" className="w-full h-56 object-cover border-b-4 border-brew-text rounded-t-[28px]" />
            )}
            <div className="p-8">
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className="flex items-center gap-1.5 font-inter font-black text-[10px] uppercase tracking-widest opacity-40">
                  <Clock size={12} /> {new Date(viewPost.published_at).toLocaleDateString()}
                </span>
                {viewPost.status === "draft" && (
                  <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded border-2 border-amber-300 font-inter font-black text-[8px] uppercase tracking-widest">Draft</span>
                )}
                {viewPost.membersOnly ? (
                  <span className="bg-brew-text text-brew-yellow px-2 py-0.5 rounded border-2 border-brew-text font-inter font-black text-[8px] uppercase tracking-widest inline-flex items-center gap-1"><Lock size={10} /> VIP Only</span>
                ) : (
                  <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded border-2 border-green-200 font-inter font-black text-[8px] uppercase tracking-widest inline-flex items-center gap-1"><Globe size={10} /> Public</span>
                )}
              </div>
              <h2 className="font-space font-black text-2xl md:text-3xl uppercase tracking-tight leading-tight mb-4">{viewPost.title}</h2>
              <p className="font-inter font-bold text-[15px] text-brew-text/80 leading-relaxed whitespace-pre-wrap">{viewPost.body}</p>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => { const p = viewPost; setViewPost(null); openEdit(p); }} className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-brew-text bg-brew-yellow font-inter font-black text-[10px] uppercase tracking-widest rounded-xl shadow-[3px_3px_0px_0px_currentColor] hover:-translate-y-0.5 transition-all">
                  <Edit2 size={13} strokeWidth={3} /> Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-brew-text/60 backdrop-blur-xl animate-fade-in" onClick={() => !deleting && setDeleteTarget(null)} />
          <div className="relative w-full max-w-sm bg-white border-4 border-brew-text rounded-[32px] p-8 shadow-[12px_12px_0px_0px_currentColor] animate-slide-in-up text-brew-text text-center">
            <div className="w-16 h-16 bg-red-50 border-2 border-red-300 rounded-2xl flex items-center justify-center mx-auto mb-5 -rotate-6">
              <AlertTriangle size={30} className="text-red-500" strokeWidth={2.5} />
            </div>
            <h3 className="font-space font-black text-xl uppercase tracking-tight mb-2 leading-none">Delete post?</h3>
            <p className="font-inter font-bold text-sm text-brew-text/50 mb-7 leading-relaxed">
              "{deleteTarget.title}" will be permanently removed. This can't be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} disabled={deleting} className="flex-1 px-5 py-3.5 border-2 border-brew-text bg-white font-inter font-black text-xs uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 px-5 py-3.5 border-2 border-brew-text bg-red-500 text-white font-inter font-black text-xs uppercase tracking-widest rounded-xl shadow-[4px_4px_0px_0px_#7f1d1d] hover:translate-x-0.5 hover:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} strokeWidth={3} />}
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}

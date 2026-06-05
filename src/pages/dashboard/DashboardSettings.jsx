import { useState, useEffect } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Avatar from "../../components/Avatar";
import Toast from "../../components/Toast";
import { Camera, Link2, Bell, CreditCard, Save, Check, X, Loader2, Image as ImageIcon, Target } from "lucide-react";
import { getProfile, API_ORIGIN } from "../../lib/api";

export default function DashboardSettings() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: "",
    bio: "",
    slug: "",
    email: "",
    image: "",
    cover_image: "",
    category: "Digital Art",
    goal_title: "Improving equipment for higher quality creative work.",
    goal_amount: "500",
  });

  const [notifications, setNotifications] = useState({
    newSupporter: true,
    newMessage: true,
    weeklyReport: false,
    marketingEmails: false,
  });

  const categories = [
    "Digital Art", "Music", "Writing", "Podcasting", "Open Source", 
    "Education", "Gaming", "Photography", "Film", "Cooking", "Tech", "Fitness"
  ];

  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getProfile();
        if (data.status && data.profile_info) {
          const info = data.profile_info;
          setForm({
            name: info.creator_name || "",
            bio: info.creator_bio || "",
            slug: info.creator_url || "",
            email: info.creator_email || "",
            image: info.creator_image ? `${API_ORIGIN}${info.creator_image}` : "",
            cover_image: info.cover_image ? `${API_ORIGIN}${info.cover_image}` : "",
            category: info.creator_category || "Digital Art",
            goal_title: info.goal_title || "Improving equipment for higher quality creative work.",
            goal_amount: info.goal_amount || "500",
          });
        }
      } catch (err) {
        setError("Failed to load profile settings.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleToggle = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-brew-text">
        <Loader2 size={48} className="text-brew-yellow animate-spin" strokeWidth={3} />
        <p className="font-inter font-black uppercase tracking-widest text-sm">Loading Settings...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-up text-brew-text max-w-5xl mx-auto pb-20">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-block mb-2 px-3 py-1 border-2 border-brew-text bg-brew-yellow font-inter font-black text-[10px] uppercase tracking-widest rounded-full shadow-[2px_2px_0px_0px_currentColor] -rotate-1">
            Account
          </div>
          <h1 className="font-inter font-black text-3xl md:text-4xl uppercase tracking-tight mb-1">
            Settings
          </h1>
          <p className="font-inter font-bold text-sm opacity-60">
            Customize your profile and manage your preferences.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 px-8 py-3 border-2 border-brew-text bg-brew-text text-white font-inter font-black text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px_#F5C518] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all rounded-xl w-full sm:w-auto"
        >
          <Save size={16} strokeWidth={3} className="text-brew-yellow" />
          Save Changes
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-4 border-brew-text p-4 rounded-2xl shadow-[6px_6px_0px_0px_currentColor] flex items-center gap-3 mb-8">
          <X className="text-red-500" size={24} strokeWidth={3} />
          <p className="font-inter font-bold text-brew-text">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Profile Visuals & Info */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Visuals Card (Cover & Avatar) */}
          <div className="bg-white border-4 border-brew-text rounded-[32px] overflow-hidden shadow-[8px_8px_0px_0px_currentColor]">
            {/* Cover Preview */}
            <div className="relative h-44 bg-brew-yellow border-b-4 border-brew-text group">
              {form.cover_image ? (
                <img src={form.cover_image} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(#3E2723 2px, transparent 2px)', backgroundSize: '24px 24px' }} />
              )}
              <div className="absolute inset-0 bg-brew-text/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <button className="px-4 py-2 bg-white border-2 border-brew-text rounded-xl font-inter font-black text-[10px] uppercase tracking-widest shadow-[3px_3px_0px_0px_currentColor] hover:-translate-y-0.5 transition-all">
                  <ImageIcon size={14} className="inline mr-2" /> Change Cover
                </button>
              </div>
            </div>
            
            {/* Avatar Section */}
            <div className="p-8 -mt-20 relative flex flex-col md:flex-row items-end gap-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-brew-text bg-white shadow-[4px_4px_0px_0px_currentColor] overflow-hidden flex items-center justify-center ring-8 ring-white">
                  <Avatar name={form.name} src={form.image} size="xl" className="w-full h-full" />
                </div>
                <button className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-brew-yellow border-2 border-brew-text flex items-center justify-center shadow-[2px_2px_0px_0px_currentColor] hover:scale-110 transition-transform">
                  <Camera size={18} strokeWidth={3} />
                </button>
              </div>
              <div className="mb-4">
                <h3 className="font-inter font-black text-xl uppercase tracking-tight mb-1 leading-none">Visual Identity</h3>
                <p className="font-inter font-bold text-xs opacity-40 uppercase tracking-widest leading-none">Your avatar and cover art.</p>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-white border-4 border-brew-text rounded-[32px] p-8 shadow-[8px_8px_0px_0px_currentColor] space-y-8">
            <h3 className="font-inter font-black text-lg uppercase tracking-widest border-b-4 border-brew-text pb-2 inline-block">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block font-inter font-black text-[10px] uppercase tracking-[0.2em] mb-3 opacity-50">Display Name</label>
                <input name="name" type="text" value={form.name} onChange={handleChange} className="w-full px-5 py-4 bg-[#fffdf0] border-2 border-brew-text rounded-2xl font-inter font-bold text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] transition-all" />
              </div>
              <div>
                <label className="block font-inter font-black text-[10px] uppercase tracking-[0.2em] mb-3 opacity-50">Creative Category</label>
                <div className="relative">
                  <select name="category" value={form.category} onChange={handleChange} className="w-full appearance-none px-5 py-4 bg-[#fffdf0] border-2 border-brew-text rounded-2xl font-inter font-black text-[11px] uppercase tracking-widest focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] cursor-pointer">
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none font-black text-[10px]">↓</div>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-inter font-black text-[10px] uppercase tracking-[0.2em] mb-3 opacity-50">Bio</label>
              <textarea name="bio" value={form.bio} onChange={handleChange} rows={4} className="w-full px-5 py-4 bg-[#fffdf0] border-2 border-brew-text rounded-2xl font-inter font-bold text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] transition-all resize-none" />
            </div>

            <div>
              <label className="block font-inter font-black text-[10px] uppercase tracking-[0.2em] mb-3 opacity-50">Personal URL</label>
              <div className="flex items-stretch border-2 border-brew-text rounded-2xl overflow-hidden bg-[#fffdf0] focus-within:shadow-[4px_4px_0px_0px_currentColor] transition-all">
                <span className="flex items-center px-4 py-3 bg-brew-yellow border-r-2 border-brew-text font-inter font-black text-xs uppercase tracking-widest">brewme.com/</span>
                <input name="slug" value={form.slug} onChange={handleChange} className="flex-1 min-w-0 px-4 py-3 bg-transparent font-inter font-black text-sm outline-none" />
              </div>
            </div>
          </div>

          {/* Funding Goal Card */}
          <div className="bg-white border-4 border-brew-text rounded-[32px] p-8 shadow-[8px_8px_0px_0px_currentColor] space-y-6">
            <h3 className="font-inter font-black text-lg uppercase tracking-widest border-b-4 border-brew-text pb-2 inline-block mb-4">Funding Goal</h3>
            <p className="font-inter font-bold text-[10px] text-brew-text/40 uppercase tracking-widest leading-none mb-4">Set a target for your community to rally behind.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block font-inter font-black text-[10px] uppercase tracking-[0.2em] mb-3 opacity-50">Goal Title</label>
                <input name="goal_title" type="text" value={form.goal_title} onChange={handleChange} placeholder="e.g. New Camera Lens" className="w-full px-5 py-4 bg-[#fffdf0] border-2 border-brew-text rounded-2xl font-inter font-bold text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] transition-all" />
              </div>
              <div>
                <label className="block font-inter font-black text-[10px] uppercase tracking-[0.2em] mb-3 opacity-50">Target Amount ($)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-inter font-black text-lg">$</span>
                  <input name="goal_amount" type="number" value={form.goal_amount} onChange={handleChange} className="w-full pl-10 pr-4 py-4 bg-[#fffdf0] border-2 border-brew-text rounded-2xl font-inter font-black text-xl focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] transition-all" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Payouts & Preferences */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Payouts Card */}
          <div className="bg-white border-4 border-brew-text rounded-[32px] p-6 shadow-[6px_6px_0px_0px_currentColor]">
            <h3 className="font-inter font-black text-xs uppercase tracking-[0.3em] mb-6 opacity-40 flex items-center gap-2 leading-none"><CreditCard size={14} /> Payouts</h3>
            <div className="bg-blue-50 border-2 border-brew-text rounded-2xl p-5 shadow-[3px_3px_0px_0px_currentColor]">
              <p className="font-inter font-black text-xs uppercase tracking-widest mb-1 leading-none">Stripe Connected</p>
              <p className="font-inter font-bold text-[10px] opacity-40 uppercase tracking-[0.2em] mb-4">•••• 4242</p>
              <button className="w-full py-3 bg-brew-text text-white border-2 border-brew-text rounded-xl font-inter font-black text-[10px] uppercase tracking-widest shadow-[2px_2px_0px_0px_#F5C518] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">Manage Stripe</button>
            </div>
          </div>

          {/* Preferences Card */}
          <div className="bg-white border-4 border-brew-text rounded-[32px] p-6 shadow-[6px_6px_0px_0px_currentColor] space-y-6">
            <h3 className="font-inter font-black text-xs uppercase tracking-[0.3em] mb-2 opacity-40 flex items-center gap-2 leading-none"><Bell size={14} /> Notifications</h3>
            
            {["newSupporter", "newMessage", "weeklyReport"].map((key) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <span className="font-inter font-black text-[10px] uppercase tracking-widest opacity-70 leading-none">{key.replace(/([A-Z])/g, ' $1')}</span>
                <button
                  onClick={() => handleToggle(key)}
                  className={`relative w-12 h-7 rounded-full border-2 border-brew-text transition-colors duration-200 cursor-pointer shadow-[2px_2px_0px_0px_currentColor]
                    ${notifications[key] ? "bg-brew-yellow" : "bg-[#fffdf0]"}`}
                >
                  <div className={`absolute top-0.5 bottom-0.5 w-5 border-2 border-brew-text rounded-full bg-white transition-transform duration-200 ${notifications[key] ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>
            ))}
          </div>

        </div>
      </div>

      {showToast && (
        <Toast
          message="Settings saved successfully!"
          type="success"
          onClose={() => setShowToast(null)}
        />
      )}
    </div>
  );
}

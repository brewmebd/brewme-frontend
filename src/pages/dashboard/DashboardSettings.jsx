import { useState, useEffect, useRef } from "react";
import Avatar from "../../components/Avatar";
import Toast from "../../components/Toast";
import {
  Camera,
  Bell,
  CreditCard,
  Save,
  X,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import {
  getDashboardSettings,
  updateDashboardProfile,
  updateDashboardAvatar,
  updateDashboardNotifications,
  updateDashboardGoal,
  createStripeConnectLink,
  requestEmailChange,
  verifyEmailChange,
  API_ORIGIN,
} from "../../lib/api";
import ImageCropper from "../../components/ImageCropper";

const defaultForm = {
  name: "",
  bio: "",
  slug: "",
  email: "",
  image: "",
  cover_image: "",
  category: "Digital Art",
  goal_title: "Improving equipment for higher quality creative work.",
  goal_amount: "500",
};

const defaultNotifications = {
  newSupporter: true,
  newMessage: true,
  weeklyReport: false,
  marketingEmails: false,
};

const defaultStripe = {
  is_connected: false,
  card_last4: "",
};

export default function DashboardSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [notifications, setNotifications] = useState(defaultNotifications);
  const [stripe, setStripe] = useState(defaultStripe);
  const [socialLinks, setSocialLinks] = useState([]);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [originalEmail, setOriginalEmail] = useState("");
  const [emailChangeStatus, setEmailChangeStatus] = useState("idle");
  const [emailChangeCode, setEmailChangeCode] = useState("");
  const avatarInputRef = useRef(null);

  const categories = [
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

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getDashboardSettings();
        const profile = data.profile || {};
        const goal = data.goal || {};

        const email = profile.creator_email || "";
        
        setForm({
          name: profile.creator_name || "",
          bio: profile.creator_bio || "",
          slug: profile.creator_url || "",
          email: email,
          image: profile.creator_image
            ? `${API_ORIGIN}${profile.creator_image}`
            : "",
          cover_image: "",
          category: profile.creator_category || "Digital Art",
          goal_title: goal.goal_title || defaultForm.goal_title,
          goal_amount: goal.goal_amount
            ? String(goal.goal_amount)
            : defaultForm.goal_amount,
        });
        setOriginalEmail(email);

        setNotifications({
          newSupporter: data.notifications?.new_supporter ?? true,
          newMessage: data.notifications?.new_message ?? true,
          weeklyReport: data.notifications?.weekly_report ?? false,
          marketingEmails: data.notifications?.marketing_emails ?? false,
        });

        setStripe({
          is_connected: data.stripe?.is_connected ?? false,
          card_last4: data.stripe?.card_last4 ?? "",
        });
        setSocialLinks(data.social_links || []);
      } catch (err) {
        setError(err.message || "Failed to load profile settings.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleToggle = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const openAvatarPicker = () => {
    avatarInputRef.current?.click();
  };

  const handleConnectStripe = async () => {
    if (stripeLoading) return;

    setStripeLoading(true);
    try {
      const result = await createStripeConnectLink();
      if (!result?.url) {
        throw new Error("Stripe did not return an onboarding link.");
      }
      window.location.assign(result.url);
    } catch (err) {
      setError(err.message || "Failed to open Stripe onboarding.");
      setToast({
        type: "error",
        message: err.message || "Failed to open Stripe onboarding.",
      });
    } finally {
      setStripeLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setToast({ type: "error", message: "Avatar image must be under 2MB" });
      e.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setCropImageSrc(previewUrl);
    e.target.value = ""; // Reset to allow selecting the same file again
  };

  const handleCropComplete = async (croppedBlob) => {
    setCropImageSrc(null); // Close cropper
    
    // Create a File object from the Blob
    const file = new File([croppedBlob], "avatar.jpg", { type: "image/jpeg" });
    const previewUrl = URL.createObjectURL(file);
    
    setForm((current) => ({ ...current, image: previewUrl }));

    try {
      const result = await updateDashboardAvatar(file);
      if (result?.avatar_url) {
        setForm((current) => ({
          ...current,
          image: result.avatar_url.startsWith("/")
            ? `${API_ORIGIN}${result.avatar_url}`
            : result.avatar_url,
        }));
      }
      setToast({ type: "success", message: "Avatar updated successfully!" });
    } catch (err) {
      setError(err.message || "Failed to upload avatar.");
      setToast({
        type: "error",
        message: err.message || "Failed to upload avatar.",
      });
      setForm((current) => ({
        ...current,
        image:
          current.image && current.image.startsWith("blob:")
            ? ""
            : current.image,
      }));
    }
  };

  const handleRequestEmailChange = async () => {
    if (form.email === originalEmail) return;
    setEmailChangeStatus("requesting");
    setError(null);
    try {
      await requestEmailChange(form.email);
      setToast({ type: "success", message: "Verification code sent to your new email." });
      setEmailChangeStatus("code-sent");
    } catch (err) {
      setError(err.message || "Failed to request email change.");
      setToast({ type: "error", message: err.message || "Failed to request email change." });
      setEmailChangeStatus("idle");
    }
  };

  const handleVerifyEmailChange = async () => {
    if (!emailChangeCode.trim()) return;
    setEmailChangeStatus("verifying");
    setError(null);
    try {
      const result = await verifyEmailChange(emailChangeCode);
      setOriginalEmail(result.new_email);
      setForm((current) => ({ ...current, email: result.new_email }));
      setToast({ type: "success", message: "Email successfully updated!" });
      setEmailChangeStatus("idle");
      setEmailChangeCode("");
    } catch (err) {
      setError(err.message || "Failed to verify email change.");
      setToast({ type: "error", message: err.message || "Failed to verify email change." });
      setEmailChangeStatus("code-sent");
    }
  };

  const handleSave = async () => {
    if (saving) return;

    setSaving(true);
    setError(null);

    try {
      await Promise.all([
        updateDashboardProfile({
          name: form.name,
          bio: form.bio,
          email: form.email,
          category: form.category,
          social_links: socialLinks,
        }),
        updateDashboardNotifications({
          new_supporter: notifications.newSupporter,
          new_message: notifications.newMessage,
          weekly_report: notifications.weeklyReport,
          marketing_emails: notifications.marketingEmails,
        }),
        updateDashboardGoal({
          goal_title: form.goal_title,
          goal_amount: Number(form.goal_amount),
        }),
      ]);
      setToast({ type: "success", message: "Settings saved successfully!" });
    } catch (err) {
      setError(err.message || "Failed to save settings.");
      setToast({
        type: "error",
        message: err.message || "Failed to save settings.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-brew-text">
        <Loader2
          size={48}
          className="text-brew-yellow animate-spin"
          strokeWidth={3}
        />
        <p className="font-inter font-black uppercase tracking-widest text-sm">
          Loading Settings...
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-up text-brew-text max-w-5xl mx-auto pb-20">
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
          disabled={saving}
          className="flex items-center justify-center gap-2 px-8 py-3 border-2 border-brew-text bg-brew-text text-white font-inter font-black text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px_#F5C518] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all rounded-xl w-full sm:w-auto disabled:opacity-60"
        >
          {saving ? (
            <Loader2
              size={16}
              strokeWidth={3}
              className="text-brew-yellow animate-spin"
            />
          ) : (
            <Save size={16} strokeWidth={3} className="text-brew-yellow" />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-4 border-brew-text p-4 rounded-2xl shadow-[6px_6px_0px_0px_currentColor] flex items-center gap-3 mb-8">
          <X className="text-red-500" size={24} strokeWidth={3} />
          <p className="font-inter font-bold text-brew-text">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white border-4 border-brew-text rounded-[32px] overflow-hidden shadow-[8px_8px_0px_0px_currentColor]">
            <div className="relative h-44 bg-brew-yellow border-b-4 border-brew-text group">
              {form.cover_image ? (
                <img
                  src={form.cover_image}
                  className="w-full h-full object-cover"
                  alt=""
                />
              ) : (
                <div
                  className="w-full h-full opacity-10"
                  style={{
                    backgroundImage:
                      "radial-gradient(#3E2723 2px, transparent 2px)",
                    backgroundSize: "24px 24px",
                  }}
                />
              )}
              <div className="absolute inset-0 bg-brew-text/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <button className="px-4 py-2 bg-white border-2 border-brew-text rounded-xl font-inter font-black text-[10px] uppercase tracking-widest shadow-[3px_3px_0px_0px_currentColor] hover:-translate-y-0.5 transition-all">
                  <ImageIcon size={14} className="inline mr-2" /> Change Cover
                </button>
              </div>
            </div>

            <div className="p-8 -mt-20 relative flex flex-col md:flex-row items-end gap-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-brew-text bg-white shadow-[4px_4px_0px_0px_currentColor] overflow-hidden flex items-center justify-center ring-8 ring-white">
                  <Avatar
                    name={form.name}
                    src={form.image}
                    size="xl"
                    className="w-full h-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={openAvatarPicker}
                  className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-brew-yellow border-2 border-brew-text flex items-center justify-center shadow-[2px_2px_0px_0px_currentColor] hover:scale-110 transition-transform"
                >
                  <Camera size={18} strokeWidth={3} />
                </button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/gif"
                  className="sr-only"
                  onChange={handleAvatarChange}
                />
              </div>
              <div className="mb-4">
                <h3 className="font-inter font-black text-xl uppercase tracking-tight mb-1 leading-none">
                  {form.name || "Visual Identity"}
                </h3>
                <p className="font-inter font-bold text-xs opacity-40 uppercase tracking-widest leading-none">
                  {form.slug ? `brewme.com/${form.slug}` : "Your avatar and cover art."}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border-4 border-brew-text rounded-[32px] p-8 shadow-[8px_8px_0px_0px_currentColor] space-y-8">
            <h3 className="font-inter font-black text-lg uppercase tracking-widest border-b-4 border-brew-text pb-2 inline-block">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block font-inter font-black text-[10px] uppercase tracking-[0.2em] mb-3 opacity-50">
                  Display Name
                </label>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-[#fffdf0] border-2 border-brew-text rounded-2xl font-inter font-bold text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] transition-all"
                />
              </div>
              <div>
                <label className="block font-inter font-black text-[10px] uppercase tracking-[0.2em] mb-3 opacity-50">
                  Creative Category
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full appearance-none px-5 py-4 bg-[#fffdf0] border-2 border-brew-text rounded-2xl font-inter font-black text-[11px] uppercase tracking-widest focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none font-black text-[10px]">
                    ↓
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-inter font-black text-[10px] uppercase tracking-[0.2em] mb-3 opacity-50">
                Bio
              </label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-5 py-4 bg-[#fffdf0] border-2 border-brew-text rounded-2xl font-inter font-bold text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] transition-all resize-none"
              />
            </div>

            <div>
              <label className="block font-inter font-black text-[10px] uppercase tracking-[0.2em] mb-3 opacity-50">
                Personal URL
              </label>
              <div className="flex items-stretch border-2 border-brew-text rounded-2xl overflow-hidden bg-[#fffdf0]">
                <span className="flex items-center px-4 py-3 bg-brew-yellow border-r-2 border-brew-text font-inter font-black text-xs uppercase tracking-widest">
                  brewme.com/
                </span>
                <div className="flex-1 min-w-0 px-4 py-3 bg-transparent font-inter font-black text-sm opacity-60 truncate">
                  {form.slug || "your-url"}
                </div>
              </div>
              <p className="mt-2 text-[10px] uppercase tracking-[0.2em] font-inter font-bold text-brew-text/35">
                This URL is fixed for now.
              </p>
            </div>

            <div>
              <label className="block font-inter font-black text-[10px] uppercase tracking-[0.2em] mb-3 opacity-50">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={(e) => {
                  handleChange(e);
                  if (emailChangeStatus !== "idle") setEmailChangeStatus("idle");
                }}
                disabled={emailChangeStatus === "requesting" || emailChangeStatus === "verifying" || emailChangeStatus === "code-sent"}
                className="w-full px-5 py-4 bg-[#fffdf0] border-2 border-brew-text rounded-2xl font-inter font-bold text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] transition-all disabled:opacity-60"
              />
              {form.email !== originalEmail && emailChangeStatus === "idle" && (
                <button
                  type="button"
                  onClick={handleRequestEmailChange}
                  className="mt-4 w-full sm:w-auto px-6 py-3 bg-brew-yellow border-2 border-brew-text rounded-xl font-inter font-black text-[11px] uppercase tracking-widest shadow-[3px_3px_0px_0px_currentColor] hover:-translate-y-px transition-all"
                >
                  Verify New Email
                </button>
              )}
              {emailChangeStatus === "requesting" && (
                <p className="mt-3 text-[10px] font-inter font-black uppercase tracking-widest text-brew-text/60">
                  <Loader2 size={12} className="inline animate-spin mr-1" /> Sending code...
                </p>
              )}
              {emailChangeStatus === "code-sent" && (
                <div className="mt-4 p-5 border-2 border-brew-text bg-green-50 rounded-2xl shadow-[4px_4px_0px_0px_currentColor]">
                  <p className="font-inter font-bold text-[10px] uppercase tracking-widest mb-3 text-brew-text/80">
                    Enter the code sent to {form.email}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="6-char code"
                      value={emailChangeCode}
                      onChange={(e) => setEmailChangeCode(e.target.value)}
                      className="flex-1 px-4 py-3 bg-white border-2 border-brew-text rounded-xl font-inter font-black text-sm text-center tracking-[0.2em] uppercase focus:outline-none focus:shadow-[2px_2px_0px_0px_currentColor] transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyEmailChange}
                      className="px-6 py-3 bg-brew-text text-white border-2 border-brew-text rounded-xl font-inter font-black text-[11px] uppercase tracking-widest shadow-[3px_3px_0px_0px_#F5C518] hover:-translate-y-px active:translate-y-[2px] transition-all"
                    >
                      Confirm
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEmailChangeStatus("idle");
                      setForm((current) => ({ ...current, email: originalEmail }));
                    }}
                    className="mt-3 text-[9px] font-inter font-bold uppercase tracking-widest text-brew-text/50 hover:text-brew-text transition-colors"
                  >
                    Cancel email change
                  </button>
                </div>
              )}
              {emailChangeStatus === "verifying" && (
                <p className="mt-3 text-[10px] font-inter font-black uppercase tracking-widest text-brew-text/60">
                  <Loader2 size={12} className="inline animate-spin mr-1" /> Verifying code...
                </p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block font-inter font-black text-[10px] uppercase tracking-[0.2em] opacity-50">
                  Social Links
                </label>
                <button
                  type="button"
                  onClick={() => setSocialLinks(prev => [...prev, ""])}
                  className="px-3 py-1 border-2 border-brew-text bg-brew-yellow font-inter font-black text-[9px] uppercase tracking-widest rounded-lg shadow-[2px_2px_0px_0px_currentColor] hover:-translate-y-px active:translate-y-[2px] transition-all"
                >
                  + Add Link
                </button>
              </div>
              <div className="space-y-3">
                {socialLinks.map((link, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="https://twitter.com/username"
                      value={link}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSocialLinks(prev => prev.map((l, i) => i === idx ? val : l));
                      }}
                      className="flex-1 px-5 py-3 bg-[#fffdf0] border-2 border-brew-text rounded-2xl font-inter font-bold text-xs focus:outline-none focus:shadow-[2px_2px_0px_0px_currentColor] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setSocialLinks(prev => prev.filter((_, i) => i !== idx))}
                      className="px-3 py-3 border-2 border-brew-text bg-red-100 hover:bg-red-200 font-inter font-black text-xs rounded-xl shadow-[2px_2px_0px_0px_currentColor] hover:-translate-y-px active:translate-y-[2px] transition-all"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                {socialLinks.length === 0 && (
                  <p className="text-[10px] uppercase tracking-[0.2em] font-inter font-bold text-brew-text/35 text-center py-4 bg-[#fffdf0] border-2 border-dashed border-brew-text/25 rounded-2xl">
                    No social links added yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border-4 border-brew-text rounded-[32px] p-8 shadow-[8px_8px_0px_0px_currentColor] space-y-6">
            <h3 className="font-inter font-black text-lg uppercase tracking-widest border-b-4 border-brew-text pb-2 inline-block mb-4">
              Funding Goal
            </h3>
            <p className="font-inter font-bold text-[10px] text-brew-text/40 uppercase tracking-widest leading-none mb-4">
              Set a target for your community to rally behind.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block font-inter font-black text-[10px] uppercase tracking-[0.2em] mb-3 opacity-50">
                  Goal Title
                </label>
                <input
                  name="goal_title"
                  type="text"
                  value={form.goal_title}
                  onChange={handleChange}
                  placeholder="e.g. New Camera Lens"
                  className="w-full px-5 py-4 bg-[#fffdf0] border-2 border-brew-text rounded-2xl font-inter font-bold text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] transition-all"
                />
              </div>
              <div>
                <label className="block font-inter font-black text-[10px] uppercase tracking-[0.2em] mb-3 opacity-50">
                  Target Amount ($)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-inter font-black text-lg">
                    $
                  </span>
                  <input
                    name="goal_amount"
                    type="number"
                    value={form.goal_amount}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-4 bg-[#fffdf0] border-2 border-brew-text rounded-2xl font-inter font-black text-xl focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white border-4 border-brew-text rounded-[32px] p-6 shadow-[6px_6px_0px_0px_currentColor]">
            <h3 className="font-inter font-black text-xs uppercase tracking-[0.3em] mb-6 opacity-40 flex items-center gap-2 leading-none">
              <CreditCard size={14} /> Payouts
            </h3>
            <div className="bg-blue-50 border-2 border-brew-text rounded-2xl p-5 shadow-[3px_3px_0px_0px_currentColor]">
              <p className="font-inter font-black text-xs uppercase tracking-widest mb-1 leading-none">
                {stripe.is_connected ? "Stripe Connected" : "Stripe Setup"}
              </p>
              <p className="font-inter font-bold text-[10px] opacity-40 uppercase tracking-[0.2em] mb-4">
                {stripe.is_connected
                  ? `Your payout account is connected${stripe.card_last4 ? ` ending in ${stripe.card_last4}` : ""}.`
                  : "Connect Stripe to add your payout method and request withdrawals."}
              </p>
              <button
                type="button"
                onClick={handleConnectStripe}
                disabled={stripeLoading}
                className="w-full py-3 bg-brew-text text-white border-2 border-brew-text rounded-xl font-inter font-black text-[10px] uppercase tracking-widest shadow-[2px_2px_0px_0px_#F5C518] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all disabled:opacity-60"
              >
                {stripeLoading ? "Opening Stripe…" : stripe.is_connected ? "Manage Stripe" : "Connect Stripe"}
              </button>
            </div>
          </div>

          <div className="bg-white border-4 border-brew-text rounded-[32px] p-6 shadow-[6px_6px_0px_0px_currentColor] space-y-6">
            <h3 className="font-inter font-black text-xs uppercase tracking-[0.3em] mb-2 opacity-40 flex items-center gap-2 leading-none">
              <Bell size={14} /> Notifications
            </h3>

            {[
              ["newSupporter", "New supporter"],
              ["newMessage", "New message"],
              ["weeklyReport", "Weekly report"],
              ["marketingEmails", "Marketing emails"],
            ].map(([key, label]) => (
              <div
                key={key}
                className="flex items-center justify-between gap-4"
              >
                <span className="font-inter font-black text-[10px] uppercase tracking-widest opacity-70 leading-none">
                  {label}
                </span>
                <button
                  onClick={() => handleToggle(key)}
                  className={`relative w-12 h-7 rounded-full border-2 border-brew-text transition-colors duration-200 cursor-pointer shadow-[2px_2px_0px_0px_currentColor]
                    ${notifications[key] ? "bg-brew-yellow" : "bg-[#fffdf0]"}`}
                  type="button"
                >
                  <div
                    className={`absolute top-0.5 bottom-0.5 w-5 border-2 border-brew-text rounded-full bg-white transition-transform duration-200 ${notifications[key] ? "translate-x-5" : "translate-x-0.5"}`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {cropImageSrc && (
        <ImageCropper
          imageSrc={cropImageSrc}
          onCropCompleteAction={handleCropComplete}
          onCancel={() => setCropImageSrc(null)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

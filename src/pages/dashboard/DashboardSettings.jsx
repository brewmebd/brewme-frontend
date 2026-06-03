import { useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Avatar from "../../components/Avatar";
import Toast from "../../components/Toast";
import { Camera, Link2, Bell, CreditCard, Save } from "lucide-react";

export default function DashboardSettings() {
  const [form, setForm] = useState({
    name: "Sarah Chen",
    bio: "Digital artist creating illustrations, tutorials, and design resources. I share weekly art process videos and exclusive assets for my supporters.",
    slug: "sarahchen",
    email: "sarah@example.com",
  });

  const [notifications, setNotifications] = useState({
    newSupporter: true,
    newMessage: true,
    weeklyReport: false,
    marketingEmails: false,
  });

  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleToggle = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const handleSave = () => {
    setShowToast(true);
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 animate-fade-up">
        <div>
          <div className="inline-block mb-3 px-4 py-1.5 border-2 border-brew-text bg-brew-yellow font-inter font-black text-xs uppercase tracking-widest rounded-full shadow-[2px_2px_0px_0px_currentColor] -rotate-1">
            Preferences
          </div>
          <h1 className="font-inter font-black text-4xl md:text-5xl text-brew-text uppercase tracking-tight mb-2">
            Settings
          </h1>
          <p className="font-inter font-bold text-brew-text/70">
            Manage your profile, account details, and notifications.
          </p>
        </div>
      </div>

      {/* Profile Photo */}
      <div className="bg-white border-4 border-brew-text rounded-[24px] p-6 md:p-8 shadow-[8px_8px_0px_0px_currentColor] animate-fade-up delay-100">
        <h3 className="font-inter font-black text-xl text-brew-text uppercase tracking-wider mb-6 border-b-4 border-brew-text pb-2 inline-block">
          Profile Photo
        </h3>
        <div className="flex items-center gap-6">
          <div className="relative group cursor-pointer">
            {/* Brutalist Avatar */}
            <div className="w-24 h-24 rounded-full border-4 border-brew-text bg-brew-yellow-light flex items-center justify-center font-black text-3xl text-brew-text shadow-[4px_4px_0px_0px_currentColor] overflow-hidden">
              SC
            </div>
            <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-brew-yellow flex items-center justify-center border-2 border-brew-text shadow-[2px_2px_0px_0px_currentColor] group-hover:scale-110 group-hover:rotate-12 transition-all">
              <Camera size={18} strokeWidth={3} className="text-brew-text" />
            </button>
          </div>
          <div>
            <button className="font-inter font-black text-sm uppercase tracking-widest text-brew-text bg-[#fffdf0] px-4 py-2 border-2 border-brew-text rounded-lg shadow-[2px_2px_0px_0px_currentColor] hover:-translate-y-px hover:shadow-[3px_3px_0px_0px_currentColor] active:translate-y-px active:shadow-[1px_1px_0px_0px_currentColor] transition-all mb-2">
              Upload new
            </button>
            <p className="font-inter font-bold text-xs text-brew-text/50 uppercase tracking-widest">
              JPG, PNG or GIF. Max 2MB.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Info Form */}
      <div className="bg-white border-4 border-brew-text rounded-[24px] p-6 md:p-8 shadow-[8px_8px_0px_0px_currentColor] animate-fade-up delay-200">
        <h3 className="font-inter font-black text-xl text-brew-text uppercase tracking-wider mb-6 border-b-4 border-brew-text pb-2 inline-block">
          Profile Information
        </h3>
        <div className="space-y-6">
          <div>
            <label
              htmlFor="settings-name"
              className="block font-inter font-black text-sm text-brew-text mb-2 uppercase tracking-wide"
            >
              Display Name
            </label>
            <input
              id="settings-name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3.5 bg-[#fffdf0] border-2 border-brew-text rounded-xl font-inter font-medium text-brew-text focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] focus:-translate-y-1 transition-all duration-200"
            />
          </div>

          <div>
            <label
              htmlFor="settings-bio"
              className="block font-inter font-black text-sm text-brew-text mb-2 uppercase tracking-wide"
            >
              Bio
            </label>
            <textarea
              id="settings-bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3.5 bg-[#fffdf0] border-2 border-brew-text rounded-xl font-inter font-medium text-brew-text focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] focus:-translate-y-1 transition-all duration-200 resize-none"
            />
          </div>

          <div>
            <label
              htmlFor="settings-slug"
              className="block font-inter font-black text-sm text-brew-text mb-2 uppercase tracking-wide"
            >
              Page URL
            </label>
            <div className="flex items-stretch border-2 border-brew-text rounded-xl overflow-hidden focus-within:shadow-[4px_4px_0px_0px_currentColor] focus-within:-translate-y-1 transition-all duration-200 bg-[#fffdf0]">
              <span className="flex items-center px-4 py-3.5 bg-brew-yellow border-r-2 border-brew-text font-inter font-black text-brew-text text-sm sm:text-base tracking-tight shrink-0">
                brewme.com/
              </span>
              <input
                id="settings-slug"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                className="flex-1 w-full min-w-0 px-3 py-3.5 bg-transparent font-inter font-black text-brew-text outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="settings-email"
              className="block font-inter font-black text-sm text-brew-text mb-2 uppercase tracking-wide"
            >
              Email Address
            </label>
            <input
              id="settings-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3.5 bg-[#fffdf0] border-2 border-brew-text rounded-xl font-inter font-medium text-brew-text focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] focus:-translate-y-1 transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Stripe Connect */}
      <div className="bg-white border-4 border-brew-text rounded-[24px] p-6 md:p-8 shadow-[8px_8px_0px_0px_currentColor] animate-fade-up delay-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-brew-text bg-brew-yellow rounded-lg flex items-center justify-center shadow-[2px_2px_0px_0px_currentColor]">
              <CreditCard
                size={18}
                strokeWidth={3}
                className="text-brew-text"
              />
            </div>
            <h3 className="font-inter font-black text-xl text-brew-text uppercase tracking-wider">
              Payouts
            </h3>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#fffdf0] border-2 border-brew-text border-dashed rounded-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white border-2 border-brew-text flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_currentColor]">
              <CreditCard
                size={20}
                strokeWidth={3}
                className="text-brew-text"
              />
            </div>
            <div>
              <p className="font-inter font-black text-sm text-brew-text uppercase tracking-widest mb-1">
                Stripe Connected
              </p>
              <p className="font-inter font-bold text-xs text-brew-text/60 uppercase tracking-widest">
                Ending in •••• 4242
              </p>
            </div>
          </div>
          <button className="px-5 py-2.5 border-2 border-brew-text bg-white font-inter font-black text-xs text-brew-text uppercase tracking-widest rounded-lg shadow-[2px_2px_0px_0px_currentColor] hover:-translate-y-px hover:shadow-[3px_3px_0px_0px_currentColor] active:translate-y-px active:shadow-[1px_1px_0px_0px_currentColor] transition-all w-full sm:w-auto">
            Manage
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white border-4 border-brew-text rounded-[24px] p-6 md:p-8 shadow-[8px_8px_0px_0px_currentColor] animate-fade-up delay-400">
        <div className="flex items-center gap-3 mb-8">
          <Bell size={24} strokeWidth={3} className="text-brew-text" />
          <h3 className="font-inter font-black text-xl text-brew-text uppercase tracking-wider border-b-4 border-brew-text pb-1 inline-block">
            Notifications
          </h3>
        </div>

        <div className="space-y-6">
          {[
            {
              key: "newSupporter",
              label: "New supporter",
              desc: "Get notified when someone supports you.",
            },
            {
              key: "newMessage",
              label: "New message",
              desc: "Get notified when you receive a message.",
            },
            {
              key: "weeklyReport",
              label: "Weekly report",
              desc: "Receive a weekly earnings summary.",
            },
            {
              key: "marketingEmails",
              label: "Marketing emails",
              desc: "Receive tips and product updates.",
            },
          ].map((item, i) => (
            <div
              key={item.key}
              className={`flex items-center justify-between gap-6 pb-6 ${i !== 3 ? "border-b-2 border-dashed border-brew-text/20" : "pb-0"}`}
            >
              <div>
                <p className="font-inter font-black text-sm text-brew-text uppercase tracking-wider mb-1">
                  {item.label}
                </p>
                <p className="font-inter font-bold text-sm text-brew-text/60">
                  {item.desc}
                </p>
              </div>

              {/* Brutalist Toggle Switch */}
              <button
                onClick={() => handleToggle(item.key)}
                className={`relative w-14 h-8 rounded-full border-2 border-brew-text transition-colors duration-200 shrink-0 cursor-pointer shadow-[2px_2px_0px_0px_currentColor]
              ${notifications[item.key] ? "bg-brew-yellow" : "bg-[#fffdf0]"}`}
                role="switch"
                aria-checked={notifications[item.key]}
              >
                <div
                  className={`absolute top-0.5 bottom-0.5 w-6 border-2 border-brew-text rounded-full bg-white transition-transform duration-200
              ${notifications[item.key] ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Save Bar / Button */}
      <div className="pt-4 pb-12 animate-fade-up delay-500 flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 px-10 py-4 border-4 border-brew-text bg-brew-text text-[#fffdf0] font-inter font-black text-base uppercase tracking-widest shadow-[6px_6px_0px_0px_#F5C518] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#F5C518] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all w-full sm:w-auto rounded-xl"
        >
          <Save size={20} strokeWidth={3} className="text-brew-yellow" /> Save
          Changes
        </button>
      </div>

      {/* Brutalist Toast Overlay */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in-up">
          <div className="flex items-center gap-4 bg-brew-yellow border-4 border-brew-text p-4 md:p-5 rounded-2xl shadow-[6px_6px_0px_0px_currentColor]">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-brew-text flex items-center justify-center shrink-0">
              <Check size={16} strokeWidth={4} className="text-brew-text" />
            </div>
            <p className="font-inter font-black text-sm uppercase tracking-widest text-brew-text pr-4">
              Settings saved!
            </p>
            <button
              onClick={() => setShowToast(false)}
              className="hover:opacity-60 transition-opacity"
            >
              <X size={20} strokeWidth={4} className="text-brew-text" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

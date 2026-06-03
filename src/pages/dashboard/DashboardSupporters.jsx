import { useState } from "react";
import Card from "../../components/Card";
import Avatar from "../../components/Avatar";
import Button from "../../components/Button";
import Badge from "../../components/Badge";
import { MessageCircle, Search } from "lucide-react";

const supporters = [
  {
    name: "Emily Rodriguez",
    message: "Love your work! Keep creating amazing art! 🎨",
    amount: "$15.00",
    date: "Apr 22, 2026",
    cups: 3,
    replied: false,
  },
  {
    name: "Marcus Thompson",
    message: "Your tutorials saved my portfolio. Thank you!",
    amount: "$5.00",
    date: "Apr 22, 2026",
    cups: 1,
    replied: true,
  },
  {
    name: "Anonymous",
    message: "",
    amount: "$25.00",
    date: "Apr 21, 2026",
    cups: 5,
    replied: false,
  },
  {
    name: "Lily Kim",
    message: "Supporting your journey! Can't wait for more content.",
    amount: "$10.00",
    date: "Apr 20, 2026",
    cups: 2,
    replied: false,
  },
  {
    name: "James Wilson",
    message: "Incredible artist. Honored to support.",
    amount: "$5.00",
    date: "Apr 19, 2026",
    cups: 1,
    replied: true,
  },
  {
    name: "Aria Patel",
    message: "Joined the community — excited for exclusive content!",
    amount: "$20.00/mo",
    date: "Apr 18, 2026",
    cups: 0,
    replied: false,
  },
  {
    name: "Oliver Chen",
    message: "Thanks for the brush pack, it's amazing!",
    amount: "$5.00",
    date: "Apr 17, 2026",
    cups: 1,
    replied: false,
  },
  {
    name: "Sophie Martin",
    message: "Your creativity inspires me daily.",
    amount: "$15.00",
    date: "Apr 15, 2026",
    cups: 3,
    replied: true,
  },
];

export default function DashboardSupporters() {
  const [search, setSearch] = useState("");

  const filtered = supporters.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.message.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Page Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 animate-fade-up">
        <div>
          <div className="inline-block mb-3 px-4 py-1.5 border-2 border-brew-text bg-brew-yellow font-inter font-black text-xs uppercase tracking-widest rounded-full shadow-[2px_2px_0px_0px_currentColor] -rotate-1">
            Community
          </div>
          <h1 className="font-inter font-black text-4xl md:text-5xl text-brew-text uppercase tracking-tight mb-2">
            Supporters
          </h1>
          <p className="font-inter font-bold text-brew-text/70">
            {supporters.length} people have fueled your work.
          </p>
        </div>

        {/* Chunky Search Bar */}
        <div className="relative w-full md:w-80 group">
          <Search
            size={20}
            strokeWidth={3}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-brew-text transition-transform group-focus-within:rotate-12"
          />
          <input
            type="text"
            placeholder="Search supporters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-brew-text rounded-xl font-inter font-bold text-brew-text placeholder:text-brew-text/40 focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] focus:-translate-y-1 transition-all duration-200"
          />
        </div>
      </div>

      {/* Supporters Table (Desktop) */}
      <div className="hidden md:block animate-fade-up delay-100">
        <div className="bg-white border-4 border-brew-text rounded-[24px] shadow-[8px_8px_0px_0px_currentColor] overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-brew-yellow border-b-4 border-brew-text">
                <th className="text-left px-6 py-4 font-inter font-black text-sm text-brew-text uppercase tracking-widest border-r-2 border-brew-text">
                  Supporter
                </th>
                <th className="text-left px-6 py-4 font-inter font-black text-sm text-brew-text uppercase tracking-widest border-r-2 border-brew-text">
                  Message
                </th>
                <th className="text-left px-6 py-4 font-inter font-black text-sm text-brew-text uppercase tracking-widest border-r-2 border-brew-text">
                  Amount
                </th>
                <th className="text-left px-6 py-4 font-inter font-black text-sm text-brew-text uppercase tracking-widest border-r-2 border-brew-text">
                  Date
                </th>
                <th className="text-right px-6 py-4 font-inter font-black text-sm text-brew-text uppercase tracking-widest">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr
                  key={i}
                  className="border-b-2 border-brew-text last:border-b-0 hover:bg-brew-yellow-light/30 transition-colors"
                >
                  <td className="px-6 py-4 border-r-2 border-brew-text/20">
                    <div className="flex items-center gap-4">
                      {/* Brutalist Avatar */}
                      <div className="w-10 h-10 rounded-lg border-2 border-brew-text bg-brew-yellow-light flex items-center justify-center font-black text-brew-text shadow-[2px_2px_0px_0px_currentColor] shrink-0 overflow-hidden">
                        {/* Assuming Avatar takes initials or an image. Using text placeholder for demo */}
                        {s.name.charAt(0)}
                      </div>
                      <span className="font-inter font-black text-base text-brew-text">
                        {s.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-r-2 border-brew-text/20">
                    <p className="font-inter font-medium text-sm text-brew-text/80 truncate max-w-[250px]">
                      {s.message || "—"}
                    </p>
                  </td>
                  <td className="px-6 py-4 border-r-2 border-brew-text/20">
                    <span className="font-inter font-black text-base text-brew-text bg-[#fffdf0] px-2 py-1 border-2 border-brew-text rounded-md shadow-[1px_1px_0px_0px_currentColor]">
                      {s.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-r-2 border-brew-text/20">
                    <span className="font-inter font-bold text-xs text-brew-text/60 uppercase tracking-widest">
                      {s.date}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {s.replied ? (
                      <span className="inline-block px-3 py-1.5 border-2 border-brew-text/30 bg-gray-100 font-inter font-black text-[10px] text-brew-text/50 uppercase tracking-widest rounded-full">
                        Replied
                      </span>
                    ) : (
                      <button className="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-brew-text bg-white font-inter font-black text-xs text-brew-text uppercase tracking-widest rounded-full shadow-[2px_2px_0px_0px_currentColor] hover:-translate-y-px hover:shadow-[3px_3px_0px_0px_currentColor] active:translate-y-px active:shadow-[1px_1px_0px_0px_currentColor] transition-all">
                        <MessageCircle size={14} strokeWidth={3} /> Reply
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supporters Cards (Mobile) */}
      <div className="md:hidden space-y-4 animate-fade-up delay-100">
        {filtered.map((s, i) => (
          <div
            key={i}
            className="bg-white border-2 border-brew-text rounded-2xl p-5 shadow-[4px_4px_0px_0px_currentColor]"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl border-2 border-brew-text bg-brew-yellow-light flex items-center justify-center font-black text-brew-text shadow-[2px_2px_0px_0px_currentColor] shrink-0">
                {s.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-inter font-black text-base text-brew-text line-clamp-1">
                    {s.name}
                  </span>
                  <span className="font-inter font-black text-sm text-brew-text bg-[#fffdf0] px-2 py-0.5 border-2 border-brew-text rounded-md shadow-[1px_1px_0px_0px_currentColor] shrink-0">
                    {s.amount}
                  </span>
                </div>
                <span className="font-inter font-bold text-[10px] text-brew-text/50 uppercase tracking-widest">
                  {s.date}
                </span>
              </div>
            </div>

            {s.message && (
              <div className="bg-[#fffdf0] border-2 border-brew-text border-dashed p-3 rounded-xl mb-4">
                <p className="font-inter font-medium text-sm text-brew-text/80">
                  {s.message}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t-2 border-brew-text/10">
              {s.replied ? (
                <span className="px-3 py-1.5 border-2 border-brew-text/30 bg-gray-100 font-inter font-black text-[10px] text-brew-text/50 uppercase tracking-widest rounded-full">
                  Replied
                </span>
              ) : (
                <button className="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-brew-text bg-brew-yellow font-inter font-black text-xs text-brew-text uppercase tracking-widest rounded-full shadow-[2px_2px_0px_0px_currentColor] active:translate-y-px active:shadow-none transition-all">
                  <MessageCircle size={14} strokeWidth={3} /> Reply
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

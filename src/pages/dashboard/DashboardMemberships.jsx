import { useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Badge from "../../components/Badge";
import { Crown, Users, Check, Plus, Edit2 } from "lucide-react";

const initialTiers = [
  {
    name: "Coffee Supporter",
    price: "$5/mo",
    subscribers: 89,
    perks: [
      "Access to supporters feed",
      "Name in supporter wall",
      "Monthly newsletter",
    ],
    color: "bg-brew-yellow-light",
  },
  {
    name: "Gold Member",
    price: "$15/mo",
    subscribers: 34,
    perks: [
      "All Coffee Supporter perks",
      "Exclusive posts & downloads",
      "Monthly Q&A access",
      "Early content access",
    ],
    color: "bg-brew-yellow/10",
  },
  {
    name: "Platinum Patron",
    price: "$50/mo",
    subscribers: 8,
    perks: [
      "All Gold Member perks",
      "1-on-1 monthly call",
      "Custom illustration request",
      "Behind-the-scenes access",
      "Credits in all works",
    ],
    color: "bg-brew-yellow/20",
  },
];

export default function DashboardMemberships() {
  const [tiers] = useState(initialTiers);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Page Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 animate-fade-up">
        <div>
          <div className="inline-block mb-3 px-4 py-1.5 border-2 border-brew-text bg-brew-yellow font-inter font-black text-xs uppercase tracking-widest rounded-full shadow-[2px_2px_0px_0px_currentColor] -rotate-1">
            Community
          </div>
          <h1 className="font-inter font-black text-4xl md:text-5xl text-brew-text uppercase tracking-tight mb-2">
            Memberships
          </h1>
          <p className="font-inter font-bold text-lg text-brew-text/70">
            Manage your subscription tiers and exclusive perks.
          </p>
        </div>

        {tiers.length < 3 && (
          <button className="flex items-center justify-center gap-2 px-6 py-4 border-4 border-brew-text bg-brew-text text-[#fffdf0] font-inter font-black text-sm uppercase tracking-widest shadow-[4px_4px_0px_0px_#F5C518] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#F5C518] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all rounded-xl w-full sm:w-auto">
            <Plus size={18} strokeWidth={4} className="text-brew-yellow" /> Add
            Tier
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {[
          {
            label: "Total Members",
            value: tiers.reduce((sum, t) => sum + t.subscribers, 0).toString(),
            icon: Users,
          },
          { label: "Monthly Revenue", value: "$1,465.00", icon: Crown },
          {
            label: "Active Tiers",
            value: tiers.length.toString(),
            icon: Crown,
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white border-4 border-brew-text p-6 rounded-2xl shadow-[6px_6px_0px_0px_currentColor] transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_currentColor] animate-fade-up flex flex-col"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl border-2 border-brew-text bg-brew-yellow-light flex items-center justify-center shadow-[3px_3px_0px_0px_currentColor]">
                  <Icon size={20} strokeWidth={3} className="text-brew-text" />
                </div>
                <p className="font-inter font-black text-xs text-brew-text/60 uppercase tracking-widest leading-tight">
                  {stat.label}
                </p>
              </div>
              <p className="font-inter font-black text-4xl text-brew-text tracking-tighter mt-auto">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Tier Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier, i) => (
          <div
            key={i}
            className="bg-[#fffdf0] border-4 border-brew-text rounded-[24px] shadow-[8px_8px_0px_0px_currentColor] flex flex-col transition-transform duration-200 hover:-translate-y-2 hover:shadow-[10px_10px_0px_0px_currentColor] animate-fade-up overflow-hidden"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {/* Header Block */}
            <div className="bg-brew-yellow border-b-4 border-brew-text p-6 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Crown size={18} strokeWidth={3} className="text-brew-text" />
                  <h3 className="font-inter font-black text-xl text-brew-text uppercase tracking-tight">
                    {tier.name}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border-2 border-brew-text font-inter font-black text-[10px] text-brew-text uppercase tracking-widest shadow-[2px_2px_0px_0px_currentColor] rounded-full">
                    <Users size={12} strokeWidth={3} /> {tier.subscribers} Subs
                  </span>
                </div>
              </div>
              <button className="w-10 h-10 flex items-center justify-center border-2 border-brew-text bg-white rounded-xl shadow-[3px_3px_0px_0px_currentColor] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_currentColor] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all shrink-0">
                <Edit2 size={16} strokeWidth={3} className="text-brew-text" />
              </button>
            </div>

            {/* Body Block */}
            <div className="p-6 flex flex-col flex-grow bg-white">
              <div className="mb-6">
                <p className="font-inter font-black text-5xl text-brew-text tracking-tighter">
                  {tier.price}
                </p>
                <p className="font-inter font-bold text-sm text-brew-text/50 uppercase tracking-widest mt-1">
                  Per Month
                </p>
              </div>

              <div className="border-t-4 border-dashed border-brew-text/20 pt-6 flex-grow">
                <p className="font-inter font-black text-xs text-brew-text uppercase tracking-widest mb-4">
                  Included Perks
                </p>
                <ul className="space-y-4 list-none p-0 m-0">
                  {tier.perks.map((perk, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-3 font-inter font-bold text-sm text-brew-text/80 leading-relaxed"
                    >
                      <div className="w-6 h-6 rounded-md border-2 border-brew-text bg-brew-yellow flex items-center justify-center shrink-0 mt-0.5 shadow-[1px_1px_0px_0px_currentColor]">
                        <Check
                          size={14}
                          strokeWidth={4}
                          className="text-brew-text"
                        />
                      </div>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state for adding more tiers */}
      {tiers.length < 3 && (
        <div className="mt-12 text-center bg-white border-4 border-dashed border-brew-text/20 p-8 rounded-[24px] max-w-2xl mx-auto">
          <p className="font-inter font-bold text-lg text-brew-text/70">
            You can have up to{" "}
            <span className="text-brew-text font-black">3</span> membership
            tiers. Add another to offer more value to your biggest fans.
          </p>
        </div>
      )}
    </div>
  );
}

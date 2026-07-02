import { useEffect, useState } from "react";
import Toast from "../../components/Toast";
import Skeleton from "../../components/Skeleton";
import {
  Crown,
  Users,
  Check,
  Plus,
  Edit2,
  Loader2,
  Sparkles,
  X,
  Trash2,
} from "lucide-react";
import {
  getDashboardMemberships,
  createMembershipTier,
  updateMembershipTier,
  deleteMembershipTier,
} from "../../lib/api";

const emptyTierForm = { name: "", price: "", perks: "" };

export default function DashboardMemberships() {
  const [tiers, setTiers] = useState([]);
  const [summary, setSummary] = useState({
    total_members: 0,
    monthly_revenue: 0,
    active_tiers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTier, setEditingTier] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [tierForm, setTierForm] = useState(emptyTierForm);

  const loadMemberships = async () => {
    try {
      const data = await getDashboardMemberships();
      setTiers(Array.isArray(data?.tiers) ? data.tiers : []);
      setSummary(
        data?.summary || {
          total_members: 0,
          monthly_revenue: 0,
          active_tiers: 0,
        },
      );
    } catch (err) {
      console.error("Failed to load memberships:", err);
      setToast({
        type: "error",
        message: err.message || "Failed to load membership tiers.",
      });
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  useEffect(() => {
    loadMemberships();
  }, []);

  const openCreateModal = () => {
    setEditingTier(null);
    setTierForm(emptyTierForm);
    setShowModal(true);
  };

  const openEditModal = (tier) => {
    setEditingTier(tier);
    setTierForm({
      name: tier.name || "",
      price: tier.price?.toString() || "",
      perks: Array.isArray(tier.perks) ? tier.perks.join("\n") : "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setShowModal(false);
    setEditingTier(null);
    setTierForm(emptyTierForm);
  };

  const handleSubmitTier = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!tierForm.name.trim() || !tierForm.price || !tierForm.perks.trim()) {
      setToast({ type: "error", message: "Please fill in all fields." });
      return;
    }

    const perks = tierForm.perks
      .split("\n")
      .map((perk) => perk.trim())
      .filter(Boolean);

    setSubmitting(true);
    try {
      const payload = {
        name: tierForm.name.trim(),
        price: Number(tierForm.price),
        perks,
      };

      if (editingTier) {
        await updateMembershipTier(editingTier.id, payload);
        setToast({ type: "success", message: "Membership tier updated!" });
      } else {
        await createMembershipTier(payload);
        setToast({ type: "success", message: "Membership tier created!" });
      }

      setShowModal(false);
      setEditingTier(null);
      setTierForm(emptyTierForm);
      await loadMemberships();
    } catch (err) {
      setToast({
        type: "error",
        message: err.message || "Failed to save tier.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleArchiveTier = async (tier) => {
    if (
      !window.confirm(
        `Archive ${tier.name}? This hides the tier from your page.`,
      )
    ) {
      return;
    }

    try {
      await deleteMembershipTier(tier.id);
      setToast({ type: "success", message: "Membership tier archived." });
      await loadMemberships();
    } catch (err) {
      setToast({
        type: "error",
        message: err.message || "Failed to archive tier.",
      });
    }
  };

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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  const totalMembers =
    summary.total_members ||
    tiers.reduce((sum, tier) => sum + (tier.subscriber_count || 0), 0);
  const monthlyRevenue =
    summary.monthly_revenue ||
    tiers.reduce(
      (sum, tier) => sum + (tier.subscriber_count || 0) * (tier.price || 0),
      0,
    );
  const activeTiers = summary.active_tiers || tiers.length;

  return (
    <>
      <div className="animate-fade-up text-brew-text">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-block mb-2 px-3 py-1 border-2 border-brew-text bg-brew-yellow font-inter font-black text-[10px] uppercase tracking-widest rounded-full shadow-[2px_2px_0px_0px_currentColor] -rotate-1">
              Community
            </div>
            <h1 className="font-space font-black text-3xl md:text-4xl uppercase tracking-tight mb-1 leading-none">
              Memberships
            </h1>
            <p className="font-inter font-bold text-sm opacity-60">
              Manage your subscription levels, perks, and subscriber counts.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-brew-text bg-brew-text text-[#fffdf0] font-inter font-black text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px_#F5C518] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all rounded-xl w-full sm:w-auto shrink-0 active-haptic"
            disabled={tiers.length >= 3}
          >
            <Plus size={16} strokeWidth={4} className="text-brew-yellow" />
            {tiers.length >= 3 ? "Max 3 Tiers" : "Add Tier"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            {
              label: "Total Members",
              value: String(totalMembers),
              icon: Users,
            },
            {
              label: "MRR",
              value: `$${Number(monthlyRevenue).toFixed(2)}`,
              icon: Crown,
            },
            { label: "Active Tiers", value: String(activeTiers), icon: Crown },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="bg-white border-2 border-brew-text p-5 rounded-2xl shadow-[4px_4px_0px_0px_currentColor] flex flex-col hover-lift transition-transform"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg border-2 border-brew-text bg-brew-yellow-light flex items-center justify-center shadow-[2px_2px_0px_0px_currentColor]">
                    <Icon size={18} strokeWidth={3} />
                  </div>
                  <p className="font-inter font-black text-[10px] opacity-40 uppercase tracking-widest leading-tight">
                    {stat.label}
                  </p>
                </div>
                <p className="font-space font-black text-3xl tracking-tighter mt-auto leading-none uppercase">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {tiers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-12 p-1">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className="bg-[#fffdf0] border-4 border-brew-text rounded-[28px] shadow-[8px_8px_0px_0px_currentColor] flex flex-col transition-all duration-200 hover:-translate-y-1 w-full min-w-0 overflow-hidden active-haptic"
              >
                <div className="bg-brew-yellow border-b-4 border-brew-text p-6 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-space font-black text-xl uppercase tracking-tight mb-2 leading-none truncate">
                      {tier.name}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border-2 border-brew-text font-inter font-black text-[9px] uppercase tracking-widest shadow-[1px_1px_0px_0px_currentColor] rounded-full">
                      <Users size={10} strokeWidth={3} />{" "}
                      {tier.subscriber_count} Members
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => openEditModal(tier)}
                      className="w-8 h-8 flex items-center justify-center border-2 border-brew-text bg-white rounded-lg shadow-[2px_2px_0px_0px_currentColor] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-none transition-all shrink-0"
                      title="Edit tier"
                    >
                      <Edit2 size={14} strokeWidth={3} />
                    </button>
                    <button
                      onClick={() => handleArchiveTier(tier)}
                      className="w-8 h-8 flex items-center justify-center border-2 border-brew-text bg-white rounded-lg shadow-[2px_2px_0px_0px_currentColor] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-none transition-all shrink-0"
                      title="Archive tier"
                    >
                      <Trash2 size={14} strokeWidth={3} />
                    </button>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow bg-white rounded-b-[24px]">
                  <div className="mb-8">
                    <p className="font-space font-black text-4xl tracking-tighter leading-none">
                      ${Number(tier.price).toFixed(2)}
                    </p>
                    <p className="font-inter font-bold text-[10px] text-brew-text/30 uppercase tracking-widest mt-2">
                      Per Month
                    </p>
                  </div>

                  <div className="border-t-2 border-dashed border-brew-text/10 pt-6 flex-grow">
                    <ul className="space-y-3">
                      {(tier.perks || []).map((perk, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 font-inter font-bold text-xs text-brew-text/70 leading-relaxed"
                        >
                          <div className="w-5 h-5 rounded bg-brew-yellow border border-brew-text flex items-center justify-center shrink-0 mt-0.5 shadow-[1px_1px_0px_0px_currentColor]">
                            <Check size={12} strokeWidth={5} />
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
        ) : (
          <div className="mt-12 text-center bg-white border-4 border-dashed border-brew-text/10 p-16 rounded-[48px] max-w-2xl mx-auto shadow-[12px_12px_0px_0px_rgba(0,0,0,0.03)]">
            <div className="w-20 h-20 bg-brew-yellow/10 border-2 border-dashed border-brew-yellow/40 rounded-[32px] flex items-center justify-center mx-auto mb-8 -rotate-6">
              <Sparkles
                size={40}
                className="text-brew-yellow"
                strokeWidth={2.5}
              />
            </div>
            <h3 className="font-space font-black text-3xl text-brew-text uppercase tracking-tight mb-4">
              Launch your club
            </h3>
            <p className="font-inter font-bold text-base text-brew-text/40 uppercase tracking-widest leading-relaxed mb-10 max-w-sm mx-auto">
              Create your first membership tier to start earning recurring
              income from your fans!
            </p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-3 px-10 py-5 bg-brew-yellow border-4 border-brew-text rounded-[24px] font-space font-black text-base uppercase tracking-widest shadow-[8px_8px_0px_0px_currentColor] hover:translate-x-1 hover:translate-y-1 active:shadow-none transition-all active-haptic"
            >
              <Plus size={20} strokeWidth={4} /> Create Tier
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-brew-text/60 backdrop-blur-xl animate-fade-in"
            onClick={() => !submitting && closeModal()}
          />
          <div className="relative w-full max-w-md bg-white border-4 border-brew-text rounded-[32px] p-8 shadow-[12px_12px_0px_0px_currentColor] animate-slide-in-up text-brew-text">
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 p-2 hover:bg-brew-yellow-light rounded-full transition-colors text-brew-text"
            >
              <X size={20} strokeWidth={3} />
            </button>

            <h3 className="font-space font-black text-2xl uppercase tracking-tight mb-6 flex items-center gap-3">
              {editingTier ? "Edit Tier" : "New Tier"}{" "}
              <Crown size={24} className="text-brew-yellow" />
            </h3>

            <form onSubmit={handleSubmitTier} className="space-y-6">
              <div>
                <label className="block font-inter font-black text-xs uppercase tracking-widest mb-2 opacity-60">
                  Tier Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Early Bird"
                  value={tierForm.name}
                  onChange={(e) =>
                    setTierForm({ ...tierForm, name: e.target.value })
                  }
                  className="w-full px-5 py-4 bg-[#fffdf0] border-2 border-brew-text rounded-2xl font-inter font-black text-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] transition-all"
                />
              </div>

              <div>
                <label className="block font-inter font-black text-xs uppercase tracking-widest mb-2 opacity-60">
                  Monthly Price
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-inter font-black text-lg">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="5"
                    value={tierForm.price}
                    onChange={(e) =>
                      setTierForm({ ...tierForm, price: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-4 bg-[#fffdf0] border-2 border-brew-text rounded-2xl font-inter font-black text-xl focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-inter font-black text-xs uppercase tracking-widest mb-2 opacity-60 text-pretty">
                  Tier Perks (One per line)
                </label>
                <textarea
                  rows={4}
                  placeholder="Exclusive content\nSupporter badge\nBehind the scenes"
                  value={tierForm.perks}
                  onChange={(e) =>
                    setTierForm({ ...tierForm, perks: e.target.value })
                  }
                  className="w-full px-5 py-4 bg-[#fffdf0] border-2 border-brew-text rounded-2xl font-inter font-bold text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] transition-all resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="flex-1 px-6 py-4 border-2 border-brew-text bg-white font-inter font-black text-xs uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-4 border-2 border-brew-text bg-brew-text text-white font-inter font-black text-xs uppercase tracking-widest rounded-xl shadow-[4px_4px_0px_0px_#F5C518] hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <Loader2
                      size={14}
                      className="animate-spin text-brew-yellow"
                    />
                  ) : (
                    <Plus size={14} strokeWidth={4} />
                  )}
                  {submitting
                    ? "Saving..."
                    : editingTier
                      ? "Update Tier"
                      : "Create Tier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

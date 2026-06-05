import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { logout, getProfile, API_ORIGIN } from "../lib/api";
import Avatar from "./Avatar";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  FileText,
  Crown,
  Settings,
  LogOut,
  Menu,
  X,
  Coffee,
  Compass,
  Eye,
  QrCode,
} from "lucide-react";
import { useState, useEffect } from "react";

const sidebarLinks = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Overview", exact: true },
  { to: "/dashboard/supporters", icon: Users, label: "Supporters" },
  { to: "/dashboard/earnings", icon: DollarSign, label: "Earnings" },
  { to: "/dashboard/posts", icon: FileText, label: "Posts" },
  { to: "/dashboard/memberships", icon: Crown, label: "Memberships" },
  { to: "/dashboard/settings", icon: Settings, label: "Settings" },
  { to: "/dashboard/share", icon: QrCode, label: "Share" },
  { to: "/explore", icon: Compass, label: "Explore" },
];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile()
      .then((data) => {
        if (data.status) setProfile(data.profile_info);
      })
      .catch(console.error);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const isActive = (link) => {
    if (link.exact) return location.pathname === link.to;
    return location.pathname.startsWith(link.to);
  };

  return (
    <div className="flex bg-[#fffdf0] min-h-screen font-inter text-brew-text selection:bg-brew-yellow">
      {/* Desktop Sidebar (Standardized width to w-64) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r-4 border-brew-text fixed h-full z-40">
        <div className="flex items-center px-6 h-16 border-b-4 border-brew-text bg-brew-yellow">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 no-underline group"
          >
            <div className="w-8 h-8 bg-white border-2 border-brew-text rounded-lg shadow-[2px_2px_0px_0px_currentColor] flex items-center justify-center transition-transform group-hover:-translate-y-0.5">
              <Coffee size={16} strokeWidth={3} />
            </div>
            <span className="font-black text-xl uppercase tracking-tighter text-brew-text">
              BrewMe
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wide no-underline transition-all duration-150 border-2
              ${
                active
                  ? "bg-brew-yellow text-brew-text border-brew-text shadow-[3px_3px_0px_0px_currentColor] translate-x-1"
                  : "bg-white text-brew-text/70 border-transparent hover:border-brew-text hover:text-brew-text hover:shadow-[3px_3px_0px_0px_currentColor] hover:-translate-y-0.5"
              }`}
              >
                <Icon
                  size={18}
                  strokeWidth={active ? 3 : 2}
                  className={active ? "text-brew-text" : ""}
                />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* View Public Page & User Summary */}
        <div className="p-3 border-t-4 border-brew-text bg-[#fffdf0]/50 space-y-3">
          {profile && (
            <Link
              to={`/${profile.creator_url}`}
              target="_blank"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-brew-text bg-brew-text text-white text-xs font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_#F5C518] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#F5C518] active:shadow-none transition-all"
            >
              <Eye size={16} strokeWidth={3} className="text-brew-yellow" />
              View My Page
            </Link>
          )}

          {profile && (
            <div className="flex items-center gap-3 px-3 py-2 bg-white border-2 border-brew-text rounded-xl shadow-[3px_3px_0px_0px_currentColor]">
              <Avatar
                name={profile.creator_name}
                src={profile.creator_image ? `${API_ORIGIN}${profile.creator_image}` : ""}
                size="sm"
                className="border-2 border-brew-text shrink-0"
              />
              <div className="min-w-0">
                <p className="font-black text-xs text-brew-text truncate">
                  {profile.creator_name}
                </p>
                <p className="font-bold text-[9px] text-brew-text/50 uppercase tracking-widest truncate">
                  {profile.creator_email}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 w-full px-4 py-2.5 rounded-xl border-2 border-brew-text bg-white text-[10px] font-black uppercase tracking-widest text-brew-text hover:bg-brew-yellow hover:shadow-[3px_3px_0px_0px_currentColor] transition-all cursor-pointer"
          >
            <LogOut size={14} strokeWidth={3} />
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-brew-text flex items-center justify-between px-4 h-16">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <Coffee size={20} strokeWidth={3} className="text-brew-text" />
          <span className="font-black text-xl uppercase tracking-tighter text-brew-text">
            BrewMe
          </span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-brew-text bg-brew-yellow shadow-[2px_2px_0px_0px_currentColor] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? (
            <X size={20} strokeWidth={3} />
          ) : (
            <Menu size={20} strokeWidth={3} />
          )}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-brew-text/20 backdrop-blur-sm z-40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="md:hidden fixed left-0 top-16 bottom-0 w-64 bg-white border-r-4 border-brew-text z-50 animate-slide-in-up">
            <nav className="px-4 py-6 space-y-3">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-bold uppercase tracking-wide no-underline transition-all duration-150 border-2
                  ${
                    active
                      ? "bg-brew-yellow text-brew-text border-brew-text shadow-[4px_4px_0px_0px_currentColor]"
                      : "bg-white text-brew-text/80 border-transparent hover:border-brew-text hover:shadow-[4px_4px_0px_0px_currentColor]"
                  }`}
                  >
                    <Icon size={20} strokeWidth={active ? 3 : 2} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </>
      )}

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-4 border-brew-text z-40 flex items-center justify-around h-16 px-2 pb-2">
        {sidebarLinks.slice(0, 5).map((link) => {
          const Icon = link.icon;
          const active = isActive(link);
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center justify-center gap-0.5 w-12 h-12 rounded-lg border-2 transition-all duration-150 no-underline
            ${
              active
                ? "bg-brew-yellow border-brew-text shadow-[2px_2px_0px_0px_currentColor] -translate-y-1.5"
                : "border-transparent text-brew-text/60"
            }`}
            >
              <Icon
                size={16}
                strokeWidth={active ? 3 : 2}
                className={active ? "text-brew-text" : ""}
              />
              <span
                className={`text-[8px] font-black uppercase tracking-widest ${active ? "text-brew-text" : ""}`}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Main Content Area (Standardized width and padding) */}
      <div className="flex-1 md:ml-64 min-h-screen flex flex-col">
        <div className="pt-20 md:pt-10 pb-16 md:pb-12 px-4 md:px-8 max-w-6xl mx-auto w-full flex-grow">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

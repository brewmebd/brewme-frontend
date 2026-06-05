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
} from "lucide-react";
import { useState, useEffect } from "react";

const sidebarLinks = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Overview", exact: true },
  { to: "/dashboard/supporters", icon: Users, label: "Supporters" },
  { to: "/dashboard/earnings", icon: DollarSign, label: "Earnings" },
  { to: "/dashboard/posts", icon: FileText, label: "Posts" },
  { to: "/dashboard/memberships", icon: Crown, label: "Memberships" },
  { to: "/dashboard/settings", icon: Settings, label: "Settings" },
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
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r-4 border-brew-text fixed h-full z-40">
        <div className="flex items-center px-6 h-20 border-b-4 border-brew-text bg-brew-yellow">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 no-underline group"
          >
            <div className="w-10 h-10 bg-white border-2 border-brew-text rounded-xl shadow-[2px_2px_0px_0px_currentColor] flex items-center justify-center transition-transform group-hover:-translate-y-1">
              <Coffee size={20} strokeWidth={3} />
            </div>
            <span className="font-black text-2xl uppercase tracking-tighter text-brew-text">
              BrewMe
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-3 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-base font-bold uppercase tracking-wide no-underline transition-all duration-150 border-2
              ${
                active
                  ? "bg-brew-yellow text-brew-text border-brew-text shadow-[4px_4px_0px_0px_currentColor] translate-x-1"
                  : "bg-white text-brew-text/70 border-transparent hover:border-brew-text hover:text-brew-text hover:shadow-[4px_4px_0px_0px_currentColor] hover:-translate-y-1"
              }`}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 3 : 2}
                  className={active ? "text-brew-text" : ""}
                />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Summary */}
        {profile && (
          <div className="p-4 border-t-4 border-brew-text bg-[#fffdf0]/50">
            <div className="flex items-center gap-3 px-2 py-3 bg-white border-2 border-brew-text rounded-2xl shadow-[4px_4px_0px_0px_currentColor] mb-4">
              <Avatar
                name={profile.creator_name}
                src={profile.creator_image ? `${API_ORIGIN}${profile.creator_image}` : ""}
                size="md"
                className="border-2 border-brew-text shrink-0"
              />
              <div className="min-w-0">
                <p className="font-black text-sm text-brew-text truncate">
                  {profile.creator_name}
                </p>
                <p className="font-bold text-[10px] text-brew-text/50 uppercase tracking-widest truncate">
                  {profile.creator_email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-3 w-full px-4 py-3.5 rounded-xl border-2 border-brew-text bg-white text-sm font-black uppercase tracking-widest text-brew-text hover:bg-brew-yellow hover:shadow-[4px_4px_0px_0px_currentColor] hover:-translate-y-1 transition-all cursor-pointer"
            >
              <LogOut size={18} strokeWidth={3} />
              Log out
            </button>
          </div>
        )}

        {!profile && (
          <div className="p-4 border-t-4 border-brew-text bg-white">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-3 w-full px-4 py-3.5 rounded-xl border-2 border-brew-text bg-[#fffdf0] text-sm font-black uppercase tracking-widest text-brew-text hover:bg-brew-yellow hover:shadow-[4px_4px_0px_0px_currentColor] hover:-translate-y-1 transition-all cursor-pointer"
            >
              <LogOut size={18} strokeWidth={3} />
              Log out
            </button>
          </div>
        )}
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
          <aside className="md:hidden fixed left-0 top-16 bottom-0 w-72 bg-white border-r-4 border-brew-text z-50 animate-slide-in-up">
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-4 border-brew-text z-40 flex items-center justify-around h-20 px-2 pb-2">
        {sidebarLinks.slice(0, 5).map((link) => {
          const Icon = link.icon;
          const active = isActive(link);
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center justify-center gap-1 w-14 h-14 rounded-xl border-2 transition-all duration-150 no-underline
            ${
              active
                ? "bg-brew-yellow border-brew-text shadow-[2px_2px_0px_0px_currentColor] -translate-y-2"
                : "border-transparent text-brew-text/60"
            }`}
            >
              <Icon
                size={20}
                strokeWidth={active ? 3 : 2}
                className={active ? "text-brew-text" : ""}
              />
              <span
                className={`text-[9px] font-black uppercase tracking-widest ${active ? "text-brew-text" : ""}`}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-72 min-h-screen">
        {/* Added generous padding to account for thick headers/footers */}
        <div className="pt-24 md:pt-12 pb-28 md:pb-12 px-4 md:px-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

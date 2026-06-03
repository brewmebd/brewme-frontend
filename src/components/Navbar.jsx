import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/explore", label: "Explore" },
    { to: "/login", label: "Log in" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#fffdf0] border-b-4 border-brew-text">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 no-underline group">
          <div className="w-10 h-10 bg-white flex items-center justify-center overflow-hidden ">
            <img
              src="icons/icon.svg"
              className="w-full h-full object-cover"
              alt="BrewMe Logo"
            />
          </div>
          <span className="font-inter font-black text-2xl text-brew-text tracking-tighter uppercase">
            BrewMe
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-3">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-inter font-bold text-sm px-5 py-2 rounded-full border-2 transition-all duration-150
            ${
              location.pathname === link.to
                ? "border-brew-text bg-brew-yellow shadow-[2px_2px_0px_0px_currentColor] text-brew-text"
                : "border-transparent text-brew-text/80 hover:border-brew-text hover:bg-white hover:text-brew-text hover:shadow-[2px_2px_0px_0px_currentColor] hover:-translate-y-px"
            }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="ml-2">
            <Link
              to="/signup"
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-brew-text bg-brew-yellow px-6 py-2.5 font-inter text-sm font-black text-brew-text shadow-[3px_3px_0px_0px_currentColor] transition-all duration-150 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_currentColor] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
            >
              Start your page
            </Link>
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden w-12 h-12 flex items-center justify-center rounded-xl border-2 border-brew-text bg-white shadow-[3px_3px_0px_0px_currentColor] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_currentColor] transition-all"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X size={24} strokeWidth={3} className="text-brew-text" />
          ) : (
            <Menu size={24} strokeWidth={3} className="text-brew-text" />
          )}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t-2 border-brew-text border-b-4 border-brew-text px-6 py-6 absolute w-full left-0 shadow-2xl animate-fade-up z-40">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block font-inter font-black text-lg px-5 py-3 rounded-xl border-2 transition-all ${
                  location.pathname === link.to
                    ? "border-brew-text bg-brew-yellow shadow-[2px_2px_0px_0px_currentColor] text-brew-text"
                    : "border-brew-text bg-[#fffdf0] text-brew-text hover:shadow-[2px_2px_0px_0px_currentColor] hover:-translate-y-px"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/signup"
              onClick={() => setMobileOpen(false)}
              className="mt-4 flex w-full min-h-[56px] items-center justify-center rounded-xl border-2 border-brew-text bg-brew-text text-[#fffdf0] px-6 py-3 font-inter text-lg font-black shadow-[4px_4px_0px_0px_#F5C518] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              Start your page
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

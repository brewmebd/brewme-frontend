import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#fffdf0] border-t-4 border-brew-text mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand Column (Spans 2 cols on desktop) */}
          <div className="md:col-span-2">
            <Link
              to="/"
              className="inline-flex items-center gap-3 px-5 py-2 border-2 border-brew-text bg-brew-yellow shadow-[4px_4px_0px_0px_currentColor] mb-6 no-underline transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_currentColor] active:translate-y-0 active:shadow-[2px_2px_0px_0px_currentColor]"
            >
              <span className="font-inter font-black text-2xl text-brew-text uppercase tracking-tight">
                BrewMe
              </span>
            </Link>
            <p className="font-inter font-bold text-base text-brew-text/80 leading-relaxed mb-8 max-w-sm">
              Support what you love, one cup at a time. The easiest way for
              creators to get funded.
            </p>
            <div className="flex gap-4">
              {["Twitter", "Instagram", "YouTube"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-12 h-12 rounded-xl border-2 border-brew-text bg-white flex items-center justify-center text-brew-text shadow-[3px_3px_0px_0px_currentColor] hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_currentColor] hover:bg-brew-yellow-light active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_currentColor] transition-all duration-150 no-underline font-inter font-black text-lg"
                  aria-label={social}
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="inline-block font-inter font-black text-sm text-brew-text mb-6 uppercase tracking-widest border-b-4 border-brew-text pb-1">
              Navigation
            </h4>
            <ul className="list-none p-0 m-0 space-y-4">
              {[
                { to: "/explore", label: "Explore creators" },
                { to: "/signup", label: "Start a page" },
                { to: "/login", label: "Sign in" },
                { to: "/dashboard", label: "Dashboard" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="font-inter font-bold text-base text-brew-text/70 hover:text-brew-text hover:underline decoration-4 underline-offset-4 no-underline transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Column */}
          <div>
            <h4 className="inline-block font-inter font-black text-sm text-brew-text mb-6 uppercase tracking-widest border-b-4 border-brew-text pb-1">
              Help & Support
            </h4>
            <ul className="list-none p-0 m-0 space-y-4">
              {["FAQ", "Terms of Service", "Privacy Policy", "Contact Us"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="font-inter font-bold text-base text-brew-text/70 hover:text-brew-text hover:underline decoration-4 underline-offset-4 no-underline transition-all"
                    >
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t-4 border-brew-text bg-brew-yellow py-6 text-center px-6">
        <p className="font-inter font-black text-sm text-brew-text uppercase tracking-wider">
          © {new Date().getFullYear()} BrewMe. All rights reserved. Made with
          Coffee and love.
        </p>
      </div>
    </footer>
  );
}

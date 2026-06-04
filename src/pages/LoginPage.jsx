import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Button from "../components/Button";
import Toast from "../components/Toast";
import { API_BASE, isAuthenticated, setToken } from "../lib/api";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Where to send the user after login: back to the page that bounced them
  // here, or the dashboard by default.
  const redirectTo = location.state?.from?.pathname || "/dashboard";

  // Already logged in? Skip the login form.
  useEffect(() => {
    if (isAuthenticated()) navigate(redirectTo, { replace: true });
  }, [navigate, redirectTo]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!form.email.trim() || !form.password) {
      setToast({ type: "error", message: "Enter your email and password." });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      let body = {};
      try {
        body = await res.json();
      } catch {
        // non-JSON error response (e.g. plain-text 500)
      }

      if (!res.ok || !body.token) {
        setToast({
          type: "error",
          message: body.message || body.error || "Invalid email or password.",
        });
        return;
      }

      setToken(body.token);
      setToast({ type: "success", message: "Login successful! Redirecting…" });
      setTimeout(() => navigate(redirectTo, { replace: true }), 800);
    } catch {
      setToast({
        type: "error",
        message: "Could not reach the server. Is the backend running?",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex bg-[#fffdf0]">
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center py-12 px-6 gap-12 md:gap-24">
        {/* Left Column: Typography Poster */}
        <div className="hidden md:flex flex-col justify-center w-1/2 animate-fade-up">
          <div className="inline-block mb-6 px-4 py-2 border-2 border-brew-text bg-brew-yellow font-inter font-bold text-sm rounded-full shadow-[3px_3px_0px_0px_currentColor] w-fit -rotate-2">
            Welcome Back
          </div>
          <h1 className="font-inter font-black text-6xl lg:text-7xl text-brew-text leading-[1.05] tracking-tighter uppercase mb-6">
            Time to <br />
            <span className="text-brew-yellow drop-shadow-[2px_2px_0px_#3E2723]">
              Brew.
            </span>
          </h1>
          <p className="font-inter font-bold text-xl text-brew-text/80 max-w-md">
            Log in to check your latest supporters, manage your page, and update
            your content.
          </p>
        </div>

        {/* Right Column: The Login Card */}
        <div className="w-full max-w-md md:w-1/2 animate-fade-up delay-100">
          <div className="md:hidden text-center mb-8">
            <h1 className="font-inter font-black text-4xl text-brew-text mb-2 uppercase tracking-tight">
              Log In
            </h1>
          </div>

          <div className="bg-white border-2 border-brew-text rounded-[32px] p-8 md:p-10 shadow-[12px_12px_0px_0px_currentColor]">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="login-email"
                  className="block font-inter font-black text-sm text-brew-text mb-2 uppercase tracking-wide"
                >
                  Email
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-[#fffdf0] border-2 border-brew-text rounded-2xl font-inter font-medium text-brew-text placeholder:text-brew-text/40 focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] focus:-translate-y-1 transition-all duration-200"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="login-password"
                    className="block font-inter font-black text-sm text-brew-text uppercase tracking-wide"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="font-inter font-bold text-xs text-brew-text/70 hover:text-brew-text hover:underline decoration-2 underline-offset-4 transition-all"
                  >
                    Forgot password?
                  </a>
                </div>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-[#fffdf0] border-2 border-brew-text rounded-2xl font-inter font-medium text-brew-text placeholder:text-brew-text/40 focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] focus:-translate-y-1 transition-all duration-200"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={submitting}
                className="flex w-full min-h-[60px] items-center justify-center gap-2 rounded-2xl border-2 border-brew-text bg-brew-yellow px-8 py-4 font-inter text-lg font-black text-brew-text shadow-[4px_4px_0px_0px_currentColor] transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_currentColor] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none mt-6 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0"
              >
                {submitting ? "Logging in…" : "Log in"}
                {!submitting && <ArrowRight size={20} strokeWidth={3} />}
              </Button>
            </form>

            <div className="mt-8 text-center pt-6 border-t-2 border-brew-text">
              <p className="font-inter font-bold text-sm text-brew-text">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-brew-text font-black hover:bg-brew-yellow px-2 py-1 -ml-1 rounded transition-colors no-underline"
                >
                  Sign up free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

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

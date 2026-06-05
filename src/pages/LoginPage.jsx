import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Button from "../components/Button";
import Toast from "../components/Toast";
import { API_BASE, isAuthenticated, setToken } from "../lib/api";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Login Form States
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Forgot Password / Recovery States
  const [forgotMode, setForgotMode] = useState(false);
  const [verificationMode, setVerificationMode] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [recoverySubmitting, setRecoverySubmitting] = useState(false);
  const [resetSubmitting, setResetSubmitting] = useState(false);

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

  const handleRecoverySubmit = async (e) => {
    e.preventDefault();
    if (recoverySubmitting) return;

    if (!recoveryEmail.trim()) {
      setToast({ type: "error", message: "Please enter your email address." });
      return;
    }

    setRecoverySubmitting(true);

    try {
      // Simulate API call for now — wire up to /auth/forgot-password later
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setToast({ 
        type: "success", 
        message: "Code sent! Please check your inbox." 
      });
      setVerificationMode(true);
    } catch {
      setToast({ type: "error", message: "Failed to send recovery email. Try again later." });
    } finally {
      setRecoverySubmitting(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (resetSubmitting) return;

    if (!recoveryCode.trim() || !newPassword || !confirmPassword) {
      setToast({ type: "error", message: "Please fill in all fields." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setToast({ type: "error", message: "Passwords do not match." });
      return;
    }

    setResetSubmitting(true);

    try {
      // Simulate API call — wire up to /auth/reset-password later
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setToast({ 
        type: "success", 
        message: "Password reset successful! You can now log in." 
      });
      
      // Reset all recovery states and return to login
      setForgotMode(false);
      setVerificationMode(false);
      setRecoveryEmail("");
      setRecoveryCode("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setToast({ type: "error", message: "Failed to reset password. Check your code and try again." });
    } finally {
      setResetSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex bg-[#fffdf0]">
      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center py-12 px-6 gap-12 md:gap-24">
        {/* Left Column: Typography Poster */}
        <div className="hidden md:flex flex-col justify-center w-1/2 animate-fade-up">
          <div className="inline-block mb-6 px-4 py-2 border-2 border-brew-text bg-brew-yellow font-inter font-bold text-sm rounded-full shadow-[3px_3px_0px_0px_currentColor] w-fit -rotate-2">
            {forgotMode ? (verificationMode ? "Reset Password" : "Security First") : "Welcome Back"}
          </div>
          <h1 className="font-inter font-black text-6xl lg:text-7xl text-brew-text leading-[1.05] tracking-tighter uppercase mb-6">
            {forgotMode ? (
              verificationMode ? (
                <>
                  New <br />
                  <span className="text-brew-yellow drop-shadow-[2px_2px_0px_#3E2723]">Begin.</span>
                </>
              ) : (
                <>
                  Let's <br />
                  <span className="text-brew-yellow drop-shadow-[2px_2px_0px_#3E2723]">Recover.</span>
                </>
              )
            ) : (
              <>
                Time to <br />
                <span className="text-brew-yellow drop-shadow-[2px_2px_0px_#3E2723]">Brew.</span>
              </>
            )}
          </h1>
          <p className="font-inter font-bold text-xl text-brew-text/80 max-w-md text-pretty">
            {forgotMode 
              ? (verificationMode 
                  ? "Almost there! Choose a strong new password and enter the secret code we sent you."
                  : "Don't worry, it happens to the best of us. Enter your email and we'll get you back into your kitchen.")
              : "Log in to check your latest supporters, manage your page, and update your content."
            }
          </p>
        </div>

        {/* Right Column: The Login/Forgot/Reset Card */}
        <div className="w-full max-w-md md:w-1/2 animate-fade-up delay-100">
          <div className="md:hidden text-center mb-8 text-brew-text">
            <h1 className="font-inter font-black text-4xl mb-2 uppercase tracking-tight">
              {forgotMode ? (verificationMode ? "Reset" : "Recover") : "Log In"}
            </h1>
          </div>

          <div className="bg-white border-2 border-brew-text rounded-[32px] p-8 md:p-10 shadow-[12px_12px_0px_0px_currentColor] text-brew-text">
            {!forgotMode ? (
              /* LOGIN FORM */
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="login-email"
                    className="block font-inter font-black text-sm mb-2 uppercase tracking-wide"
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
                      className="block font-inter font-black text-sm uppercase tracking-wide"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setForgotMode(true)}
                      className="font-inter font-bold text-xs text-brew-text/70 hover:text-brew-text hover:underline decoration-2 underline-offset-4 transition-all"
                    >
                      Forgot password?
                    </button>
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
            ) : !verificationMode ? (
              /* STEP 1: ENTER EMAIL FORM */
              <form className="space-y-6" onSubmit={handleRecoverySubmit}>
                <div>
                  <label
                    htmlFor="recovery-email"
                    className="block font-inter font-black text-sm mb-2 uppercase tracking-wide"
                  >
                    Email Address
                  </label>
                  <input
                    id="recovery-email"
                    name="recovery-email"
                    type="email"
                    placeholder="you@example.com"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    className="w-full px-4 py-4 bg-[#fffdf0] border-2 border-brew-text rounded-2xl font-inter font-medium text-brew-text placeholder:text-brew-text/40 focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] focus:-translate-y-1 transition-all duration-200"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={recoverySubmitting}
                  className="flex w-full min-h-[60px] items-center justify-center gap-2 rounded-2xl border-2 border-brew-text bg-brew-text text-white px-8 py-4 font-inter text-lg font-black shadow-[4px_4px_0px_0px_#F5C518] transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none mt-6 disabled:opacity-60"
                >
                  {recoverySubmitting ? "Sending…" : "Send Reset Link"}
                  {!recoverySubmitting && <ArrowRight size={20} strokeWidth={3} className="text-brew-yellow" />}
                </Button>

                <button
                  type="button"
                  onClick={() => setForgotMode(false)}
                  className="w-full text-center font-inter font-black text-xs text-brew-text/50 uppercase tracking-widest hover:text-brew-text transition-colors mt-4"
                >
                  Back to Login
                </button>
              </form>
            ) : (
              /* STEP 2: VERIFICATION & RESET FORM */
              <form className="space-y-6" onSubmit={handleResetSubmit}>
                <div>
                  <label
                    htmlFor="recovery-code"
                    className="block font-inter font-black text-sm mb-2 uppercase tracking-wide"
                  >
                    Reset Code
                  </label>
                  <input
                    id="recovery-code"
                    name="recovery-code"
                    type="text"
                    placeholder="Code from email"
                    value={recoveryCode}
                    onChange={(e) => setRecoveryCode(e.target.value)}
                    className="w-full px-4 py-4 bg-[#fffdf0] border-2 border-brew-text rounded-2xl font-inter font-black text-center tracking-[0.2em] text-brew-text placeholder:text-brew-text/20 focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] focus:-translate-y-1 transition-all duration-200 uppercase"
                  />
                </div>

                <div>
                  <label
                    htmlFor="new-password"
                    className="block font-inter font-black text-sm mb-2 uppercase tracking-wide"
                  >
                    New Password
                  </label>
                  <input
                    id="new-password"
                    name="new-password"
                    type="password"
                    placeholder="Min. 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-4 bg-[#fffdf0] border-2 border-brew-text rounded-2xl font-inter font-medium text-brew-text placeholder:text-brew-text/40 focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] focus:-translate-y-1 transition-all duration-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block font-inter font-black text-sm mb-2 uppercase tracking-wide"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-4 bg-[#fffdf0] border-2 border-brew-text rounded-2xl font-inter font-medium text-brew-text placeholder:text-brew-text/40 focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] focus:-translate-y-1 transition-all duration-200"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={resetSubmitting}
                  className="flex w-full min-h-[60px] items-center justify-center gap-2 rounded-2xl border-2 border-brew-text bg-brew-yellow px-8 py-4 font-inter text-lg font-black text-brew-text shadow-[4px_4px_0px_0px_currentColor] transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none mt-6 disabled:opacity-60"
                >
                  {resetSubmitting ? "Resetting…" : "Update Password"}
                  {!resetSubmitting && <ArrowRight size={20} strokeWidth={3} />}
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setVerificationMode(false);
                    setRecoveryCode("");
                  }}
                  className="w-full text-center font-inter font-black text-xs text-brew-text/50 uppercase tracking-widest hover:text-brew-text transition-colors mt-4"
                >
                  Back to Email
                </button>
              </form>
            )}

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

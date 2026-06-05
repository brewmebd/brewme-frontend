import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Toast from "../components/Toast";
import { API_BASE, getCategories } from "../lib/api";
import { ArrowRight, Check, X, Loader2 } from "lucide-react";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    url: "",
    bio: "",
    category: "",
  });
  const [categories, setCategories] = useState([]);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [urlStatus, setUrlStatus] = useState(null); // null, 'checking', 'available', 'taken', 'too-short'

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await getCategories();
        if (data.status && data.category) {
          setCategories(data.category);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCats();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
    const username = form.url.trim();
    if (!username) {
      setUrlStatus(null);
      return;
    }

    if (username.length < 3) {
      setUrlStatus("too-short");
      return;
    }

    const timer = setTimeout(async () => {
      setUrlStatus("checking");
      try {
        const res = await fetch(
          `${API_BASE}/auth/username-available?username=${username}`
        );
        if (res.ok) {
          const data = await res.json();
          // Only update if the current form URL still matches the checked username
          if (form.url.trim() === username) {
            setUrlStatus(data.available ? "available" : "taken");
          }
        } else {
          setUrlStatus(null);
        }
      } catch (err) {
        console.error("Error checking username:", err);
        setUrlStatus(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [form.url]);

  const handleAvatarChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setAvatarFile(null);
      setAvatarPreview("");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    // Quick client-side checks (the backend validates too).
    const clientErrors = {};
    if (!form.name.trim()) clientErrors.name = "Full name is required";
    if (!form.email.trim()) clientErrors.email = "Email is required";
    if (form.password.length < 8)
      clientErrors.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword)
      clientErrors.confirmPassword = "Passwords do not match";
    if (!form.url.trim()) clientErrors.url = "Page URL is required";
    if (!form.category) clientErrors.category = "Category is required";
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("email", form.email);
      data.append("password", form.password);
      data.append("confirmPassword", form.confirmPassword);
      data.append("url", form.url);
      data.append("bio", form.bio);
      data.append("category_id", form.category);
      if (avatarFile) data.append("avatar", avatarFile);

      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        body: data, // browser sets the multipart boundary automatically
      });

      let body = {};
      try {
        body = await res.json();
      } catch {
        // non-JSON error response (e.g. plain-text 500)
      }

      if (!res.ok) {
        if (body.fields) {
          setErrors(body.fields);
        }
        setToast({
          type: "error",
          message:
            body.error === "email already exists"
              ? "That email is already registered."
              : body.error === "invalid_category"
                ? "Please choose a valid category."
                : body.fields
                  ? "Please fix the highlighted fields."
                  : "Sign up failed. Please try again.",
        });
        return;
      }

      setToast({ type: "success", message: "Account created! Redirecting…" });
      setTimeout(() => navigate("/login"), 1200);
    } catch {
      setToast({
        type: "error",
        message: "Could not reach the server. Is the backend running?",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const strengthScore = (() => {
    const value = form.password;
    if (!value) return 0;
    let score = 0;
    if (value.length >= 8) score += 1;
    if (value.length >= 12) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/[0-9]/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;
    return Math.min(score, 4);
  })();

  const strengthLabel = ["Weak", "Fair", "Good", "Strong", "Excellent"][
    strengthScore
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-6 bg-brew-yellow-light">
      <div className="w-full max-w-md animate-fade-up">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-inter font-black text-3xl md:text-4xl text-brew-text mb-3 uppercase tracking-tight">
            Claim your page
          </h1>
          <p className="font-inter font-bold text-sm text-brew-text/70 uppercase tracking-widest">
            Start getting funded in minutes
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border-2 border-brew-text rounded-3xl p-8 shadow-[8px_8px_0px_0px_currentColor] mb-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Name Input */}
            <div>
              <label
                htmlFor="signup-name"
                className="block font-inter font-black text-sm text-brew-text mb-2 uppercase tracking-wide"
              >
                Full Name
              </label>
              <input
                id="signup-name"
                name="name"
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#fffdf0] border-2 border-brew-text rounded-xl font-inter font-medium text-brew-text placeholder:text-brew-text/40 focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] focus:-translate-y-px transition-all duration-200"
              />
              {errors.name && (
                <p className="mt-2 text-[11px] font-inter font-black text-red-500 uppercase tracking-widest">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="signup-email"
                className="block font-inter font-black text-sm text-brew-text mb-2 uppercase tracking-wide"
              >
                Email
              </label>
              <input
                id="signup-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#fffdf0] border-2 border-brew-text rounded-xl font-inter font-medium text-brew-text placeholder:text-brew-text/40 focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] focus:-translate-y-px transition-all duration-200"
              />
              {errors.email && (
                <p className="mt-2 text-[11px] font-inter font-black text-red-500 uppercase tracking-widest">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="signup-password"
                className="block font-inter font-black text-sm text-brew-text mb-2 uppercase tracking-wide"
              >
                Password
              </label>
              <input
                id="signup-password"
                name="password"
                type="password"
                placeholder="Min 8 characters"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#fffdf0] border-2 border-brew-text rounded-xl font-inter font-medium text-brew-text placeholder:text-brew-text/40 focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] focus:-translate-y-px transition-all duration-200"
              />
              <div className="mt-3">
                <div className="h-2 w-full rounded-full border-2 border-brew-text bg-white">
                  <div
                    className={`h-full rounded-full transition-all duration-200 ${
                      strengthScore <= 1
                        ? "bg-red-400"
                        : strengthScore === 2
                          ? "bg-brew-yellow"
                          : strengthScore === 3
                            ? "bg-green-400"
                            : "bg-green-500"
                    }`}
                    style={{ width: `${(strengthScore / 4) * 100}%` }}
                  />
                </div>
                <p className="mt-2 text-[11px] font-inter font-black text-brew-text/60 uppercase tracking-widest">
                  Strength: {strengthLabel}
                </p>
              </div>
              {errors.password && (
                <p className="mt-2 text-[11px] font-inter font-black text-red-500 uppercase tracking-widest">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="signup-confirm-password"
                className="block font-inter font-black text-sm text-brew-text mb-2 uppercase tracking-wide"
              >
                Confirm Password
              </label>
              <input
                id="signup-confirm-password"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#fffdf0] border-2 border-brew-text rounded-xl font-inter font-medium text-brew-text placeholder:text-brew-text/40 focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] focus:-translate-y-px transition-all duration-200"
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-[11px] font-inter font-black text-red-500 uppercase tracking-widest">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Custom URL Input Group */}
            <div>
              <label
                htmlFor="signup-url"
                className="block font-inter font-black text-sm text-brew-text mb-2 uppercase tracking-wide"
              >
                Your Page URL
              </label>
              <div className="flex items-stretch border-2 border-brew-text rounded-xl overflow-hidden focus-within:shadow-[4px_4px_0px_0px_currentColor] focus-within:-translate-y-px transition-all duration-200 bg-[#fffdf0]">
                <span className="flex items-center px-4 py-3 bg-brew-yellow border-r-2 border-brew-text font-inter font-black text-brew-text text-sm sm:text-base tracking-tight shrink-0">
                  brewme.com/
                </span>
                <input
                  id="signup-url"
                  name="url"
                  type="text"
                  placeholder="username"
                  value={form.url}
                  onChange={handleChange}
                  className="flex-1 w-full min-w-0 px-3 py-3 bg-transparent font-inter font-black text-brew-text outline-none placeholder:text-brew-text/30 placeholder:font-medium"
                />
                <div className="flex items-center pr-3">
                  {urlStatus === "checking" && (
                    <Loader2 className="h-5 w-5 animate-spin text-brew-text/40" />
                  )}
                  {urlStatus === "available" && (
                    <Check className="h-5 w-5 text-green-500" />
                  )}
                  {urlStatus === "taken" && <X className="h-5 w-5 text-red-500" />}
                </div>
              </div>
              {urlStatus === "available" && (
                <p className="mt-2 text-[11px] font-inter font-black text-green-600 uppercase tracking-widest">
                  Username is available!
                </p>
              )}
              {urlStatus === "taken" && (
                <p className="mt-2 text-[11px] font-inter font-black text-red-500 uppercase tracking-widest">
                  Username is already taken.
                </p>
              )}
              {urlStatus === "too-short" && (
                <p className="mt-2 text-[11px] font-inter font-black text-brew-text/40 uppercase tracking-widest">
                  Must be at least 3 characters.
                </p>
              )}
              {errors.url && (
                <p className="mt-2 text-[11px] font-inter font-black text-red-500 uppercase tracking-widest">
                  {errors.url}
                </p>
              )}
            </div>

            {/* Avatar Upload */}
            <div>
              <label
                htmlFor="signup-avatar"
                className="block font-inter font-black text-sm text-brew-text mb-2 uppercase tracking-wide"
              >
                Avatar
              </label>
              <div className="flex items-center gap-4 rounded-2xl border-2 border-brew-text bg-[#fffdf0] p-4 shadow-[4px_4px_0px_0px_currentColor]">
                <div className="h-20 w-20 rounded-full border-2 border-brew-text bg-white overflow-hidden">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[10px] font-inter font-black text-brew-text/40 uppercase tracking-widest">
                      No
                      <br />
                      Photo
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="signup-avatar"
                    className="inline-flex items-center justify-center rounded-full border-2 border-brew-text bg-brew-yellow px-4 py-2 text-xs font-inter font-black text-brew-text shadow-[2px_2px_0px_0px_currentColor] transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_currentColor]"
                  >
                    Upload photo
                  </label>
                  <input
                    id="signup-avatar"
                    name="avatar"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/gif"
                    onChange={handleAvatarChange}
                    className="sr-only"
                  />
                  <p className="mt-2 text-[11px] font-inter font-bold text-brew-text/60 uppercase tracking-widest">
                    Square JPG/PNG, 2MB max
                  </p>
                </div>
              </div>
            </div>

            {/* Bio Input */}
            <div>
              <label
                htmlFor="signup-bio"
                className="block font-inter font-black text-sm text-brew-text mb-2 uppercase tracking-wide"
              >
                Bio
              </label>
              <textarea
                id="signup-bio"
                name="bio"
                rows={4}
                placeholder="Tell supporters what you create"
                value={form.bio}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#fffdf0] border-2 border-brew-text rounded-xl font-inter font-medium text-brew-text placeholder:text-brew-text/40 focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] focus:-translate-y-px transition-all duration-200"
              />
            </div>

            {/* Category Select */}
            <div>
              <label
                htmlFor="signup-category"
                className="block font-inter font-black text-sm text-brew-text mb-2 uppercase tracking-wide"
              >
                Category
              </label>
              <select
                id="signup-category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#fffdf0] border-2 border-brew-text rounded-xl font-inter font-medium text-brew-text focus:outline-none focus:shadow-[4px_4px_0px_0px_currentColor] focus:-translate-y-px transition-all duration-200"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-2 text-[11px] font-inter font-black text-red-500 uppercase tracking-widest">
                  {errors.category}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={submitting || urlStatus === "checking" || urlStatus === "taken" || urlStatus === "too-short"}
              className="flex w-full min-h-[56px] items-center justify-center gap-2 rounded-xl border-2 border-brew-text bg-brew-yellow px-8 py-4 font-inter text-lg font-black text-brew-text shadow-[4px_4px_0px_0px_currentColor] transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_currentColor] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none mt-6 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0"
            >
              {submitting ? "Creating…" : "Create your page"}
              {!submitting && <ArrowRight size={20} strokeWidth={3} />}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center pt-6 border-t-4 border-dashed border-brew-text/10">
            <p className="font-inter font-bold text-sm text-brew-text/80">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-brew-text font-black hover:bg-brew-yellow px-2 py-1 -ml-1 rounded transition-colors no-underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center font-inter font-bold text-xs text-brew-text/60 uppercase tracking-widest max-w-xs mx-auto">
          By signing up, you agree to our Terms & Privacy Policy.
        </p>
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

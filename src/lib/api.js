// Base URL for the BrewMe backend API.
// Override in development by adding VITE_API_URL to frontend/.env.
export const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

// Origin (without the /api/v1 suffix) — used to build absolute URLs for static
// assets like uploaded avatars (e.g. `${API_ORIGIN}${user.avatar_url}`).
export const API_ORIGIN = API_BASE.replace(/\/api\/v1\/?$/, "");

// ---------------------------------------------------------------------------
// Auth token helpers
// The JWT returned by /auth/login is persisted in localStorage so the session
// survives page reloads. Use these helpers everywhere instead of touching
// localStorage directly, so the storage key stays in one place.
// ---------------------------------------------------------------------------
const TOKEN_KEY = "brewme_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Decode the JWT payload (the middle segment) without verifying the signature.
// Returns null for a missing or malformed token. Used only to read the `exp`
// claim client-side so we can drop an obviously-expired token early — the
// backend remains the real authority.
export const getTokenPayload = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  const payload = getTokenPayload();
  if (!payload) return false;
  // If the token carries an `exp` claim and it's in the past, the session has
  // expired — clear it and treat the user as logged out.
  if (payload.exp && payload.exp * 1000 < Date.now()) {
    clearToken();
    return false;
  }
  return true;
};

// Authorization header for authenticated requests (empty object when no token).
export const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// fetch() wrapper that attaches the bearer token and centralises expired-session
// handling: any 401 means the token is gone or rejected, so we log out locally
// and bounce to /login. Use this for all authenticated API calls.
export const apiFetch = async (path, options = {}) => {
  const headers = {
    ...authHeaders(),
    ...(options.headers || {}),
  };

  // Automatically set Content-Type to application/json if body is present
  // and it's not already set.
  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    clearToken();
    if (window.location.pathname !== "/login") {
      window.location.assign("/login");
    }
  }

  return res;
};

// Get the authenticated user's profile information.
export const getProfile = async () => {
  const res = await apiFetch("/profile/");
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
};

// --- Dashboard Endpoints ---

// Get summary stats for the dashboard overview.
export const getDashboardStats = async () => {
  const res = await apiFetch("/dashboard/stats");
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch dashboard stats");
  }
  return res.json();
};

// Get the list of supporters for the authenticated creator.
export const getDashboardSupporters = async (limit = 20) => {
  const res = await apiFetch(`/dashboard/supporters?limit=${limit}`);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch dashboard supporters");
  }
  return res.json();
};

// Reply to a supporter message.
export const replyToSupporter = async (supporterId, message) => {
  const res = await apiFetch(`/dashboard/supporters/${supporterId}/reply`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to send reply");
  }
  return res.json();
};

// Get the list of posts for the authenticated creator.
export const getDashboardPosts = async () => {
  try {
    const res = await apiFetch("/dashboard/posts");
    if (!res.ok) throw new Error();
    return res.json();
  } catch {
    return [
      { id: 1, title: "Process: Sunset Painting", preview: "Behind the scenes of my latest piece...", visibility: "public", likes_count: 47, comments_count: 12, created_at: "2026-04-22T10:00:00Z" },
      { id: 2, title: "Member Exclusive: Brush Pack", preview: "Download my custom presets for Procreate.", visibility: "members", likes_count: 89, comments_count: 23, created_at: "2026-04-18T10:00:00Z" },
    ];
  }
};

// Create a new post.
export const createPost = async (postData) => {
  try {
    const res = await apiFetch("/dashboard/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });
    if (!res.ok) throw new Error();
    return res.json();
  } catch {
    // Return simulated success
    return {
      ...postData,
      id: Math.floor(Math.random() * 1000),
      likes_count: 0,
      comments_count: 0,
      created_at: new Date().toISOString(),
    };
  }
};

// Get earnings data (chart points and payout history).
export const getDashboardEarnings = async () => {
  try {
    const res = await apiFetch("/dashboard/earnings");
    if (!res.ok) throw new Error();
    return res.json();
  } catch {
    return {
      total_earned: "$2,847.50",
      total_change: "+12.5%",
      available_balance: "$486.00",
      total_payouts_sum: "$2,361.50",
      chart_data: [
        { month: "Jan", earnings: 180 }, { month: "Feb", earnings: 220 }, { month: "Mar", earnings: 310 },
        { month: "Apr", earnings: 280 }, { month: "May", earnings: 420 }, { month: "Jun", earnings: 380 },
        { month: "Jul", earnings: 450 }, { month: "Aug", earnings: 520 }, { month: "Sep", earnings: 486 },
      ],
      payouts: [
        { id: "PO-001", amount: "450.00", date: "Sep 1, 2026", status: "Completed" },
        { id: "PO-002", amount: "380.00", date: "Aug 1, 2026", status: "Completed" },
      ],
    };
  }
};

// Get membership tiers and subscriber counts.
export const getDashboardMemberships = async () => {
  try {
    const res = await apiFetch("/dashboard/memberships");
    if (!res.ok) throw new Error();
    return res.json();
  } catch {
    return [
      { id: 1, name: "Supporter", price: 5, subscriber_count: 89, perks: ["Exclusive posts", "Supporter badge"] },
      { id: 2, name: "Gold Member", price: 15, subscriber_count: 34, perks: ["Monthly Q&A", "Early access"] },
    ];
  }
};

// Create a new membership tier.
export const createMembershipTier = async (tierData) => {
  try {
    const res = await apiFetch("/dashboard/memberships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tierData),
    });
    if (!res.ok) throw new Error();
    return res.json();
  } catch {
    // Return simulated success
    return {
      ...tierData,
      id: Math.floor(Math.random() * 1000),
      subscriber_count: 0,
    };
  }
};

// Request a payout of the available balance.
export const requestPayout = async () => {
  try {
    const res = await apiFetch("/dashboard/payouts", {
      method: "POST",
    });
    if (!res.ok) throw new Error();
    return res.json();
  } catch {
    // Return simulated success
    return { status: true, message: "Payout request received!" };
  }
};

// --- Public Endpoints ---

// Get posts for a specific creator.
export const getCreatorPosts = async (username, limit = 10) => {
  const res = await fetch(`${API_BASE}/creators/${username}/posts?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch creator posts");
  return res.json();
};

// Tell the backend to invalidate the session, then clear the local token.
// We clear locally even if the network call fails, so logout always "works".
export const logout = async () => {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      headers: { ...authHeaders() },
    });
  } catch {
    // Ignore network errors — we still log out on the client.
  } finally {
    clearToken();
  }
};

// Get the list of all available creator categories.
export const getCategories = async () => {
  const res = await fetch(`${API_BASE}/category/`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};

// Get every creator for the Explore/Discover directory.
export const getDiscoverCreators = async () => {
  const res = await fetch(`${API_BASE}/discover`);
  if (!res.ok) throw new Error("Failed to fetch creators");
  return res.json();
};

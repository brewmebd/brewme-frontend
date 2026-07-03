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

  // Automatically set Content-Type to application/json if body is present and
  // it's not already set. Skip FormData — the browser must set the multipart
  // boundary itself, so we leave Content-Type unset for it.
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers["Content-Type"]
  ) {
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
// Uses /supporters-list (not /supporters): only that endpoint returns the raw
// `id`, real `support_replied`, and `creator_reply` fields the Supporters page
// needs to reply, filter, and render replies. /supporters is the thin feed.
export const getDashboardSupporters = async (limit = 20) => {
  const res = await apiFetch(`/dashboard/supporters-list?limit=${limit}`);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch dashboard supporters");
  }
  return res.json();
};

// Reply to a supporter message. `type` ("coffee" | "membership") selects which
// table the reply is stored in, since donations and memberships share id spaces.
export const replyToSupporter = async (
  supporterId,
  message,
  type = "coffee",
) => {
  const res = await apiFetch(
    `/dashboard/supporters/${supporterId}/reply?type=${type}`,
    {
      method: "POST",
      body: JSON.stringify({ message }),
    },
  );
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to send reply");
  }
  return res.json();
};

// Get the list of posts for the authenticated creator.
export const getDashboardPosts = async () => {
  const res = await apiFetch("/dashboard/posts");
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch posts");
  }
  return res.json();
};

// Create a new post. Accepts a FormData (title, preview, membersOnly,
// visibility, and an optional `image` file). Returns the created post.
export const createPost = async (formData) => {
  const res = await apiFetch("/dashboard/posts", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Failed to create post");
  }
  return res.json();
};

// Update an existing post. Accepts a FormData (same fields as createPost, plus
// an optional `removeImage=true` to clear the current image). Returns the post.
export const updatePost = async (id, formData) => {
  const res = await apiFetch(`/dashboard/posts/${id}`, {
    method: "PUT",
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Failed to update post");
  }
  return res.json();
};

// Delete a post by id.
export const deletePost = async (id) => {
  const res = await apiFetch(`/dashboard/posts/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Failed to delete post");
  }
  return res.json();
};

// Get earnings data (totals, chart points, and payout history).
export const getDashboardEarnings = async () => {
  const res = await apiFetch("/dashboard/earnings");
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch earnings");
  }
  return res.json();
};

// Get membership tiers and subscriber counts.
export const getDashboardMemberships = async () => {
  try {
    const res = await apiFetch("/dashboard/memberships");
    if (!res.ok) throw new Error();
    return res.json();
  } catch {
    return [
      {
        id: 1,
        name: "Supporter",
        price: 5,
        subscriber_count: 89,
        perks: ["Exclusive posts", "Supporter badge"],
      },
      {
        id: 2,
        name: "Gold Member",
        price: 15,
        subscriber_count: 34,
        perks: ["Monthly Q&A", "Early access"],
      },
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

// Request a payout. Takes { amount, method }.
export const requestPayout = async ({ amount, method }) => {
  const res = await apiFetch("/dashboard/payouts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: Number(amount), method }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Failed to request payout");
  }
  return res.json();
};

// Start the public checkout flow for a creator donation.
export const createDonationCheckout = async (username, donationData) => {
  const res = await fetch(`${API_BASE}/creators/${username}/donations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(donationData),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || error.error || "Failed to start checkout");
  }
  return res.json();
};

// Start the public checkout flow for a creator membership subscription.
export const createMembershipCheckout = async (username, membershipData) => {
  const res = await apiFetch(`/creators/${username}/memberships`, {
    method: "POST",
    body: JSON.stringify(membershipData),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || error.error || "Failed to start membership checkout");
  }
  return res.json();
};

// --- Public Endpoints ---

// Get posts for a specific creator.
export const getCreatorPosts = async (username, limit = 10) => {
  const res = await apiFetch(`/creators/${username}/posts?limit=${limit}`);
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

// Get the dashboard settings bootstrap payload.
export const getDashboardSettings = async () => {
  const res = await apiFetch("/dashboard/settings");
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch dashboard settings");
  }
  return res.json();
};

// Update the creator profile fields shown on Settings.
export const updateDashboardProfile = async (profileData) => {
  const res = await apiFetch("/dashboard/settings/profile", {
    method: "PATCH",
    body: JSON.stringify(profileData),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to save profile settings");
  }
  return res.json();
};

// Upload a new profile avatar and return the stored URL.
export const updateDashboardAvatar = async (avatarFile) => {
  const formData = new FormData();
  formData.append("avatar", avatarFile);

  const res = await apiFetch("/dashboard/settings/avatar", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Failed to upload avatar");
  }
  return res.json();
};

// Update notification preferences.
export const updateDashboardNotifications = async (notifications) => {
  const res = await apiFetch("/dashboard/settings/notifications", {
    method: "PATCH",
    body: JSON.stringify(notifications),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to save notification settings");
  }
  return res.json();
};

// Update the active funding goal.
export const updateDashboardGoal = async (goal) => {
  const res = await apiFetch("/dashboard/settings/goal", {
    method: "PUT",
    body: JSON.stringify(goal),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to save goal settings");
  }
  return res.json();
};

// Get the connected Stripe payout account summary.
export const getDashboardStripeStatus = async () => {
  const res = await apiFetch("/dashboard/settings/stripe/status");
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to fetch Stripe status");
  }
  return res.json();
};

// Create or refresh the creator's Stripe Express onboarding / management link.
export const createStripeConnectLink = async () => {
  const res = await apiFetch("/dashboard/settings/stripe/connect", {
    method: "POST",
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to open Stripe onboarding");
  }
  return res.json();
};

// Update a membership tier.
export const updateMembershipTier = async (tierId, tierData) => {
  const res = await apiFetch(`/dashboard/memberships/${tierId}`, {
    method: "PUT",
    body: JSON.stringify(tierData),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to update tier");
  }
  return res.json();
};

// Archive a membership tier.
export const deleteMembershipTier = async (tierId) => {
  const res = await apiFetch(`/dashboard/memberships/${tierId}`, {
    method: "DELETE",
  });
  if (!res.ok && res.status !== 204) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to archive tier");
  }
  return true;
};

// Request an email change verification code.
export const requestEmailChange = async (newEmail) => {
  const res = await apiFetch("/dashboard/settings/email/request-change", {
    method: "POST",
    body: JSON.stringify({ new_email: newEmail }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || error.message || "Failed to request email change");
  }
  return res.json();
};

// Verify an email change code.
export const verifyEmailChange = async (code) => {
  const res = await apiFetch("/dashboard/settings/email/verify-change", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || error.message || "Failed to verify email change");
  }
  return res.json();
};

// Get every creator for the Explore/Discover directory.
export const getDiscoverCreators = async () => {
  const res = await fetch(`${API_BASE}/discover`);
  if (!res.ok) throw new Error("Failed to fetch creators");
  return res.json();
};

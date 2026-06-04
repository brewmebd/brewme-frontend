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
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  });

  if (res.status === 401) {
    clearToken();
    if (window.location.pathname !== "/login") {
      window.location.assign("/login");
    }
  }

  return res;
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

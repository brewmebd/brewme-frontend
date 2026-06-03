// Base URL for the BrewMe backend API.
// Override in development by adding VITE_API_URL to frontend/.env.
export const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

// Origin (without the /api/v1 suffix) — used to build absolute URLs for static
// assets like uploaded avatars (e.g. `${API_ORIGIN}${user.avatar_url}`).
export const API_ORIGIN = API_BASE.replace(/\/api\/v1\/?$/, "");

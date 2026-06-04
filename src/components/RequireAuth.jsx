import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "../lib/api";

// Route guard for the dashboard. If there's no token in localStorage, the user
// is bounced to /login (remembering where they were headed so we can send them
// back after a successful login).
export default function RequireAuth() {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

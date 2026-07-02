import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import DashboardLayout from "./components/DashboardLayout";
import RequireAuth from "./components/RequireAuth";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ExplorePage from "./pages/ExplorePage";
import SupportSuccessPage from "./pages/SupportSuccessPage";
import CreatorProfilePage from "./pages/CreatorProfilePage";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import DashboardSupporters from "./pages/dashboard/DashboardSupporters";
import DashboardEarnings from "./pages/dashboard/DashboardEarnings";
import DashboardPosts from "./pages/dashboard/DashboardPosts";
import DashboardMemberships from "./pages/dashboard/DashboardMemberships";
import DashboardSettings from "./pages/dashboard/DashboardSettings";
import DashboardShare from "./pages/dashboard/DashboardShare";
import NotFoundPage from "./pages/NotFoundPage";
import Game from "./pages/dashboard/Game";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/success" element={<SupportSuccessPage />} />
        <Route path="/:username" element={<CreatorProfilePage />} />
        <Route path="/game" element={<Game />} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="supporters" element={<DashboardSupporters />} />
          <Route path="earnings" element={<DashboardEarnings />} />
          <Route path="posts" element={<DashboardPosts />} />
          <Route path="memberships" element={<DashboardMemberships />} />
          <Route path="settings" element={<DashboardSettings />} />
          <Route path="share" element={<DashboardShare />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;

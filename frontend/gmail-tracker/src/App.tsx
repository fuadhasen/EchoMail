import { Navigate, Route, Routes } from "react-router";
import Analytics from "./pages/Analytics";
import EmailDetail from "./pages/EmailDetail";
import Home from "./pages/Home";
import Layout from "./components/layout/Layout";
import LoginWithHandler from "./pages/login";
import Settings from "./pages/Settings";
import TrackedEmails from "./pages/TrackedEmail";
import TrackNew from "./pages/TrackNew";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginWithHandler />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="tracked/detail/:id" element={<EmailDetail />} />
        <Route path="tracked" element={<TrackedEmails />} />
        <Route path="track_new" element={<TrackNew />} />
        <Route path="settings" element={<Settings />} />
        <Route path="analytics" element={<Analytics />} />

        {/* Fallback route: redirect back to Dashboared / Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default App;

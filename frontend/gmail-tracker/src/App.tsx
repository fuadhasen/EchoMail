import { Navigate, Route, Routes } from "react-router";
import Layout from "./components/Layout";
import AuthGuard from "./guards/AuthGuard";
import Automation from "./pages/Automation";
import EmailDetail from "./pages/EmailDetail";
import Home from "./pages/Home";
import LoginWithHandler from "./pages/login";
import Settings from "./pages/Settings";
import TrackedEmails from "./pages/TrackedEmail";
import TrackNew from "./pages/TrackNew";
import useEchomailWebSocket from "./hooks/useEchomailWebSocket";

const App = () => {
  useEchomailWebSocket();

  return (
    <Routes>
      <Route path="/login" element={<LoginWithHandler />} />
      <Route
        path="/"
        element={
          <AuthGuard>
            <Layout />
          </AuthGuard>
        }
      >
        <Route index element={<Home />} />
        <Route path="tracked/detail/:id" element={<EmailDetail />} />
        <Route path="tracked" element={<TrackedEmails />} />
        <Route path="track_new" element={<TrackNew />} />
        <Route path="settings" element={<Settings />} />
        <Route path="automation" element={<Automation />} />

        {/* Fallback route: redirect back to Dashboared / Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default App;

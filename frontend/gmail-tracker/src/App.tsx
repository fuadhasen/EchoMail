import { Route, Routes } from "react-router";
import Analytics from "./components/Analytics";
import EmailDetail from "./components/EmailDetail";
import Home from "./components/Home";
import Layout from "./components/Layout";
import LoginWithHandler from "./components/login";
import SentEmail from "./components/SentEmail";
import Settings from "./components/Settings";
import TrackedEmails from "./components/TrackedEmail";
import TrackNew from "./components/TrackNew";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginWithHandler />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="tracked/detail/:id" element={<EmailDetail />} />
        <Route path="tracked" element={<TrackedEmails />} />
        <Route path="sent_emails" element={<SentEmail />} />
        <Route path="track_new" element={<TrackNew />} />
        <Route path="settings" element={<Settings />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>
    </Routes>
  );
};

export default App;

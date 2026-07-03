import React from "react";
import { Route, Routes } from "react-router";
import Analytics from "./components/Analytics";
import EmailDetail from "./components/EmailDetail";
import LoginWithHandler from "./components/login";
import Recipients from "./components/Recipients";
import Reminders from "./components/Reminders";
import SentEmail from "./components/SentEmail";
import TrackedEmail from "./components/TrackedEmail";
import TrackNew from "./components/TrackNew";
import Layout from "./components/Layout";
import Settings from "./components/Settings";
import Home from "./components/Home";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginWithHandler />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="tracked/detail" element={<EmailDetail />} />
        <Route path="tracked" element={<TrackedEmail />} />
        <Route path="sent_emails" element={<SentEmail />} />
        <Route path="track_new" element={<TrackNew />} />
        <Route path="reminders" element={<Reminders />} />
        <Route path="settings" element={<Settings />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="recipients" element={<Recipients />} />
      </Route>
    </Routes>
  );
};

export default App;

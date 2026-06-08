import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Reminders from "./components/Reminders.tsx";
import Response from "./components/Response.tsx";
import SentEmail from "./components/SentEmail.tsx";
import TrackedEmail from "./components/TrackedEmail.tsx";
import Layout from "./components/Layout.tsx";
import Home from "./components/Home.tsx";
import TrackNew from "./components/TrackNew.tsx";
import LoginWithHandler from "./components/login.tsx";
import "@radix-ui/themes/styles.css";
import "./index.css";
import { Theme } from "@radix-ui/themes";
import EmailDetail from "./components/EmailDetail.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Theme appearance="light">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginWithHandler />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="tracked/detail" element={<EmailDetail />} />
              <Route path="tracked" element={<TrackedEmail />} />
              <Route path="sent_emails" element={<SentEmail />} />
              <Route path="response" element={<Response />} />
              <Route path="track_new" element={<TrackNew />} />
              <Route path="reminders" element={<Reminders />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Theme>
    </QueryClientProvider>
  </StrictMode>,
);

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import App from "./App.tsx";
import { ToastProvider } from "./context/ToastContext.tsx";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Theme appearance="light">
        <BrowserRouter>
          <ToastProvider>
            <App />
          </ToastProvider>
        </BrowserRouter>
      </Theme>
    </QueryClientProvider>
  </StrictMode>,
);

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const useEchomailWebSocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
    let shouldReconnect = true;

    const connect = () => {
      console.log("Connecting to EchoMail WebSocket...");

      const wsUrl = import.meta.env.VITE_API_URL.replace(/^http/, "ws");

      socket = new WebSocket(`${wsUrl}/ws`);

      socket.onopen = () => {
        console.log("EchoMail WebSocket connected");
      };

      socket.onmessage = async (event) => {
        const data = JSON.parse(event.data);

        console.log("WebSocket event:", data);

        if (data.type === "response_detected") {
          // Keep your React Query data synchronized, using database id
          queryClient.invalidateQueries({
            queryKey: ["tracked-emails", data.tracked_email_id],
          });

          // Browser notification
          if (Notification.permission === "default") {
            await Notification.requestPermission();
          }

          if (Notification.permission === "granted") {
            new Notification("EchoMail — New Response", {
              body: `${data.recipient_email} responded to "${data.subject}"`,
            });
          }
        }

        if (data.type === "tracking_completed") {
          queryClient.invalidateQueries({
            queryKey: ["tracked-emails", data.tracked_email_id],
          });

          if (Notification.permission === "default") {
            await Notification.requestPermission();
          }

          if (Notification.permission === "granted") {
            new Notification("EchoMail — Tracking Complete", {
              body: `Everyone has responded to "${data.subject}".`,
            });
          }
        }
      };

      socket.onerror = (error) => {
        console.error(" EchoMail WebSocket error:", error);
      };

      socket.onclose = (event) => {
        console.log(
          "WebSocket disconnected",
          "code:",
          event.code,
          "reason:",
          event.reason,
        );

        if (!shouldReconnect) {
          return;
        }

        console.log("Reconnecting in 3 seconds...");

        reconnectTimeout = setTimeout(() => {
          connect();
        }, 3000);
      };
    };

    // Initial connection
    // connect();

    // Cleanup
    return () => {
      shouldReconnect = false;

      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }

      if (socket) {
        socket.close();
      }
    };
  }, [queryClient]);
};

export default useEchomailWebSocket;

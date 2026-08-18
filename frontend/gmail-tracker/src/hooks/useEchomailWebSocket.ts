import React, { useEffect } from "react";

const useEchomailWebSocket = () => {
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws");

    socket.onopen = () => {
      console.log("Echomail web socket connected");
    };

    socket.onmessage = async (event) => {
      console.log("everything is fine");
      const data = JSON.parse(event.data);

      console.log("Web socket event", data);

      if (data.type === "response_detected") {
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

    socket.onclose = () => {
      console.log("Echomail web socket disconnected");
    };

    socket.onerror = (error) => {
      console.error("EchoMail WebSocket error:", error);
    };

    return () => {
      // socket.onclose();
    };
  }, []);
};

export default useEchomailWebSocket;

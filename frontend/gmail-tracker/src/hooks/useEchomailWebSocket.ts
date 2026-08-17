import React, { useEffect } from "react";

const useEchomailWebSocket = () => {
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws");

    socket.onopen = () => {
      console.log("Echomail web socket connected");
    };

    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      console.log(data.message);

      if (data.type === "test") {
        if (Notification.permission === "default") {
          await Notification.requestPermission();
        }

        if (Notification.permission === "granted") {
          new Notification("Echomail", { body: data.message });
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

import { Outlet } from "react-router";
// import NavBar from "./NavBar";
import useEchomailWebSocket from "@/hooks/useEchomailWebSocket";
import { getSettings } from "@/services/settings";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ToastContainer from "./common/ToastContainer";
import SideBar from "./SideBar";

const Layout = () => {
  // websocket connection for authenticated users only
  const [notifyOnResponse, setNotifyOnResponse] = useState(true);
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });

  // database is the only source of truth
  useEffect(() => {
    if (settings) {
      setNotifyOnResponse(settings.notify_on_response);
    }
  }, [settings]);

  useEchomailWebSocket(notifyOnResponse);

  return (
    <>
      <div className="flex flex-col md:flex-row h-screen bg-[#f8f9ff]">
        <SideBar />
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto scrollbar-none  p-5 md:p-8 relative">
          <Outlet />
          <ToastContainer />
        </main>
      </div>
    </>
  );
};

export default Layout;

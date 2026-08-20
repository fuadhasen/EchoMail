import { Outlet } from "react-router";
// import NavBar from "./NavBar";
import ToastContainer from "./common/ToastContainer";
import SideBar from "./SideBar";
import useEchomailWebSocket from "@/hooks/useEchomailWebSocket";

const Layout = () => {
  // websocket connection for authenticated users only
  useEchomailWebSocket();

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

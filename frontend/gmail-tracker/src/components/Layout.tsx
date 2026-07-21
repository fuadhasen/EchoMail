import { Outlet } from "react-router";
// import NavBar from "./NavBar";
import useAuth from "@/hooks/useAuth";
import ToastContainer from "./common/ToastContainer";
import SideBar from "./SideBar";

const Layout = () => {
  const { error } = useAuth();

  if (error) return <p className="m-10 p-4 bg-red-100">{error.message}</p>;

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

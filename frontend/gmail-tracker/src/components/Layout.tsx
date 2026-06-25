import {
  LayoutDashboard,
  Mail,
  Search,
  Bell,
  BarChart3,
  Star,
  Reply,
  Tag,
} from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
// import NavBar from "./NavBar";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";
import NavBar from "./NavBar";
import SideBar from "./SideBar";

const Layout = () => {
  const location = useLocation();
  // const navigate = useNavigate();

  // const { status, error } = useAuth();

  // useEffect(() => {
  //   if (status == "unauthenticated") {
  //     navigate("/login");
  // //   }
  // // }, [status, navigate]);

  // if (error) return <p className="m-10 p-4 bg-red-100">{error.message}</p>;

  // Email
  const LinkMaps = [
    {
      path: "/",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    { path: "/tracked", label: "Tracked", icon: <Mail size={18} /> },
    {
      path: "/sent_emails",
      label: "search sent emails",
      icon: <Search size={18} />,
    },
    { path: "/reminders", label: "Reminder", icon: <Bell size={18} /> },
    {
      path: "/responses",
      label: "Responses",
      icon: <Reply size={18} />,
    },
    { path: "/analytics", label: "Analytics", icon: <BarChart3 size={18} /> },
    {
      path: "/labels",
      label: "Labels",
      icon: <Tag size={18} />,
    },
    {
      path: "/important",
      label: "Important",
      icon: <Star size={18} />,
    },
  ];

  return (
    <>
      {"authenticated" == "authenticated" && (
        <div className="flex h-screen font-sans bg-[#f8f9ff]">
          {/* Modernized Sidebar */}
          <SideBar />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-[#f8f9ff]">
            <section className="">
              {/* <NavBar /> */}
              <Outlet />
            </section>
          </main>
        </div>
      )}
    </>
  );
};

export default Layout;

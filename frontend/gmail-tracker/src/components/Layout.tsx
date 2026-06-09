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
        <div className="flex h-screen bg-slate-50">
          <aside className="w-96 bg-slate-950 text-slate-200 border-r border-slate-800 flex flex-col">
            <div className="h-20 flex items-center px-6 border-b border-slate-800">
              <h1 className="text-xl font-bold text-white">EchoMail</h1>
            </div>
            <nav className="flex-1 px-4 py-6">
              <ul className="space-y-1">
                {LinkMaps.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={` flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${active ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:bg-slate-900 hover:text-white"} `}
                      >
                        {item.icon} <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* {profile section} */}
            <div className="border-t border-slate-800 p-4">
              <div className="flex items-center gap-3 rounded-xl bg-slate-900 p-3">
                <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center">
                  F
                </div>
                <div>
                  <p className="text-sm font-medium"> Fuad </p>
                  <p className="text-xs text-slate-400"> Software Engineer </p>
                </div>
              </div>
            </div>
          </aside>
          <main className="flex-1 overflow-y-auto">
            <section>
              <Outlet />
            </section>
          </main>
        </div>
      )}
    </>
  );
};

export default Layout;

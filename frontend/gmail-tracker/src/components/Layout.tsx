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
        <div className="flex h-screen bg-zinc-50 text-zinc-900 font-sans">
          {/* Modernized Sidebar */}
          <aside className="w-64 bg-zinc-950 text-zinc-200 border-r border-zinc-900 flex flex-col">
            {/* Clean Header (Removed harsh borders & oversized height) */}
            <div className="h-16 flex items-center px-6">
              <h1 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                EchoMail
              </h1>
            </div>

            {/* Elegant Navigation (Balanced margins & sleeker active states) */}
            <nav className="flex-1 px-3 py-4">
              <ul className="space-y-1">
                {LinkMaps.map((item) => {
                  const active = location.pathname === item.path;
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                          active
                            ? "bg-white/[0.06] text-white"
                            : "text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200"
                        }`}
                      >
                        <span
                          className={
                            active ? "text-indigo-400" : "text-zinc-500"
                          }
                        >
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Seamless Profile Footer (No bulky background boxes) */}
            <div className="border-t border-zinc-900 p-3">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-900/50 transition-colors cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xs font-semibold">
                  F
                </div>
                <div>
                  <p className="text-xs font-medium text-zinc-200 leading-tight">
                    Fuad
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">
                    Software Engineer
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-zinc-50/50">
            <section className="p-8">
              <Outlet />
            </section>
          </main>
        </div>
      )}
    </>
  );
};

export default Layout;

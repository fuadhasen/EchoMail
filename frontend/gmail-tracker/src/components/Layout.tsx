import { LayoutDashboard } from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import NavBar from "./NavBar";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { status, isPending, error } = useAuth();

  useEffect(() => {
    if (status == "unauthenticated") {
      navigate("/login");
    }
  }, [status, navigate]);

  if (error) return <p className="m-10 p-4 bg-red-100">{error.message}</p>;

  const LinkMaps = [
    {
      path: "/",
      label: "Dashboard",
      icon: <LayoutDashboard size={16} />,
    },
    { path: "/tracked", label: "Tracked" },
    { path: "/sent_emails", label: "search sent emails" },
    { path: "/reminders", label: "Reminders" },
  ];

  return (
    <>
      {status == "authenticated" && (
        <div className="flex bg-gray-300 p-2 h-screen">
          <aside className="bg-white rounded-md shadow-md w-64 h-full space-y-10 ">
            <h1 className="text-xl mt-4 mx-4 p-3 text-center text-gray-800  font-bold mb-4">
              GMAIL TRACKER
            </h1>
            <hr />
            <ul className="space-y-2">
              {LinkMaps.map((item) => (
                <li
                  key={item.path}
                  className={
                    location.pathname == item.path
                      ? "bg-blue-300 rounded-r-full mx-4 px-3 py-1"
                      : "hover:bg-blue-100 transition rounded-r-full mx-4 px-3 py-1"
                  }
                >
                  <Link to={item.path}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </aside>
          <main className="flex-1 overflow-y-auto p-4 space-y-2">
            <NavBar />
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

import { Outlet } from "react-router";
// import NavBar from "./NavBar";
import SideBar from "./SideBar";
import ToastContainer from "./ToastContainer";

const Layout = () => {
  // const location = useLocation();
  // const navigate = useNavigate();

  // const { status, error } = useAuth();

  // useEffect(() => {
  //   if (status == "unauthenticated") {
  //     navigate("/login");
  // //   }
  // // }, [status, navigate]);

  // if (error) return <p className="m-10 p-4 bg-red-100">{error.message}</p>;

  // Email

  return (
    <>
      {"authenticated" == "authenticated" && (
        <div className="flex flex-col md:flex-row h-screen bg-[#f8f9ff]">
          <SideBar />
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto scrollbar-none  p-5 md:p-8 relative">
            <Outlet />
            <ToastContainer />
          </main>
        </div>
      )}
    </>
  );
};

export default Layout;

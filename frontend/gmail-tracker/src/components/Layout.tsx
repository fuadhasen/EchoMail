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
        <div className="flex h-screen font-sans bg-[#f8f9ff]">
          <SideBar />
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-[#f8f9ff]">
            <section className="">
              <Outlet />
              <ToastContainer />
            </section>
          </main>
        </div>
      )}
    </>
  );
};

export default Layout;

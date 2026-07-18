import {
  BarChart3,
  ChevronsUpDown,
  Grid,
  LogOut,
  Mail,
  Menu,
  Plus,
  Settings,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router";

interface SideBarProps {
  activeItem?: string;
  onNavigate?: (item: string) => void;
}

const SideBar = ({ activeItem = "Dashboared", onNavigate }: SideBarProps) => {
  const [active, setActive] = useState(activeItem);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);

  const handlItemClick = (name: string) => {
    setActive(name);
    if (onNavigate) {
      onNavigate(name);
    }
  };

  const navItems = [
    { name: "Dashboard", icon: Grid, path: "/" },
    { name: "Tracked Emails", icon: Mail, path: "/tracked" },
    { name: "Track New", icon: Plus, path: "/track_new" },
    { name: "Analytics", icon: BarChart3, path: "/analytics" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between px-5 py-3.5 bg-white   border-b border-zinc-200/80 sticky top-0 z-40 w-full">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100  transition-colors focus:outline-none cursor-pointer"
            areia-label="Open menu"
          >
            <Menu size={20} className="stroke-2.2" />
          </button>
          <Link to="/" className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-6.5 h-6.5 bg-zinc-900 border border-zinc-800 rounded-md flex items-center justify-center  text-zinc-100 font-extrabold  shadow-xs font-sans text-[11px]">
              E
            </div>
            <span className="font-sans text-[13px] font-bold text-zinc-900 tracking-tight">
              EchoMail
            </span>
          </Link>
        </div>
      </div>

      {/* mobile navigation drawer */}
      {isMobileDrawerOpen && (
        <>
          {/* backdrop overlay */}
          <div
            className="fixed inset-0 bg-zinc-950/20 backdrop-blur-[1px] z-50 md:hidden animate-in fade-in duration-200"
            onClick={() => {
              setIsMobileDrawerOpen(false);
              setIsMobileProfileOpen(false);
            }}
          />

          {/* drawer panel */}
          <div className="fixed inset-y-0 left-0 w-70 max-w-[80vw] bg-zinc-50 border-r border-zinc-200/80 p-5 flex flex-col z-50 md:hidden shadow-xl animate-in slide-in-from-left duration-200">
            {/* Drawer header */}
            <div className="flex items-center justify-between mb-5 pb-3 border-b  border-zinc-200/50">
              <div className="flex items-center gap-2.5">
                <div className="w-6.5 h-6.5 bg-zinc-900 border border-zinc-800 rounded-md flex items-center justify-center text-zinc-100  shadow-sm font-sans text-[11px]">
                  E
                </div>
                <div className="text-left">
                  <h1 className="font-sans text-[13px] font-bold text-[#0b1c30] leading-none tracking-tight">
                    EchoMail
                  </h1>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  setIsMobileProfileOpen(false);
                }}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100/50 transition-colors focus:outline-none cursor-pointer"
              >
                <X size={16} className="stroke-2.5" />
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.path === "/"}
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className={({ isActive }) =>
                      `group w-full flex items-center justify-between px-3 py-2 rounded-lg font-sans text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer border ${
                        isActive
                          ? "bg-white border-zinc-200/80 text-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.03)] font-bold"
                          : "bg-transparent border-transparent text-zinc-500 hover:bg-zinc-200/30 hover:text-zinc-950"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <div className="flex items-center gap-2.5 w-full">
                        <Icon
                          size={14}
                          className={`transition-all duration-150 shrink-0 ${
                            isActive
                              ? "text-zinc-900 stroke-[2.2]"
                              : "text-zinc-400 group-hover:text-zinc-600"
                          }`}
                        />
                        <span>{item.name}</span>
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* mobile profile section */}
            <div className="relative mt-auto pt-4 border-t border-[#c7c4d8]/15 text-left">
              <button
                onClick={() => setIsMobileProfileOpen(!isMobileProfileOpen)}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-zinc-100/60 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-full bg-zinc-900 text-white font-sans text-xs font-extrabold flex items-center justify-center shrink-0">
                    AR
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-sans text-xs font-bold text-[#0b1c30] truncate leading-tight">
                      Alex Revera
                    </h4>
                    <p className="font-sans text-[10px] text-zinc-500 truncate leading-none mt-0.5 font-medium">
                      fuya241@gmail.com
                    </p>
                  </div>
                </div>
                <ChevronsUpDown size={13} />
              </button>
              {isMobileProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMobileProfileOpen(false)}
                  />
                  <div className="absolute bottom-14 left-0 right-0 bg-white border border-zinc-200/80 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-1.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                    <button
                      onClick={() => {
                        setIsMobileProfileOpen(false);
                        setIsMobileDrawerOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left font-sans text-xs font-bold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950  transition-all cursor-pointer"
                    >
                      <User size={14} className="text-zinc-400" />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileProfileOpen(false);
                        setIsMobileDrawerOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left font-sans text-xs font-bold text-zinc-700 hover:bg-zinc-50 hover:text-[#3525cd] transition-all cursor-pointer"
                    >
                      <Settings size={14} className="text-zinc-400" />
                      Account Settings
                    </button>
                    <div className="h-px bg-zinc-100 my-1" />
                    <button
                      onClick={() => {
                        setIsMobileProfileOpen(false);
                        setIsMobileDrawerOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left font-sans text-xs font-bold text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                    >
                      <LogOut size={14} className="text-red-400" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/*  */}
        </>
      )}

      {/* desktop side bar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-zinc-200/80 px-4 py-6 shrink-0 bg-zinc-50 relative">
        {/* {Brand Logo section} */}
        <Link
          to={"/"}
          className="group mb-8 px-2 flex items-center gap-2.5 focus:outline-none cursor-pointer"
        >
          <div className="w-6.5 h-6.5 bg-zinc-900 border border-zinc-800 rounded-md flex items-center justify-center text-zinc-100 text-[11px] transition-all duration-200 group-hover:scale-[1.02] font-extrabold shadow-sm font-sans">
            E
          </div>
          <div className="text-left">
            <h1 className="font-sans text-[13px] font-bold text-zinc-900 leading-none tracking-tight">
              EchoMail
            </h1>
            <p className="font-sans text-[8px] uppercase tracking-wider text-zinc-400/80 font-bold mt-0.5">
              Communication loops
            </p>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar pr-1 -mr-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `group w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-sans text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer border ${
                    isActive
                      ? "bg-white border-zinc-200/60 text-[#3525cd] shadow-[0_1.5px_4px_rgba(0,0,0,0.03)]"
                      : "bg-transparent border-transparent text-zinc-500 hover:bg-zinc-100/60 hover:text-zinc-900"
                  }`
                }
                id={`sidebar-nav-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {({ isActive }) => (
                  <div className="flex items-center gap-3 w-full">
                    <Icon
                      size={15}
                      className={`transition-all duration-200 shrink-0 ${
                        isActive
                          ? "text-[#3525cd] stroke-[2.2] scale-105"
                          : "text-zinc-400 group-hover:text-zinc-700 group-hover:scale-105 group-hover:translate-x-0.5"
                      }`}
                    />
                    <span className="transition-colors duration-200">
                      {item.name}
                    </span>
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="relative mt-auto pt-4 border-t border-[#c7c4d8]/15 text-left">
          <button
            onClick={() => setIsMobileProfileOpen(!isMobileProfileOpen)}
            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-zinc-100/60 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-zinc-900 text-white font-sans text-xs font-extrabold flex items-center justify-center shrink-0">
                AR
              </div>
              <div className="overflow-hidden">
                <h4 className="font-sans text-xs font-bold text-[#0b1c30] truncate leading-tight">
                  Alex Revera
                </h4>
                <p className="font-sans text-[10px] text-zinc-500 truncate leading-none mt-0.5 font-medium">
                  fuya241@gmail.com
                </p>
              </div>
            </div>
            <ChevronsUpDown size={13} />
          </button>
          {isMobileProfileOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsMobileProfileOpen(false)}
              />
              <div className="absolute bottom-14 left-0 right-0 bg-white border border-zinc-200/80 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08)] p-1.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                <button
                  onClick={() => {
                    setIsMobileProfileOpen(false);
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left font-sans text-xs font-bold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950  transition-all cursor-pointer"
                >
                  <User size={14} className="text-zinc-400" />
                  Profile
                </button>
                <button
                  onClick={() => {
                    setIsMobileProfileOpen(false);
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left font-sans text-xs font-bold text-zinc-700 hover:bg-zinc-50 hover:text-[#3525cd] transition-all cursor-pointer"
                >
                  <Settings size={14} className="text-zinc-400" />
                  Account Settings
                </button>
                <div className="h-px bg-zinc-100 my-1" />
                <button
                  onClick={() => {
                    setIsMobileProfileOpen(false);
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left font-sans text-xs font-bold text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                >
                  <LogOut size={14} className="text-red-400" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
};

export default SideBar;

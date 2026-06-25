import {
  BarChart3,
  Bell,
  Grid,
  Mail,
  Plus,
  Settings,
  Users,
} from "lucide-react";
import { useState } from "react";

interface SideBarProps {
  activeItem?: string;
  onNavigate?: (item: string) => void;
}

const SideBar = ({ activeItem = "Dashboared", onNavigate }: SideBarProps) => {
  const [active, setActive] = useState(activeItem);

  const handlItemClick = (name: string) => {
    setActive(name);
    if (onNavigate) {
      onNavigate(name);
    }
  };

  const navItems = [
    { name: "Dashboard", icon: Grid },
    { name: "Tracked Emails", icon: Mail, badge: "4" },
    { name: "Recipients", icon: Users },
    { name: "Reminders", icon: Bell, badge: "2" },
    { name: "Analytics", icon: BarChart3 },
    { name: "Settings", icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border border-[#c7c4d8]/30 px-4 py-6 shrink-0 bg-white">
      {/* {Brand Logo section} */}
      <div className="mb-8 px-2 flex items-center gap-3">
        <div className="w-8 h-8 bg-[#3525cd] rounded-lg flex items-center justify-center text-white font-extrabold shadow-sm font-sans">
          E
        </div>
        <div>
          <h1 className="font-sans text-lg font-bold text-[#0b1c30] leading-none">
            EchoMail
          </h1>
          <p className="font-sans text-[10px] uppercase tracking-widest text-[#777587] font-semibold mt-1">
            Pro Workspace
          </p>
        </div>
      </div>

      {/* Primary Action Button */}
      <button className="mb-6 w-full bg-[#3525cd] text-white hover:bg-[#3525cd]/95 px-4 py-3 rounded-xl font-sans text-xs font-bold tracking-wide flex items-center justify-center gap-2 cursor-pointer">
        <Plus
          size={16}
          className="stroke-[2.5] group-hover:scale-110 transition-transform"
        />
        Track New
      </button>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-1 mt-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.name;

          return (
            <button
              key={item.name}
              onClick={() => handlItemClick(item.name)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-sans text-xs font-bold tracking-wide transiton-all duration-150 cursor-pointer ${isActive ? "bg-[#eff4ff] text-[#3525cd]" : "text-[#777587] hover:bg-slate-50 hover:text-[#0b1c30]"} `}
            >
              <div className="flex items-center gap-3">
                <Icon
                  size={16}
                  className={`transition-colors ${isActive ? "text-[#3525cd] stroke-[2.2]" : "text-[#777587] group-hover:text-[#0b1c30]"}`}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    isActive
                      ? "bg-[#3525cd] text-white"
                      : "bg-[#eff4ff] text-[#3525cd] border border-[#c7c4d8]/20"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-[#c7c4d8]/15">
        <div className="bg-slate-50/70 border border-[#c7c4d8]/20 rounded-xl p-3.5">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-[#3525cd]/10 flex items-center justify-center">
              <span className="text-sm font-bold text-[#3525cd]">FH</span>
            </div>

            {/* UserInfo */}
            <div className="flex-1 min-w-0">
              <p className="font-sans text-xs font-bold text-[#0b1c30] truncate">
                Fuad Hassen
              </p>
              <p className="font-sans text-[11px]  text-[#777587] truncate">
                fuad@example.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;

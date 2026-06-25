import React from "react";

const SideBar = () => {
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
    </aside>
  );
};

export default SideBar;

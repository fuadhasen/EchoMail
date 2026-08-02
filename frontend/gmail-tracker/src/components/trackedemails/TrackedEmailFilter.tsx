import { Search, X } from "lucide-react";
import React from "react";

interface TrackedEmailFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showDone: boolean;
  onTabChange: (showDone: boolean) => void;
}

const TrackedEmailFilter = ({
  searchTerm,
  onSearchChange,
  showDone,
  onTabChange,
}: TrackedEmailFilterProps) => {
  return (
    <div className="bg-white border  border-slate-200/80 rounded-2xl p-3.5 mb-6 shadow-2xs flex flex-col md:flex-row gap-3.5 items-center justify-between">
      {/* SearchInput Box */}
      <div className="relative w-full md:w-80">
        <Search className="absolute  left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none " />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tracked emails..."
          className="w-full bg-slate-50/70 border border-slate-200/80 rounded-xl py-2 pl-9 pr-8 text-xs text-slate-800 placeholder-slate-400 font-sans focus:outline-none focus:ring-[#3525cd]/15 focus:border-[#3525cd] transition-all"
        />

        {searchTerm && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* status filter pills, active or all*/}
      <div className="inline-flex items-center p-1 bg-slate-100/90 rounded-xl border  border-slate-200/70 font-sans text-xs shrink-0">
        <button
          type="button"
          onClick={() => onTabChange(false)}
          className={`px-10 py-1.5 rounded-lg font-semibold transition-all duration-150 cursor-pointer flex items-center gap-2 ${
            showDone === false
              ? "bg-white text-slate-900 shadow-2xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>Active</span>
        </button>
        <button
          type="button"
          onClick={() => onTabChange(true)}
          className={`px-10 py-1.5 rounded-lg font-semibold transition-all duration-150 cursor-pointer flex items-center gap-2 ${
            showDone === true
              ? "bg-white text-slate-900 shadow-2xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>All</span>
        </button>
      </div>
    </div>
  );
};

export default TrackedEmailFilter;

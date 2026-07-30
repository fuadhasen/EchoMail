import { Search, X } from "lucide-react";
import React from "react";

export type StatusFilterTypes = "All" | "Waiting" | "Completed" | "Overdue";

interface TrackedEmailFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilterTypes;
  onStatusFilterChange: (status: StatusFilterTypes) => void;
  counts: {
    all: number;
    waiting: number;
    completed: number;
    overdue: number;
  };
}

const TrackedEmailFilter = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  counts,
}: TrackedEmailFilterProps) => {
  const filterOptions: { label: StatusFilterTypes; count: number }[] = [
    { label: "All", count: counts.all },
    { label: "Waiting", count: counts.waiting },
    { label: "Completed", count: counts.completed },
    { label: "Overdue", count: counts.overdue },
  ];

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

      {/* status filter pills */}
      <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto custom-scrollbar">
        <div className="flex items-center gap-1 bg-slate-100/70 p-1 rounded-xl">
          {filterOptions.map((option) => {
            const isActive = statusFilter === option.label;
            return (
              <button
                key={option.label}
                onClick={() => onStatusFilterChange(option.label)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
                }`}
              >
                <span>{option.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2  rounded-md font-mono font-medium ${
                    isActive
                      ? "bg-slate-100 text-slate-700"
                      : "bg-slate-200/60 text-slate-500"
                  }`}
                >
                  {option.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrackedEmailFilter;

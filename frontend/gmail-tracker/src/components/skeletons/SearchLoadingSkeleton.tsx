import { RefreshCw } from "lucide-react";
import React from "react";

const SearchLoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
        <span className="flex items-center gap-2 font-mono">
          <RefreshCw size={12} className="animate-spin text-[#3525cd]" />
          Querying Gmail Outbox API...
        </span>
        <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded">
          200 OK
        </span>
      </div>

      {[1, 2, 3].map((skeletonId) => (
        <div
          key={skeletonId}
          className="p-6  border-slate-200/80 rounded-2xl bg-white space-y-3 relative overflow-hidden animate-pulse shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 bg-slate-200 rounded-md w-1/2" />
            <div className="h-3 bg-slate-200 rounded w-28" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-100 rounded-md w-full" />
            <div className="h-3 bg-slate-100 rounded-md w-3/4" />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="h-5 bg-indigo-50 rounded-md w-32" />
            <div className="h-4 bg-slate-100 rounded-md w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchLoadingSkeleton;

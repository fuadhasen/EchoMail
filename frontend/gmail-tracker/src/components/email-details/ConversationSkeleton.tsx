import React from "react";

const ConversationSkeleton = () => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4 animate-pulse">
      {/* header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div className="space-y-2 flex-1 max-w-sm">
          <div className="h-4 bg-slate-200 rounded-md w-3/4" />
          <div className="h-3 bg-slate-100 rounded-md w-1/2" />
        </div>
        <div className="h-6 bg-slate-200 rounded-full w-20" />
      </div>

      {/* message list */}
      <div className="space-y-3 pt-1">
        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-200" />
              <div className="h-3.5 bg-slate-200 rounded w-28" />
            </div>
            <div className="h-3 bg-slate-200 rounded w-16" />
          </div>
          <div className="h-3 bg-slate-100 rounded w-full mt-2" />
          <div className="h-3 bg-slate-100 rounded w-4/5" />
        </div>

        <div className="p-4 rounded-xl border border-slate-100 bg-white space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-200" />
              <div className="h-3.5 bg-slate-200 rounded w-32" />
            </div>
            <div className="h-3 bg-slate-200 rounded w-16" />
          </div>
          <div className="h-3 bg-slate-100 rounded w-11/12 mt-2" />
        </div>
      </div>
    </div>
  );
};

export default ConversationSkeleton;

import React from "react";

const EmailDetailsSkeleton = () => {
  return (
    <div className="w-full text-left space-y-6 animate-pulse">
      {/* back button skeleton */}
      <div className="h-4 w-36 bg-slate-200/80 rounded" />

      {/* header card skeleton */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4">
        <div className="h-7 w-2/3 bg-slate-200/80 rounded" />
      </div>

      {/* main grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 h-64" />
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 h-64" />
        </div>
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 h-48" />
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 h-40" />
        </div>
      </div>
    </div>
  );
};

export default EmailDetailsSkeleton;

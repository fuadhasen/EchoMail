const EmailDetailsSkeleton = () => {
  return (
    <div className="w-full text-left space-y-6 animate-pulse">
      {/* Header card skeleton */}
      <div className="w-full bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        {/* Top breadcrumb bar */}
        <div className="px-5 sm:px-6 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-4 w-28 bg-slate-200 rounded-md" />
            <div className="h-4 w-20 bg-slate-100 rounded-md" />
          </div>
          <div className="h-6 w-24 bg-slate-100 rounded-full" />
        </div>

        {/* Header body */}
        <div className="p-5 sm:p-6 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3 flex-1">
              <div className="h-7 w-3/5 bg-slate-200 rounded-lg" />
              <div className="flex items-center gap-2">
                <div className="h-6 w-32 bg-slate-100 rounded-lg" />
                <div className="h-6 w-28 bg-slate-100 rounded-lg" />
                <div className="h-6 w-28 bg-slate-100 rounded-lg" />
              </div>
            </div>
            <div className="h-9 w-32 bg-slate-200 rounded-xl shrink-0" />
          </div>
        </div>

        {/* Tab bar skeleton */}
        <div className="px-5 sm:px-6 py-2.5 bg-slate-50 border-t border-slate-200/80 flex items-center gap-2">
          <div className="h-7 w-28 bg-white rounded-xl border border-slate-200/80" />
          <div className="h-7 w-28 bg-slate-200/60 rounded-xl" />
          <div className="h-7 w-36 bg-slate-200/60 rounded-xl" />
        </div>
      </div>

      {/* Main grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="h-8 w-48 bg-slate-100 rounded-xl" />
              <div className="h-8 w-56 bg-slate-100 rounded-xl" />
            </div>
            <div className="space-y-2.5 pt-2">
              <div className="h-16 bg-slate-50 rounded-xl border border-slate-100" />
              <div className="h-16 bg-slate-50 rounded-xl border border-slate-100" />
              <div className="h-16 bg-slate-50 rounded-xl border border-slate-100" />
            </div>
          </div>
        </div>
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-2 w-full bg-slate-100 rounded-full" />
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="h-12 bg-slate-50 rounded-xl" />
              <div className="h-12 bg-slate-50 rounded-xl" />
            </div>
          </div>
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="h-4 w-28 bg-slate-200 rounded" />
            <div className="space-y-2 pt-1">
              <div className="h-5 bg-slate-50 rounded" />
              <div className="h-5 bg-slate-50 rounded" />
              <div className="h-5 bg-slate-50 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailDetailsSkeleton;

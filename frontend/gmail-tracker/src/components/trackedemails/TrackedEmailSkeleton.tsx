const TrackedEmailSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2].map((idx) => (
        <div
          key={idx}
          className="bg-white border border-slate-200/80 rounded-2xl p-5 md:p-6 shadow-2xs animate-pulse"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Subject + mobile status */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="h-5 md:h-6 w-2/3 bg-slate-200 rounded-md" />

                {/* Mobile status */}
                <div className="md:hidden h-6 w-24 bg-slate-200 rounded-full" />
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <div className="h-7 w-32 bg-slate-100 rounded-lg" />
                <div className="h-7 w-36 bg-slate-100 rounded-lg" />
                <div className="h-7 w-40 bg-slate-100 rounded-lg" />
              </div>
            </div>

            {/* Desktop status + button */}
            <div className="flex items-center justify-between md:justify-end gap-5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
              <div className="hidden md:block h-7 w-24 bg-slate-200 rounded-full" />

              <div className="h-9 w-28 bg-slate-200 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackedEmailSkeleton;

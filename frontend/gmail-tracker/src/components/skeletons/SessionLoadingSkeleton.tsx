const SessionLoadingSkeleton = () => {
  return (
    <div className="space-y-4 py-2 w-full">
      {/* User message */}
      <div className="flex items-start gap-3 justify-end">
        <div className="w-fit max-w-[80%] sm:max-w-md rounded-2xl rounded-tr-xs px-3.5 py-2 bg-slate-200 animate-pulse space-y-2">
          <div className="h-3 sm:h-4 bg-slate-300 rounded-lg w-52 max-w-full" />
          <div className="h-3 sm:h-4 bg-slate-300 rounded-lg w-32 max-w-full ml-auto" />
          <div className="h-2.5 bg-slate-300 rounded-lg w-16 mt-1 ml-auto" />
        </div>

        <div className="w-8 h-8 rounded-xl bg-slate-200 animate-pulse shrink-0 mt-0.5" />
      </div>
      {/* Assistant message */}
      <div className="flex items-start gap-3 justify-start">
        <div className="w-8 h-8 rounded-xl bg-slate-200 animate-pulse shrink-0 mt-0.5" />

        <div className="max-w-[85%] sm:max-w-xl rounded-2xl rounded-tl-xs px-4 py-3 bg-slate-200 animate-pulse space-y-2">
          <div className="h-3 sm:h-4 bg-slate-300 rounded-lg w-64 max-w-full" />
          <div className="h-3 sm:h-4 bg-slate-300 rounded-lg w-48 max-w-full" />
          <div className="h-2.5 bg-slate-300 rounded-lg w-20 mt-2" />
        </div>
      </div>

      {/* User message */}
      <div className="flex items-start gap-3 justify-end">
        <div className="w-fit max-w-[80%] sm:max-w-md rounded-2xl rounded-tr-xs px-3.5 py-2 bg-slate-200 animate-pulse space-y-2">
          <div className="h-3 sm:h-4 bg-slate-300 rounded-lg w-44 max-w-full" />
          <div className="h-2.5 bg-slate-300 rounded-lg w-16 mt-1 ml-auto" />
        </div>

        <div className="w-8 h-8 rounded-xl bg-slate-200 animate-pulse shrink-0 mt-0.5" />
      </div>

      {/* Assistant message */}
      <div className="flex items-start gap-3 justify-start">
        <div className="w-8 h-8 rounded-xl bg-slate-200 animate-pulse shrink-0 mt-0.5" />

        <div className="max-w-[85%] sm:max-w-xl rounded-2xl rounded-tl-xs px-4 py-3 bg-slate-200 animate-pulse space-y-2">
          <div className="h-3 sm:h-4 bg-slate-300 rounded-lg w-72 max-w-full" />
          <div className="h-3 sm:h-4 bg-slate-300 rounded-lg w-60 max-w-full" />
          <div className="h-3 sm:h-4 bg-slate-300 rounded-lg w-40 max-w-full" />
          <div className="h-2.5 bg-slate-300 rounded-lg w-20 mt-2" />
        </div>
      </div>
    </div>
  );
};

export default SessionLoadingSkeleton;

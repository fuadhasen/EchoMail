const TrackedEmailSkeleton = () => {
  return (
    <div>
      {[1, 2, 3, 4].map((idx) => (
        <div
          key={idx}
          className="bg-white  border border-[#c7c4d8]/20 rounded-2xl p-5 md:p-6 shadow-2xs space-y-4  animate-pulse"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-3 flex-1">
              <div className="h-5 w-2/3 bg-slate-200 rounded-md " />
              <div className="flex gap-3">
                <div className="h-6 w-28 bg-slate-100 rounded-lg" />
                <div className="h-6 w-32 bg-slate-100 rounded-lg" />
                <div className="h-6 w-36 bg-slate-100 rounded-lg" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-7 w-20 bg-slate-200 rounded-full " />
              <div className="h-8 w-28 bg-slate-200 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackedEmailSkeleton;

import { Mail, Plus, RotateCcw, SearchX } from "lucide-react";
import { Link } from "react-router";

interface TrackedEmailProps {
  type: "empty" | "no-results";
  onResetFilter?: () => void;
}

const TrackedEmailEmpty = ({ type, onResetFilter }: TrackedEmailProps) => {
  if (type === "no-results") {
    return (
      <div className="bg-white border  border-slate-200/80 rounded-2xl p-12 text-center shadow-2xs my-6 flex flex-col items-center justify-center min-h-75">
        <div className="w-12 h-12 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-center text-slate-400 mb-3.5">
          <SearchX size={22} />
        </div>
        <h3 className="font-sans text-base font-semibold text-slate-900 mb-1">
          No tracked emails found
        </h3>
        <p className="font-sans text-xs text-slate-500 max-w-md mx-auto mb-5 leading-relaxed ">
          We couldn't find any tracked emails matching your current search
          criteria or status filter.
        </p>

        {onResetFilter && (
          <button
            onClick={onResetFilter}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 px-4 py-2 rounded-xl font-sans text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <RotateCcw size={13} />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    );
  }
  return (
    <div className="mbg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-2xs my-6 flex flex-col items-center justify-center min-h-85">
      <div className="w-14 h-14 bg-slate-50 border border-slate-200/60 rounded-2xl flex items-center justify-center text-[#3525cd] mb-4">
        <Mail size={26} className="stroke-1.8" />
      </div>

      <h3 className="font-sans text-lg font-semibold text-slate-900 mb-1.5">
        No tracked Email yet
      </h3>
      <p className="font-sans text-xs text-slate-500 max-w-sm mx-auto mb-6 leading-relaxed">
        Start tracking an email to monitor responses automatically.
      </p>
      <Link
        to={"/track_new"}
        className="bg-[#3525cd] text-white hover:bg-[#281ca8] py-2.5 px-4.5 rounded-xl font-sans text-xs font-semibold tracking-wide flex items-center gap-2 shadow-2xs transition-all cursor-pointer "
      >
        <Plus size={15} className="stroke-2.5" />
        <span>Track New Email</span>
      </Link>
    </div>
  );
};

export default TrackedEmailEmpty;

import type { TrackedEmailB } from "@/services/trackedEmail";
import { ArrowRight, Calendar, Hourglass, User } from "lucide-react";
import React from "react";
import { Link } from "react-router";

interface TrackedEmailCardProps {
  key?: React.Key;
  email: TrackedEmailB;
  status: "Completed" | "Overdue" | "Waiting";
}

const TrackedEmailCard = ({ email, status }: TrackedEmailCardProps) => {
  // map Pending to waiting for display status
  const displayStatus = status;
  console.log(email.sender, " ", email.sentDate, " ", email.deadline);

  const getStatusBadge = () => {
    switch (displayStatus) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Completed
          </span>
        );

      case "Overdue":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            Overdue
          </span>
        );

      case "Waiting":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Waiting
          </span>
        );
    }
  };

  return (
    <div className="group bg-white border border-slate-200/80 hover:border-[#3525cd]/30 rounded-2xl p-5 md:p-6 shadow-2xs hover:shadow-sm transition-all duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* main content area */}
        <div className="flex-1 min-w-0">
          {/* header section and status (mobile layout) */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <Link
              to={`/tracked/detail/${email.id}`}
              className="font-sans text-base md:text-lg font-bold text-slate-900 group-hover:text-[#3525cd] transition-colors leading-snug line-clamp-1"
            >
              {email.subject}
            </Link>
            <div className="md:hidden">{getStatusBadge()}</div>
          </div>

          {/* clean metadata link */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 font-sans">
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
              <User size={13} className="text-slate-400 shrink-0" />
              <span>From:</span>
              <span className="font-semibold text-slate-800">
                {email.sender}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
              <Calendar size={13} className="text-slate-400 shrink-0" />
              <span>Sent:</span>
              <span className="font-semibold text-slate-800">
                {email.sentDate || Date.now()}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
              <Hourglass size={13} className="text-slate-400 shrink-0" />
              <span>Deadline:</span>
              <span className="font-semibold text-slate-800">
                {email.deadline}
              </span>
            </div>
          </div>
        </div>

        {/* status desktop and link action */}
        <div className="flex items-center justify-between md:justify-end gap-5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
          <div className="hidden md:block">{getStatusBadge()}</div>

          <Link
            to={`/tracked/detail/${email.id}`}
            className="inline-flex items-center gap-1.5  bg-[#f8f9ff] hover:bg-[#3525cd] text-[#3525cd] hover:text-white border border-[#3525cd]/20 hover:border-[#3525cd]  px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-2xs group/btn cursor-pointer"
          >
            <span>Open Details</span>
            <ArrowRight
              size={14}
              className="group-hover/btn:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrackedEmailCard;

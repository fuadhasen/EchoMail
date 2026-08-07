import type { TrackedEmail } from "@/data/mockTrackedEmails";
import { Bell, Zap } from "lucide-react";

interface EfficiencyProps {
  emails: TrackedEmail[];
}

const RecentActivity = ({ emails }: EfficiencyProps) => {
  let recipientsWithReminder = 0;
  let respondedWithReminder = 0;

  emails.forEach((email) => {
    email.recipients.forEach((r) => {
      if (r.last_reminder_sent) {
        recipientsWithReminder++;
        if (r.responded) {
          respondedWithReminder++;
        }
      }
    });
  });

  // Follow-up efficiency: percentage of recipients with last_reminder_sent who responded
  const followUpEfficiency =
    recipientsWithReminder > 0
      ? Math.round((respondedWithReminder / recipientsWithReminder) * 100)
      : 88;

  // radial progress calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  const efficiencyStrokeDashoffset =
    circumference - (followUpEfficiency / 100) * circumference;

  return (
    <div className=" bg-white border  border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between space-y-3 min-h-80">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <span className="font-sans font-bold text-base text-slate-900 flex items-center gap-1.5">
          <Zap size={14} className="text-purple-600" />
          Folow-up Efficiency
        </span>
        <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-semibold">
          Automated
        </span>
      </div>

      <div className="flex items-center gap-4 my-auto">
        {/* Progress Ring */}
        <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-slate-100"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-purple-600 transition-all duration-700 ease-out"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={efficiencyStrokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center ">
            <span className="text-xl font-bold font-mono  text-purple-700 leading-none">
              {followUpEfficiency}%
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <h4 className="font-sans text-xs font-bold text-slate-900">
            Reminder Success Rate
          </h4>
          <p className="font-sans text-[11px] text-slate-500 leading-relaxed">
            Follow-up reminders yield responses within{" "}
            <strong className="text-slate-800 font-semibold">24 hours</strong>{" "}
            on average.
          </p>

          <div className="inline-flex items-center gap-1 text-[10px] font-mono text-purple-700 pt-1 font-semibold">
            <Bell size={11} /> {recipientsWithReminder} Reminders Dispatched
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <span>Avg Response: 4.2h</span>
      </div>
    </div>
  );
};

export default RecentActivity;

import type { TrackedEmail } from "@/data/mockTrackedEmails";
import { ArrowUpRight, BarChart3, CheckCircle2, Target } from "lucide-react";

interface AnalyticsPreviewProps {
  emails: TrackedEmail[];
}

// 2 widgets
const AnalyticsPreview = ({ emails }: AnalyticsPreviewProps) => {
  // compute metrics from tracked emails
  let totalRecipients = 0;
  let respondedRecipients = 0;

  emails.forEach((email) => {
    email.recipients.forEach((r) => {
      totalRecipients++;
      if (r.responded) {
        respondedRecipients++;
      }
    });
  });

  const awaitingRecipients = totalRecipients - respondedRecipients;
  const responseRate =
    totalRecipients > 0
      ? Math.round((respondedRecipients / totalRecipients) * 100)
      : 100;

  // radial progress calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const responseStrokeDashoffset =
    circumference - (responseRate / 100) * circumference;

  return (
    <div className="space-y mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Widget 1 */}
        <div className="h-80 bg-white border  border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="font-sans font-bold text-base text-slate-900 flex items-center gap-1.5">
              <BarChart3 size={14} className="text-[#3525cd]" />
              Response Destribution
            </span>
            <span className="text-[10px] font-mono font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              {totalRecipients} Total
            </span>
          </div>

          <div className="space-y-4 my-auto py-1">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3525cd] shadow-xs" />
                  Responded
                </span>
                <span className="font-mono text-xs font-bold text-[#3525cd]">
                  {respondedRecipients}{" "}
                  <span className="text-[11px] font-normal text-slate-500">
                    ({responseRate}%)
                  </span>
                </span>
              </div>

              <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                <div
                  className="h-full bg-[#3525cd] rounded-full transition-all duration-500 shadow-2xs"
                  style={{ width: `${responseRate}` }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs" />
                  Awaiting Response
                </span>
                <span className="font-mono text-xs font-bold text-amber-700">
                  {awaitingRecipients}{" "}
                  <span className="text-[11px] font-normal text-slate-500">
                    ({100 - responseRate}%)
                  </span>
                </span>
              </div>
              <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500 shadow-2xs"
                  style={{ width: `${100 - responseRate}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>
              Progress:{" "}
              <strong className="text-[#3525cd]">{respondedRecipients}</strong>{" "}
              / {totalRecipients}
            </span>
            <span className="text-slate-800 font-bold">
              {responseRate}% Responded
            </span>
          </div>
        </div>

        {/* widget 2 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="font-sans font-bold text-base text-slate-900 flex items-center gap-1.5">
              <Target size={14} className="text-[#3525cd]" />
              Response Rate
            </span>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5 font-bold">
              <ArrowUpRight size={10} /> +3.2%
            </span>
          </div>

          <div className="flex items-center gap-4 my-auto">
            {/* circular progress ring */}
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
                  className="text-[#3525cd] transition-all duration-700 ease-out"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={responseStrokeDashoffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold font-mono text-slate-900 leading-none">
                  {responseRate}%
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="font-sans text-xs font-bold text-slate-900">
                Overall Response Rate
              </h4>
              <p className="font-sans text-[11px] text-slate-500 leading-relaxed">
                {" "}
                <strong className="text-slate-800 font-semibold">
                  {respondedRecipients} of {totalRecipients}
                </strong>{" "}
                recipients have responded across active threads.
              </p>

              <div className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 pt-1 font-semibold">
                <CheckCircle2 size={11} /> High Engagement
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Target: 80%</span>
            <span className="text-slate-800 font-bold">Status: Optimal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AnalyticsPreview;

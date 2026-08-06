import type { TrackedEmail } from "@/data/mockTrackedEmails";
import { ArrowUpRight, CheckCircle2, PieChart, Target } from "lucide-react";
import {
  Cell,
  Pie,
  PieChart as RePieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface AnalyticsPreviewProps {
  emails: TrackedEmail[];
}

// 2 widgets
const AnalyticsPreview = ({ emails }: AnalyticsPreviewProps) => {
  // compute metrics from tracked emails
  let totalRecipients = 0;
  let respondedRecipients = 0;
  let awaitingRecipients = 0;
  let recipientsWithReminder = 0;
  let respondedWithReminder = 0;

  emails.forEach((email) => {
    email.recipients.forEach((r) => {
      totalRecipients++;
      if (r.responded) {
        respondedRecipients++;
      } else {
        awaitingRecipients++;
      }
      if (r.last_reminder_sent) {
        recipientsWithReminder++;
        if (r.responded) {
          respondedWithReminder++;
        }
      }
    });
  });

  const responseRate =
    totalRecipients > 0
      ? Math.round((respondedRecipients / totalRecipients) * 100)
      : 100;

  // // follow-up efficiency: percentage of recipients with last_reminder_sent who respond
  // const followUpEfficiency =
  //   recipientsWithReminder > 0
  //     ? Math.round((respondedWithReminder / recipientsWithReminder) * 100)
  //     : 88;

  const donutData = [
    { name: "Responded", value: respondedRecipients, color: "#3525cd" },
    { name: "Awaiting", value: awaitingRecipients, color: "#f59e0b" },
  ];

  // radial progress calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const responseStrokeDashoffset =
    circumference - (responseRate / 100) * circumference;

  return (
    <div className="space-y mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Widget 1 */}
        <div className="h-80 bg-white border  border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="font-sans font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <PieChart size={14} className="text-[#3525cd]" />
              Response Destribution
            </span>
            <span className="text-[10px] font-mono font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              {totalRecipients} Total
            </span>
          </div>

          <div>
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={38}
                  outerRadius={54}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number, name: string) => [
                    `${val} recipients`,
                    name,
                  ]}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderRadius: "10px",
                    color: "#fff",
                    fontSize: "11px",
                    border: "none",
                    padding: "6px 10px",
                  }}
                  itemStyle={{ color: "#fff" }}
                />
              </RePieChart>
            </ResponsiveContainer>

            {/* center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-bold font-mono text-slate-900 leading-none">
                {totalRecipients}
              </span>
              <span className="text-[10px] font-sans font-medium text-slate-500 mt-0.5">
                Recipients
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px] font-mono">
            <div className="flex items-center gap-1.5 bg-indigo-50/60 p-2 rounded-xl border border-indigo-100/60">
              <span className="w-2 h-2 rounded-full bg-[#3525cd]" />
              <span className="text-slate-700 font-medium">Responded:</span>
              <span className="font-bold text-[#3525cd] ml-auto">
                {respondedRecipients}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-amber-50/60 p-2 rounded-xl border border-amber-100/60">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-slate-700 font-medium">Awaiting:</span>
              <span className="font-bold text-amber-800 ml-auto">
                {awaitingRecipients}
              </span>
            </div>
          </div>
        </div>

        {/* widget 2 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="font-sans font-bold text-xs text-slate-900 flex items-center gap-1.5">
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

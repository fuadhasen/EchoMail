import type { TrackedEmail } from "@/data/mockTrackedEmails";
import { ShieldCheck } from "lucide-react";

interface RightPanelProps {
  email: TrackedEmail;
  respondedCount: number;
  totalCount: number;
  requiredCount: number;
  requiredRespondedCount: number;
  completionPercentage: number;
}

const RightPanel = ({
  email,
  respondedCount,
  totalCount,
  requiredCount,
  requiredRespondedCount,
  completionPercentage,
}: RightPanelProps) => {
  const isOverdue = email.status === "Overdue";
  const isCompleted = email.status === "Completed";

  return (
    <div className="space-y-4">
      {/* response progress box */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-sans text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-[#3525cd]" />
            Response Progress
          </h3>
          <span className="text-xs font-mono font-bold text-[#3525cd]">
            {completionPercentage}%
          </span>
        </div>

        {/* progress bar */}
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
          <div
            style={{ width: `${completionPercentage}%` }}
            className={`h-full transition-all duration-500 rounded-full ${
              isCompleted
                ? "bg-emerald-500"
                : isOverdue
                  ? "bg-rose-500"
                  : "bg-[#3525cd]"
            }`}
          />
        </div>

        {/* breakdown stats */}
        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="bg-slate-50/80 border border-slate-200/60 p-2.5 rounded-xl">
            <span className="text-[10px] font-sans font-medium text-slate-500 block">
              Required
            </span>
            <span className="font-mono text-sm font-bold text-emerald-600">
              {requiredRespondedCount}{" "}
              <span className="text-[11px] text-slate-400 font-normal">
                / {requiredCount}
              </span>
            </span>
          </div>

          <div className="bg-slate-50/80 border border-slate-200/60 p-2.5 rounded-xl">
            <span className="text-[10px] font-sans font-medium text-slate-500 block">
              Total Replies
            </span>
            <span className="font-mono text-sm font-bold text-emerald-600">
              {respondedCount}{" "}
              <span className="text-[11px] text-slate-400 font-normal">
                / {totalCount}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* SLA Metrics and Thread specs*/}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-2xs space-y-3">
        <h4 className="font-sans text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          SLA & Thread Info
        </h4>

        <div className="space-y-2 text-xs font-sans">
          <div className="flex items-center justify-between text-slate-600 py-1 border-b border-slate-100">
            <span className="text-slate-500">Tracking Status</span>
            <span className="font-semibold text-slate-800">{email.status}</span>
          </div>

          <div className="flex items-center justify-between text-slate-600 py-1 border-b border-slate-100">
            <span className="text-slate-500">Target Deadline</span>
            <span className="font-mono text-[11px] font-semibold text-slate-800">
              {email.deadline}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-600 py-1 border-b border-slate-100">
            <span className="text-slate-500">Sent Timestamp</span>
            <span className="font-mono text-[11px] text-slate-700">
              {email.sentDate}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-600 py-1">
            <span className="text-slate-500">Tracked ID</span>
            <span className="font-mono text-[11px] text-slate-500">
              #{email.id}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;

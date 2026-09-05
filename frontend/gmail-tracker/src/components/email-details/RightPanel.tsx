import type { TrackedEmailB } from "@/services/trackedEmail";
import { formatDeadline, formatSentDate } from "@/utils/dateFormatter";
import { getTrackedEmailStatus } from "@/utils/statusFilter";
import { CheckCircle2, Clock, Hash, Send, ShieldCheck } from "lucide-react";

interface RightPanelProps {
  email: TrackedEmailB;
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
  const status = getTrackedEmailStatus(email.is_done, email.deadline);

  return (
    <div className="space-y-4">
      {/* Response Progress Summary Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4 font-sans text-left">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-[#3525cd]" />
            <span>Response Progress</span>
          </h4>
          <span className="font-mono text-xs font-bold text-[#3525cd] bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
            {completionPercentage}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#3525cd] h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(completionPercentage, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-sans">
            <span>Overall completion</span>
            <span className="font-medium text-slate-700">
              {respondedCount} of {totalCount} received
            </span>
          </div>
        </div>

        {/* Breakdown mini-grid */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-2.5 space-y-0.5">
            <span className="text-[10px] text-slate-500 font-medium block">
              Required
            </span>
            <span className="font-mono text-xs font-bold text-slate-900">
              {requiredRespondedCount} / {requiredCount}
            </span>
          </div>
          <div className="bg-slate-50/80 border border-slate-200/70 rounded-xl p-2.5 space-y-0.5">
            <span className="text-[10px] text-slate-500 font-medium block">
              Awaiting
            </span>
            <span className="font-mono text-xs font-bold text-amber-600">
              {totalCount - respondedCount}
            </span>
          </div>
        </div>
      </div>

      {/* SLA Metrics and Thread specs */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3 font-sans text-left">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-100">
          <ShieldCheck size={14} className="text-slate-500" />
          <span>SLA & Thread Specs</span>
        </h4>

        <div className="space-y-2 text-xs font-sans">
          <div className="flex items-center justify-between text-slate-600 py-1 border-b border-slate-100">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Clock size={12} className="text-slate-400" />
              Tracking Status
            </span>
            <span className="font-semibold text-slate-800">{status}</span>
          </div>

          <div className="flex items-center justify-between text-slate-600 py-1 border-b border-slate-100">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Clock size={12} className="text-slate-400" />
              Target Deadline
            </span>
            <span className="font-mono text-[11px] font-semibold text-slate-800">
              {formatDeadline(email.deadline)}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-600 py-1 border-b border-slate-100">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Send size={12} className="text-slate-400" />
              Sent Timestamp
            </span>
            <span className="font-mono text-[11px] text-slate-700">
              {formatSentDate(email.sent_date)}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-600 py-1">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Hash size={12} className="text-slate-400" />
              Tracked ID
            </span>
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

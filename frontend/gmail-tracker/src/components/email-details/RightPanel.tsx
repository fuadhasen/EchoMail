import type { TrackedEmailB } from "@/services/trackedEmail";
import { formatDeadline, formatSentDate } from "@/utils/dateFormatter";
import { getTrackedEmailStatus } from "@/utils/statusFilter";

interface RightPanelProps {
  email: TrackedEmailB;
  respondedCount: number;
  totalCount: number;
  requiredCount: number;
  requiredRespondedCount: number;
  completionPercentage: number;
}

const RightPanel = ({ email }: RightPanelProps) => {
  const status = getTrackedEmailStatus(email.is_done, email.deadline);

  return (
    <div className="space-y-4">
      {/* SLA Metrics and Thread specs*/}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4.5 shadow-2xs space-y-3">
        <h4 className="font-sans text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          SLA & Thread Info
        </h4>

        <div className="space-y-2 text-xs font-sans">
          <div className="flex items-center justify-between text-slate-600 py-1 border-b border-slate-100">
            <span className="text-slate-500">Tracking Status</span>
            <span className="font-semibold text-slate-800">{status}</span>
          </div>

          <div className="flex items-center justify-between text-slate-600 py-1 border-b border-slate-100">
            <span className="text-slate-500">Target Deadline</span>
            <span className="font-mono text-[11px] font-semibold text-slate-800">
              {formatDeadline(email.deadline)}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-600 py-1 border-b border-slate-100">
            <span className="text-slate-500">Sent Timestamp</span>
            <span className="font-mono text-[11px] text-slate-700">
              {formatSentDate(email.sent_date)}
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

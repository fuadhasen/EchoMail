import type { TrackedEmailB } from "@/services/trackedEmail";
import { formatDeadline } from "@/utils/dateFormatter";
import { getTrackedEmailStatus } from "@/utils/statusFilter";
import { CheckCircle2, ChevronRight, Clock, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router";

interface NeedsAttentionProps {
  emails: TrackedEmailB[];
  totalTracked: number;
}

const NeedsAttention = ({ emails, totalTracked }: NeedsAttentionProps) => {
  const navigate = useNavigate();

  // sorted using action urgency
  const sortedEmails = [...emails].sort((a, b) => {
    const aUnrespondedRecipient = a.recipients.filter(
      (r) => !r.has_responded,
    ).length;
    const bUnrespondedRecipient = b.recipients.filter(
      (r) => !r.has_responded,
    ).length;

    return bUnrespondedRecipient - aUnrespondedRecipient;
  });

  // Take Top 3 for compact card view
  const displayEmails = sortedEmails.slice(0, 3);

  return (
    <section className="bg-white border border-[#c7c4d8]/30 rounded-2xl overflow-hidden shadow-sm flex flex-col">
      {/* List Header */}
      <div className="px-6 py-5 border-b border-[#c7c4d8]/20 flex justify-between items-center bg-white">
        <div className="flex items-center gap-2">
          <h3 className="font-sans text-base font-bold text-[#0b1c30]">
            Needs Attention
          </h3>
          <span className="bg-[#eff4ff] text-[#3525cd] text-xs font-bold px-2 py-0.5 rounded-full border border-[#c7c4d8]/10">
            {emails.length}
          </span>
        </div>
        <HelpCircle className="w-4 h-4 text-[#777587] cursor-help opacity-70 hover:opacity-100 transition-opacity " />
      </div>

      {/* compact content*/}
      {emails.length == 0 ? (
        totalTracked === 0 ? (
          // First-time user
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-2">
            <div className="w-9 h-9 rounded-xl  bg-emerald-50 text-emerald-600 border border-emerald-200/60  flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
            <h4 className="font-sans text-xs font-bold text-slate-900">
              Nothing to review
            </h4>
            <p className="font-sans text-xs text-slate-500">
              Track an email to see conversations that need your attention.
            </p>
          </div>
        ) : (
          // Existing user, nothing needs attention
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-2">
            <div className="w-9 h-9 rounded-xl  bg-emerald-50 text-emerald-600 border border-emerald-200/60  flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
            <h4 className="font-sans text-xs font-bold text-slate-900">
              All caught up
            </h4>
            <p className="font-sans text-xs text-slate-500">
              No emails currently require immediate attention.
            </p>
          </div>
        )
      ) : (
        <div className="divide-y divide-[#c7c4d8]/15 flex flex-col">
          {displayEmails.map((email) => {
            const totalRecipients = email.recipients.length;

            const d = email.deadline.toLowerCase();
            const status = getTrackedEmailStatus(email.is_done, email.deadline);
            const isOverdue = status === "Overdue" || d.includes("overdue");

            const isDueTomorrow = d.includes("tomorrow") || d.includes("1 day");

            let statusTag = "Reminder Needed";
            let tagStyle = "bg-amber-50 text-amber-800 border-amber-200/80";

            if (isOverdue) {
              statusTag = "Overdue";
              tagStyle = "bg-rose-50 text-rose-700 border-rose-200/80";
            } else if (isDueTomorrow) {
              statusTag = "Due Tomorrow";
              tagStyle = "bg-amber-50 text-amber-800 border-amber-200/80";
            } else {
              statusTag = "Reminder Needed";
              tagStyle = "bg-indigo-50 text-[#3525cd] border-indigo-200/80";
            }

            const respondedRecipient = email.recipients.filter(
              (r) => r.has_responded,
            ).length;

            return (
              <div
                key={email.id}
                onClick={() => navigate(`tracked/detail/${email.id}`)}
                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all cursor-pointer duration-150 group"
              >
                {/* Subject and sub details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-sans text-sm font-bold text-[#0b1c30] truncate group-hover:text-[#3525cd]  transition-colors">
                    {email.subject}
                  </h4>
                  <p className="font-sans text-xs text-[#777587] mt-1.5 flex items-center gap-1.5">
                    {respondedRecipient}
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#c7c4d8]" />
                    <span>{totalRecipients} Responded</span>
                    <span className="font-mono text-[11px] text-[#777587] bg-[#f8f9ff] px-1.5 py-0.5 rounded border border-[#c7c4d8]/20 inline-flex items-center gap-1.5">
                      <Clock size={11} className="text-slate-400" />
                      {formatDeadline(email.deadline)}
                    </span>
                  </p>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <span
                    className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border ${tagStyle}`}
                  >
                    {statusTag}
                  </span>

                  <ChevronRight
                    size={14}
                    className="text-slate-400 group-hover:text-[#3525cd] group-hover:translate-x-0.5 transition-all"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {emails.length > 3 && (
        <div className="p-3  bg-slate-50/50 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={() => navigate("tracked")}
            className="text-xs font-sans font-semibold text-[#3525cd] hover:text-[#281ca8] transition-colors"
          >
            view all {emails.length} attention items →
          </button>
        </div>
      )}
    </section>
  );
};

export default NeedsAttention;

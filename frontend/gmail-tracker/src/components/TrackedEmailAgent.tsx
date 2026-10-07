import type { TrackedEmailB } from "@/services/trackedEmail";
import { CheckCircle2, Clock, Mail } from "lucide-react";

type TrackedEmailAgentResultsProps = {
  emails: TrackedEmailB[];
};

const TrackedEmailAgentResults = ({
  emails,
}: TrackedEmailAgentResultsProps) => {
  if (!emails || emails.length === 0) return null;

  return (
    <div className="mt-3.5 w-full min-w-0 space-y-2">
      <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
        Tracked {emails.length === 1 ? "thread" : "threads"} ({emails.length})
      </div>
      <div className="divide-y divide-slate-100 rounded-xl border border-slate-200/80 bg-slate-50/70 overflow-hidden shadow-2xs">
        {emails.map((email) => {
          const requiredRecipients =
            email.recipients?.filter((recipient) => recipient.must_respond) ??
            [];

          const respondedRecipients = requiredRecipients.filter(
            (recipient) => recipient.has_responded,
          );

          const pendingRecipients = requiredRecipients.filter(
            (recipient) => !recipient.has_responded,
          );

          return (
            <div
              key={email.id}
              className="p-3 sm:p-3.5 w-full min-w-0 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#eff4ff] border border-[#3525cd]/15 flex items-center justify-center text-[#3525cd] shrink-0 mt-0.5">
                  <Mail size={13} className="stroke-2" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 break-words min-w-0 flex-1">
                      {email.subject}
                    </p>
                    {/* Status badge */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {email.is_done ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2
                            size={12}
                            className="text-emerald-600 shrink-0"
                          />
                          <span>Completed</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock size={12} className="text-amber-600 shrink-0" />
                          <span>Tracking</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Response summary */}
                  <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-slate-500 font-sans">
                    <span className="text-emerald-700 font-medium">
                      {respondedRecipients.length} responded
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-amber-700 font-medium">
                      {pendingRecipients.length} pending
                    </span>
                    {email.deadline && (
                      <>
                        <span className="text-slate-300">·</span>
                        <span className="text-slate-400">
                          Deadline: {email.deadline.split("T")[0]}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrackedEmailAgentResults;

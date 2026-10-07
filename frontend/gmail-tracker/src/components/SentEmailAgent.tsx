import { Mail, Calendar } from "lucide-react";
import type { SentEmail } from "@/type";
import { formatSentDate } from "@/utils/dateFormatter";

type SentEmailResultsProps = {
  emails: SentEmail[];
};

const SentEmailAgentResults = ({ emails }: SentEmailResultsProps) => {
  if (!emails || emails.length === 0) return null;

  return (
    <div className="mt-3.5 w-full min-w-0 space-y-2">
      <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
        Found {emails.length} outbox {emails.length === 1 ? "thread" : "threads"}
      </div>
      <div className="divide-y divide-slate-100 rounded-xl border border-slate-200/80 bg-slate-50/70 overflow-hidden shadow-2xs">
        {emails.map((email) => (
          <div
            key={email.id}
            className="p-3 sm:p-3.5 w-full min-w-0 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#eff4ff] border border-[#3525cd]/15 flex items-center justify-center text-[#3525cd] shrink-0 mt-0.5">
                <Mail size={13} className="stroke-2" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-semibold text-slate-900 break-words">
                  {email.subject}
                </p>

                {email.snippet && (
                  <p className="mt-1 text-xs text-slate-600 line-clamp-2 break-words leading-relaxed">
                    {email.snippet}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1 text-slate-500">
                    <Calendar size={11} className="shrink-0 text-slate-400" />
                    <span>Sent: {formatSentDate(email.sentDate)}</span>
                  </div>
                  {email.recipients && email.recipients.length > 0 && (
                    <span className="text-slate-400 truncate max-w-xs">
                      To: {email.recipients.map((r) => r.name || r.email).join(", ")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SentEmailAgentResults;

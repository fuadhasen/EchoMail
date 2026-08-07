import type { TrackedEmail } from "@/data/mockTrackedEmails";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  CheckCircle2,
  HelpCircle,
  UserCheck,
} from "lucide-react";
import { useNavigate } from "react-router";

interface NeedsAttentionProps {
  emails: TrackedEmail[];
}

const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case "overdue":
      return {
        badge: "bg-[#ffdad6] text-[#ba1a1a] border-[#ffdad6]/50",
        icon: <AlertCircle className="w-3.5 h-3.5 text-[#ba1a1a]" />,
      };
    case "due tomorrow":
      return {
        badge: "bg-[#ffdbcc] text-[#7e3000] border-[#ffdbcc]/50",
        icon: <Calendar className="w-3.5 h-3.5 text-[#7e3000]" />,
      };
    case "reminder needed":
    default:
      return {
        badge: "bg-[#e2dfff] text-[#3525cd] border-[#e2dfff]/50",
        icon: <UserCheck className="w-3.5 h-3.5 text-[#3525cd]" />,
      };
  }
};

const NeedsAttention = ({ emails }: NeedsAttentionProps) => {
  const navigate = useNavigate();

  // prioritize emails by urgency: overdue first, then closest deadline
  const sortedEmails = [...emails].sort((a, b) => {
    const aOverdue =
      a.status === "Overdue" || a.deadline.toLowerCase().includes("overdue");
    const bOverdue =
      b.status === "Overdue" || b.deadline.toLowerCase().includes("overdue");

    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;

    const aDueSoon =
      a.deadline.toLowerCase().includes("tomorrow") ||
      a.deadline.toLowerCase().includes("1 day");
    const bDueSoon =
      b.deadline.toLowerCase().includes("tomorrow") ||
      b.deadline.toLowerCase().includes("1 day");

    if (aDueSoon && !bDueSoon) return -1;
    if (!aDueSoon && bDueSoon) return 1;

    return 0;
  });

  // Take Top 3 for compact card view
  const displayEmails = sortedEmails.slice(0, 4);

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
      ) : (
        <div className="divide-y divide-[#c7c4d8]/15 flex flex-col">
          {displayEmails.map((email) => {
            const totalRecipients = email.recipients.length;

            const d = email.deadline.toLowerCase();
            const isOverdue =
              email.status === "Overdue" || d.includes("overdue");

            const isDueTomorrow = d.includes("tomorrow") || d.includes("1 day");

            let daysLeftText = email.deadline;/
            if (d.includes('due in')) {
              daysLeftText = email.deadline.replace(/Due in /i, '') + 'left'
            }

            return (
              <div
                key={item.id}
                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#eff4ff]/10 transition-colors"
              >
                {/* Subject and sub details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-sans text-sm font-bold text-[#0b1c30] truncate hover:text-[#3525cd] transition-colors">
                    {item.subject}
                  </h4>
                  <p className="font-sans text-xs text-[#777587] mt-1.5 flex items-center gap-1.5">
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#c7c4d8]" />
                    <span>
                      {item.pendingRecipients} pending{" "}
                      {item.pendingRecipients == 1 ? "recipient" : "recipients"}
                    </span>
                    <span className="text-[#c7c4d8">•</span>
                    <span className="font-mono text-[11px] text-[#777587] bg-[#f8f9ff] px-1.5 py-0.5 rounded border border-[#c7c4d8]/20">
                      {item.daysLeft}
                    </span>
                  </p>
                </div>
   
                {/* Status Badge */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${style.badge}`}
                  >
                    {style.icon} {item.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default NeedsAttention;

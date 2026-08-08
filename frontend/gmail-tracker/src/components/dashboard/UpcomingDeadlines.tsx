import type { TrackedEmailB } from "@/services/trackedEmail";
import { Card } from "@radix-ui/themes";
import { Calendar, CalendarClock } from "lucide-react";
import { useNavigate } from "react-router";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { getTrackedEmailStatus } from "@/utils/statusFilter";
import { formatDeadline } from "@/utils/dateFormatter";

export interface UpcomingDeadlineProps {
  emails: TrackedEmailB[];
}

const UpcomingDeadlines = ({ emails }: UpcomingDeadlineProps) => {
  const navigate = useNavigate();

  // active non completed emails sorted by deadline urgency
  const activeDeadlines = emails.filter((e) => {
    const status = getTrackedEmailStatus(e.is_done, e.deadline);
    return status !== "Completed";
  });

  const sortedEmails = [...activeDeadlines].sort((a, b) => {
    const astatus = getTrackedEmailStatus(a.is_done, a.deadline);
    const bstatus = getTrackedEmailStatus(b.is_done, b.deadline);
    const aOverdue =
      astatus === "Overdue" || a.deadline.toLowerCase().includes("overdue");
    const bOverdue =
      bstatus === "Overdue" || b.deadline.toLowerCase().includes("overdue");

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
  const displayDeadlines = sortedEmails.slice(0, 3);

  return (
    <Card className="shadow-sm border border-slate-100 bg-white rounded-xl">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2.5">
          {/* Blue-themed icon container to match the styling language */}
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <CalendarClock className="h-4 w-4" />
          </div>
          <CardTitle className="text-sm font-bold text-slate-750">
            Upcoming Deadlines
          </CardTitle>
        </div>
        {/* Count badge on the top right */}
        <span className="text-xs font-medium text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
          {activeDeadlines.length} Active
        </span>
      </CardHeader>

      <CardContent className="px-1 pb-1">
        {activeDeadlines.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">
            No Upcoming deadlines. All active emails are up to date!
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {displayDeadlines.map((email) => {
              // Optional: Highlight urgent deadlines (e.g., 2 days or less) with a warm/red tint

              const status = getTrackedEmailStatus(
                email.is_done,
                email.deadline,
              );

              const isOverdue =
                status === "Overdue" ||
                email.deadline.toLowerCase().includes("overdue");

              return (
                <div
                  key={email.id}
                  onClick={() => navigate(`tracked/detail/${email.id}`)}
                  className="px-5 py-4 hover:bg-slate-50/50 transition-all duration-200 group first:pt-2 last:pb-4 last:border-0 rounded-lg cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-sans text-sm font-bold text-[#0b1c30] truncate">
                      {email.subject}
                    </h3>
                    {/* Styled days-left indicator as a pill badge */}
                    <span
                      className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border  ${
                        isOverdue
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {formatDeadline(email.deadline)}
                    </span>
                  </div>

                  {/* Sub-details displaying the exact due date */}
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingDeadlines;

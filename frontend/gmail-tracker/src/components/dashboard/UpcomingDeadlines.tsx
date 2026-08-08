import { Card } from "@radix-ui/themes";
import React from "react";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { Calendar, CalendarClock } from "lucide-react";
import type { TrackedEmail } from "@/data/mockTrackedEmails";
import { useNavigate } from "react-router";

export interface UpcomingDeadlineProps {
  emails: TrackedEmail[];
}

const UpcomingDeadlines = ({ emails }: UpcomingDeadlineProps) => {
  const navigate = useNavigate();

  // active non completed emails sorted by deadline urgency
  const activeDeadlines = emails.filter((e) => e.status !== "Completed");

  const sortedEmails = [...activeDeadlines].sort((a, b) => {
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
  const displayDeadlines = sortedEmails.slice(0, 4);

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

              const isOverdue =
                email.status === "Overdue" ||
                email.deadline.toLowerCase().includes("overdue");

              const d = email.deadline.toLowerCase();

              let daysLeftText = email.deadline;
              if (d.includes("due in")) {
                daysLeftText = email.deadline.replace(/Due in /i, "") + " left";
              } else if (d.includes("overdue by ")) {
                daysLeftText =
                  email.deadline.replace(/Overdue by /i, "") + " overdue";
              }

              return (
                <div
                  key={email.id}
                  onClick={() => navigate(`tracked/detail/${email.id}`)}
                  className="px-5 py-4 hover:bg-slate-50/50 transition-all duration-200 group first:pt-2 last:pb-4 last:border-0 rounded-lg cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-medium text-sm text-slate-800 group-hover:text-slate-950 transition-colors">
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
                      {email.deadline}
                    </span>
                  </div>

                  {/* Sub-details displaying the exact due date */}
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span> {daysLeftText}</span>
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

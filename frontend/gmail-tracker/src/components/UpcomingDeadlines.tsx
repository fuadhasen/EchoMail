import { Card } from "@radix-ui/themes";
import React from "react";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { Calendar, CalendarClock } from "lucide-react";

const upcomingDeadlines = [
  {
    id: 1,
    subject: "Client Feedback Request",
    deadline: "Jun 15, 2026",
    daysLeft: 1,
  },
  {
    id: 2,
    subject: "Partnership Proposal",
    deadline: "Jun 17, 2026",
    daysLeft: 3,
  },
  {
    id: 3,
    subject: "Project Approval",
    deadline: "Jun 20, 2026",
    daysLeft: 6,
  },
];

const UpcomingDeadlines = () => {
  return (
    <Card className="shadow-sm border border-slate-100 bg-white rounded-xl">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2.5">
          {/* Blue-themed icon container to match the styling language */}
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <CalendarClock className="h-4 w-4" />
          </div>
          <CardTitle className="text-base font-semibold text-slate-950">
            Upcoming Deadlines
          </CardTitle>
        </div>
        {/* Count badge on the top right */}
        <span className="text-xs font-medium text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
          {upcomingDeadlines.length}
        </span>
      </CardHeader>

      <CardContent className="px-1 pb-1">
        <div className="divide-y divide-slate-100">
          {upcomingDeadlines.map((item) => {
            // Optional: Highlight urgent deadlines (e.g., 2 days or less) with a warm/red tint
            const isUrgent = item.daysLeft <= 2;
            const badgeClass = isUrgent
              ? "bg-rose-50 text-rose-700 border border-rose-100"
              : "bg-slate-50 text-slate-600 border border-slate-100";

            return (
              <div
                key={item.id}
                className="px-5 py-4 hover:bg-slate-50/50 transition-all duration-200 group first:pt-2 last:pb-4 last:border-0 rounded-lg cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-medium text-sm text-slate-800 group-hover:text-slate-950 transition-colors">
                    {item.subject}
                  </h3>
                  {/* Styled days-left indicator as a pill badge */}
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}
                  >
                    {item.daysLeft} {item.daysLeft === 1 ? "day" : "days"} left
                  </span>
                </div>

                {/* Sub-details displaying the exact due date */}
                <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>Due {item.deadline}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingDeadlines;

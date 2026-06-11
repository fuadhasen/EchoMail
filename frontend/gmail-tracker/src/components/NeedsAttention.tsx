import React from "react";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from "../components/ui/card";
import { AlertTriangle, Users } from "lucide-react";

const needsAttention = [
  {
    id: 1,
    subject: "Partnership Proposal",
    pendingRecipients: 3,
    status: "Overdue",
  },
  {
    id: 2,
    subject: "Client Feedback Request",
    pendingRecipients: 1,
    status: "Due Tomorrow",
  },
  {
    id: 3,
    subject: "Job Application Follow-up",
    pendingRecipients: 2,
    status: "Reminder Needed",
  },
];

// Helper to apply dynamic badge styles based on the status
const getStatusBadgeClass = (status) => {
  switch (status) {
    case "Overdue":
      return "bg-rose-50 text-rose-700 border border-rose-100";
    case "Due Tomorrow":
      return "bg-amber-50 text-amber-700 border border-amber-100";
    case "Reminder Needed":
      return "bg-indigo-50 text-indigo-700 border border-indigo-100";
    default:
      return "bg-slate-50 text-slate-700 border border-slate-100";
  }
};

const NeedsAttention = () => {
  return (
    <Card className="ring-0 shadow-sm border border-slate-100 bg-white rounded-xl">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <CardTitle className="text-base font-semibold text-slate-950">
            Needs Attention
          </CardTitle>
        </div>
        <span className="text-xs font-medium text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
          {needsAttention.length}
        </span>
      </CardHeader>

      <CardContent className="px-1 pb-1">
        <div className="divide-y divide-slate-100">
          {needsAttention.map((item) => (
            <div
              key={item.id}
              className="px-5 py-4 hover:bg-slate-50/50 transition-all duration-200 group first:pt-2 last:pb-4 last:border-0 rounded-lg cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-medium text-sm text-slate-800 group-hover:text-slate-950 transition-colors">
                  {item.subject}
                </h3>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(item.status)}`}
                >
                  {item.status}
                </span>
              </div>

              <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500">
                <Users className="h-3.5 w-3.5 text-slate-400" />
                <span>
                  {item.pendingRecipients}{" "}
                  {item.pendingRecipients === 1
                    ? "recipient pending"
                    : "recipients pending"}{" "}
                  response
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NeedsAttention;

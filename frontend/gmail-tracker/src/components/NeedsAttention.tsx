import React from "react";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from "../components/ui/card";
import { AlertTriangle } from "lucide-react";

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

const NeedsAttention = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Needs Attention
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {needsAttention.map((item) => (
          <div
            key={item.id}
            className={`${item.id == needsAttention.length ? "" : "border-b"}  p-3 hover:bg-slate-50 transition1`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{item.subject}</h3>
              <span className="rounded-full bg-red-100 text-red-700 px-3 py-1 text-xs font-medium">
                {item.status}
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              {item.pendingRecipients} recipient's pending response
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default NeedsAttention;

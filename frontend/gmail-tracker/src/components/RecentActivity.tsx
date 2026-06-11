import React from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";

import { Mail, Reply, Bell, Clock3 } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "tracked",
    message: "New email tracked: Partnership Proposal",
    time: "2 min ago",
  },
  {
    id: 2,
    type: "response",
    message: "Sarah responded to Client Feedback Request",
    time: "1 hour ago",
  },
  {
    id: 3,
    type: "reminder",
    message: "Reminder sent to 3 recipients",
    time: "3 hours ago",
  },
  {
    id: 4,
    type: "tracked",
    message: "New email tracked: Job Application Follow-up",
    time: "Yesterday",
  },
];

const getActivityIcon = (type: string) => {
  switch (type) {
    case "tracked":
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
          <Mail className="h-4 w-4 text-blue-600" />
        </div>
      );
    case "response":
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
          <Reply className="h-4 w-4 text-emerald-600" />
        </div>
      );
    case "reminder":
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50">
          <Bell className="h-4 w-4 text-amber-600" />
        </div>
      );
    default:
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50">
          <Clock3 className="h-4 w-4 text-slate-600" />
        </div>
      );
  }
};

const RecentActivity = () => {
  return (
    <Card className="ring-0 border border-slate-200 shadow-sm bg-white rounded-xl">
      <CardHeader className="pb-3 flex items-center justify-between">
        <CardTitle className="text-base font-semibold text-slate-950">
          RecentActivity
        </CardTitle>
        <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-0.5 rounded-full">
          {activities.length}
        </span>
      </CardHeader>

      <CardContent>
        <div className="space-y=1">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 rounded-xl p-3 hover:bg-slate-50 transition-all duration-200 cursor-pointer"
            >
              {getActivityIcon(activity.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800">
                  {activity.message}
                </p>
                <p className="mt-1 text-xs text-slate-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;

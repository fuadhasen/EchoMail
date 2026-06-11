import { Card } from "@radix-ui/themes";
import React from "react";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
import { CalendarClock } from "lucide-react";

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
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-blue-500" />
          Upcoming Deadlines
        </CardTitle>
      </CardHeader>

      <CardContent>
        {upcomingDeadlines.map((item) => (
          <div key={item.id}>
            <div>
              <h3>{item.subject}</h3>
              <p>Due {item.deadline}</p>
            </div>
            <div>
              <p>{item.daysLeft}</p>
              <p>day{item.daysLeft > 1 ? "s" : ""} left</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default UpcomingDeadlines;

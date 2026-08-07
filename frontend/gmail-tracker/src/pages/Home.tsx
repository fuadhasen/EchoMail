import { getTrackedEmails, type TrackedEmail } from "@/data/mockTrackedEmails";
import AnalyticsPreview from "../components/dashboard/AnalyticsPreview";
import NeedsAttention from "../components/dashboard/NeedsAttention";
import RecentActivity from "../components/dashboard/RecentActivity";
import SummaryCards from "../components/dashboard/SummaryCards";
import UpcomingDeadlines from "@/components/dashboard/UpcomingDeadlines";
import { useNavigate } from "react-router";
import { useEffect, useMemo, useState } from "react";

const initialAttentionItems = [
  {
    id: 1,
    subject: "Partnership Proposal",
    pendingRecipients: 3,
    status: "Overdue",
    daysLeft: "2 days left",
  },
  {
    id: 2,
    subject: "Client Feedback Request",
    pendingRecipients: 1,
    status: "Due Tomorrow",
    daysLeft: "4 days left",
  },
  {
    id: 3,
    subject: "Job Application Follow-up",
    pendingRecipients: 2,
    status: "Reminder Needed",
    daysLeft: "3 days left",
  },
];

const initialActivities = [
  {
    id: 1,
    iconType: "reply",
    user: "David Smith",
    boldText: "David Smith",
    regularText: ' replied to "Q4 Planning"',
    timeLabel: "2 minutes ago",
  },
  {
    id: 2,
    iconType: "reminder",
    regularText: "Automatic reminder sent to Team Alpha",
    timeLabel: "45 minutes ago",
  },
  {
    id: 3,
    iconType: "view",
    user: "Marcus Roe",
    boldText: "Marcus Roe",
    regularText: ' opened "Agreement v2"',
    timeLabel: "2 hours ago",
  },
  {
    id: 4,
    iconType: "mail",
    regularText: 'New tracked message: "Client Kickoff"',
    timeLabel: "3 hours ago",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [emails, setEmails] = useState<TrackedEmail[]>([]);

  // load tracked emails
  useEffect(() => {
    const loaded = getTrackedEmails();
    setEmails(loaded);
  }, []);

  const totalTracked = emails.length;

  // awaiting responses count for all tracked emails
  const awaitingResponsesCount = useMemo(() => {
    return emails.filter((e) => {
      const pendingCount = e.recipients.filter((e) => !e.responded).length;
      return pendingCount > 0;
    }).length;
  }, [emails]);

  const completedThreadsCount = useMemo(() => {
    return emails.filter((e) => {
      return e.status === "Completed" || e.recipients.every((r) => r.responded);
    }).length;
  }, [emails]);

  const reminderDispatchedCount = useMemo(() => {
    let count = 0;
    emails.forEach((e) => {
      e.recipients.forEach((r) => {
        if (r.last_reminder_sent) {
          count++;
        }
      });
    });
    return count;
  }, [emails]);

  // Needs Attention list
  const needsAttentionEmails = useMemo(() => {
    return emails.filter((e) => {
      if (e.status === "Completed") return false;
      const pendingCount = e.recipients.filter((r) => !r.responded).length;
      return pendingCount > 0;
    });
  }, [emails]);

  return (
    <div className="space-y-8">
      {/* {welcom section} */}
      <section className="">
        <h1 className="text-4xl font-bold text-slate-950 tracking-tight font-sans">
          System Overview
        </h1>
        <p className="font-sans text-base text-[#464555] mt-1">
          Real-time performance of your communication loops.
        </p>
      </section>

      {/* Summary Cards */}
      <section>
        <div>
          <SummaryCards
            totalTracked={1284}
            awaitingResponses={42}
            responsesReceived={1140}
            needsAttention={130}
          />
        </div>
      </section>

      {/* {12 Column Responsive Layout Grid} */}
      <div className="grid grid-cols-12 gap-5">
        {/* left column section */}
        <div className="col-span-12 lg:col-span-8 space-y-8 flex flex-col justify-start">
          <NeedsAttention items={initialAttentionItems} />
          <AnalyticsPreview emails={emails} />
        </div>

        {/* right column section */}
        <div className="col-span-12 lg:col-span-4 space-y-8 flex flex-col justify-start">
          <UpcomingDeadlines />
          <RecentActivity emails={emails} />
        </div>
      </div>

      {/* footer */}
    </div>
  );
};

export default Home;

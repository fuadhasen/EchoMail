import UpcomingDeadlines from "@/components/dashboard/UpcomingDeadlines";
import useTrackedEmails from "@/hooks/useTrackedEmails";
import { getTrackedEmailStatus } from "@/utils/statusFilter";
import { useMemo } from "react";
import AnalyticsPreview from "../components/dashboard/AnalyticsPreview";
import NeedsAttention from "../components/dashboard/NeedsAttention";
import RecentActivity from "../components/dashboard/RecentActivity";
import SummaryCards from "../components/dashboard/SummaryCards";

const Home = () => {
  // need all tracked emails
  const { data: emails = [] } = useTrackedEmails(true);

  const totalTracked = emails.length;

  // awaiting responses count for all tracked emails
  const awaitingResponsesCount = useMemo(() => {
    return emails.filter((e) => {
      const pendingCount = e.recipients.filter((r) => !r.has_responded).length;
      return pendingCount > 0;
    }).length;
  }, [emails]);

  const completedThreadsCount = useMemo(() => {
    return emails.filter((e) => {
      const status = getTrackedEmailStatus(e.is_done, e.deadline);
      return (
        status === "Completed" || e.recipients.every((r) => r.has_responded)
      );
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

  // Needs Attention list, tracked email with more pending recipients
  const needsAttentionEmails = useMemo(() => {
    return emails.filter((e) => {
      if (e.is_done === true) return false;
      const pendingCount = e.recipients.filter((r) => !r.has_responded).length;
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
            totalTracked={totalTracked}
            awaitingResponses={awaitingResponsesCount}
            completedThreads={completedThreadsCount}
            remindersDispatched={reminderDispatchedCount}
          />
        </div>
      </section>

      {/* {12 Column Responsive Layout Grid} */}
      <div className="grid grid-cols-12 gap-5">
        {/* left column section */}
        <div className="col-span-12 lg:col-span-8 space-y-8 flex flex-col justify-start">
          <NeedsAttention
            emails={needsAttentionEmails}
            totalTracked={totalTracked}
          />
          <AnalyticsPreview emails={emails} />
        </div>

        {/* right column section */}
        <div className="col-span-12 lg:col-span-4 space-y-8 flex flex-col justify-start">
          <UpcomingDeadlines emails={emails} totalTracked={totalTracked} />
          <RecentActivity emails={emails} />
        </div>
      </div>

      {/* footer */}
    </div>
  );
};

export default Home;

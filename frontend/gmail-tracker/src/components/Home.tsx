// import { Heading } from "@radix-ui/themes";
// // import useTrackedEmails from "../hooks/useTrackedEmails";d
// import HomeSkeleton from "./HomeSkeleton";
// import res from "../data/mockTrackedEmails";
// import AnalyticsPreview from "./AnalyticsPreview";
// import NeedsAttention from "./NeedsAttention";
// import RecentActivity from "./RecentActivity";
import AnalyticsPreview from "./AnalyticsPreview";
import NeedsAttention from "./NeedsAttention";
import RecentActivity from "./RecentActivity";
// import RecentActivity from "./RecentActivity";
import SummaryCards from "./SummaryCards";
import UpcomingDeadlines from "./UpcomingDeadlines";
// import UpcomingDeadlines from "./UpcomingDeadlines";
// import UpcomingDeadlines from "./UpcomingDeadlines";

const Home = () => {
  // const url = "http://localhost:8000/tracked-emails?show_done=true";
  // const { res, error, isPending } = useTrackedEmails(url);
  return (
    <div className="space-y-8 p-8">
      {/* {welcom section} */}
      <section className="">
        <h1 className="text-4xl font-semibold text-slate-950">Dashboared</h1>
      </section>
      {/* Summary Cards */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <SummaryCards title="Tracked Emails" value={128} />
          <SummaryCards title="Awaiting Response" value={34} />
          <SummaryCards title="Responses Received" value={82} />
          <SummaryCards title="Reminders Sent" value={19} />
        </div>
      </section>
      {/*Attention + Deadlines*/}
      <section>
        <div className="grid gap-6 lg:grid-cols-2">
          <NeedsAttention />
          <UpcomingDeadlines />
        </div>
      </section>

      {/* {anaylytics preview} */}
      <section>
        <AnalyticsPreview />
      </section>

      <section>
        <RecentActivity />
      </section>
    </div>
  );
};

export default Home;

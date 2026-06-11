// import { Heading } from "@radix-ui/themes";
// // import useTrackedEmails from "../hooks/useTrackedEmails";d
// import HomeSkeleton from "./HomeSkeleton";
// import res from "../data/mockTrackedEmails";
import AnalyticsPreview from "./AnalyticsPreview";
import NeedsAttention from "./NeedsAttention";
import SummaryCards from "./SummaryCards";
import UpcomingDeadlines from "./UpcomingDeadlines";

const Home = () => {
  // const url = "http://localhost:8000/tracked-emails?show_done=true";
  // const { res, error, isPending } = useTrackedEmails(url);
  return (
    <div className="space-y-8 p-8">
      {/* {welcom section} */}
      <section className="pl-4 border-l-2 border-indigo-500 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
          Welcome back,{" "}
          <span className="bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Fuad
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-500">
          Here's what is happening with your tracked emails.
        </p>
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

      {/* Attention + Deadlines */}
      <section>
        <div className="grid gap-6 lg:grid-cols-2">
          <NeedsAttention />
          <UpcomingDeadlines />
        </div>
      </section>

      {/* Analytics */}
      <section>
        <AnalyticsPreview />
      </section>

      {/* Activity */}
      <section>Recent Activity</section>
    </div>
  );
};

export default Home;

// import { Heading } from "@radix-ui/themes";
// // import useTrackedEmails from "../hooks/useTrackedEmails";d
// import HomeSkeleton from "./HomeSkeleton";
// import res from "../data/mockTrackedEmails";
import NeedsAttention from "./NeedsAttention";
import SummaryCards from "./SummaryCards";

const Home = () => {
  // const url = "http://localhost:8000/tracked-emails?show_done=true";
  // const { res, error, isPending } = useTrackedEmails(url);
  return (
    <div className="space-y-8 p-8">
      {/* {welcom section} */}
      <section>
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome Back, Fuad
        </h1>
        <p className="mt-1 text-slate-500">
          Here's What's happening with your tracked emails.
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
          <div>Upcoming deadlines</div>
        </div>
      </section>

      {/* Analytics */}
      <section>Analytics Preview</section>

      {/* Activity */}
      <section>Recent Activity</section>
    </div>
  );
};

export default Home;

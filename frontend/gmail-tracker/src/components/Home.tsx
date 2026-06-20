import SummaryCards from "./SummaryCards";

const Home = () => {
  // const url = "http://localhost:8000/tracked-emails?show_done=true";
  // const { res, error, isPending } = useTrackedEmails(url);
  return (
    <div className="space-y-8 p-8">
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <SummaryCards title="Tracked Emails" value={128} />
          <SummaryCards title="Awaiting Response" value={34} />
          <SummaryCards title="Responses Received" value={82} />
          <SummaryCards title="Reminders Sent" value={19} />
        </div>
      </section>
      {/*Attention + Deadlines*/}
      {/* <section>
        <div className="grid gap-6 lg:grid-cols-2">
          <NeedsAttention />
          <UpcomingDeadlines />
        </div>
      </section> */}

      {/* {anaylytics preview} */}
      {/* <section>
        <AnalyticsPreview />
      </section>

      <section>
        <RecentActivity />
      </section> */}
    </div>
  );
};

export default Home;

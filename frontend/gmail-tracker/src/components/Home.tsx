import SummaryCards from "./SummaryCards";

// fetch the backend data (totaltracked, )
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
        <div>
          <SummaryCards
            totalTracked={1284}
            awaitingResponses={42}
            responsesReceived={1140}
            needsAttention={130}
          />
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

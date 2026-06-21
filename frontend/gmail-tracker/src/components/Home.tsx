import AnalyticsPreview from "./AnalyticsPreview";
import NeedsAttention from "./NeedsAttention";
import SummaryCards from "./SummaryCards";

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

      {/* {12 Column Responsive Layout Grid} */}
      <div>
        {/* left column section */}
        <div>
          <NeedsAttention items={initialAttentionItems} />
          <AnalyticsPreview />
        </div>

        {/* right column section */}
        <div></div>
      </div>

      {/* footer */}
    </div>
  );
};

export default Home;

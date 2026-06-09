import { Heading } from "@radix-ui/themes";
// import useTrackedEmails from "../hooks/useTrackedEmails";d
import HomeSkeleton from "./HomeSkeleton";
import res from "../data/mockTrackedEmails";

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
      <section>Summary Cards</section>

      {/* Attention + Deadlines */}
      <section>Needs Attention + Upcoming deadlines</section>

      {/* Analytics */}
      <section>Analytics Preview</section>

      {/* Activity */}
      <section>Recent Activity</section>
    </div>
  );
};

export default Home;

import TrackedEmailCard from "@/components/trackedemails/TrackedEmailCard";
import TrackedEmailEmpty from "@/components/trackedemails/TrackedEmailEmpty";
import TrackedEmailFilter from "@/components/trackedemails/TrackedEmailFilter";
import TrackedEmailSkeleton from "@/components/trackedemails/TrackedEmailSkeleton";
import useTrackedEmails from "@/hooks/useTrackedEmails";
import type { TrackedEmailB } from "@/services/trackedEmail";
import { getTrackedEmailStatus } from "@/utils/statusFilter";
import { Plus, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

const TrackedEmails = () => {
  const [showDone, setShowDone] = useState(false);
  const { data: emails = [], isPending, error } = useTrackedEmails(showDone);

  const [isSyncing, setIsSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // compute active vs all
  const activeEmails = useMemo(() => {
    return emails.filter((e) => {
      const status = getTrackedEmailStatus(e.is_done, e.deadline);
      return !e.is_done && status !== "Completed";
    });
  }, [emails]);

  const baseEmails = useMemo(() => {
    return showDone === false ? activeEmails : emails;
  }, [showDone, activeEmails, emails]);

  const handleSyncOutbox = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 600);
  };

  // filter logic
  const filteredEmails: TrackedEmailB[] = useMemo(() => {
    return baseEmails.filter((email) => {
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query || email.subject.toLowerCase().includes(query);

      return matchesSearch;
    });
  }, [baseEmails, searchTerm]);

  const handleResetFilter = () => {
    setSearchTerm("");
  };

  return (
    <div className="w-full text-left px-4 md:px-8 py-4 ">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-5 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Tracked Emails
          </h1>
          <p className="font-sans text-xs md:text-sm text-slate-500 mt-1  max-w-xl leading-relaxed font-normal">
            Monitor response deadlines and stay informed on key email follow-ups
          </p>
        </div>

        {/* header action buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleSyncOutbox}
            disabled={isSyncing}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 hover:border-slate-300  px-3.5 py-2.5 rounded-xl font-sans text-xs font-semibold transition-all shadow-2xs flex items-center gap-2 disabled:opacity-60 cursor-pointer"
            title="Sync Outbox"
          >
            <RefreshCw
              size={13}
              className={`text-slate-500 ${isSyncing ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Sync Outbox</span>
          </button>
          <Link
            to={"/app/track_new"}
            className="bg-[#3525cd] hover:bg-[#281ca8] text-white px-4 py-2.5 rounded-xl  font-sans text-xs font-semibold tracking-wide flex items-center justify-center gap-2  shadow-2xs hover:shadow-xs transition-all cursor-pointer shrink-0 group "
          >
            <Plus size={15} className="stroke-2.5" />
            <span>Track New Email</span>
          </Link>
        </div>
      </div>

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* main workspace */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          {/* Active / All segmented control and search bar */}
          <TrackedEmailFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            showDone={showDone}
            onTabChange={setShowDone}
          />

          {/* List / Loading /Empty States */}
          {isPending ? (
            <TrackedEmailSkeleton />
          ) : emails.length === 0 ? (
            <TrackedEmailEmpty type="empty" />
          ) : filteredEmails.length === 0 ? (
            <TrackedEmailEmpty
              type="no-results"
              onResetFilter={handleResetFilter}
            />
          ) : (
            <div className="space-y-3">
              {filteredEmails.map((email) => {
                const status = getTrackedEmailStatus(
                  email.is_done,
                  email.deadline,
                );

                return (
                  <TrackedEmailCard
                    key={email.id}
                    email={email}
                    status={status}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
    // </div>
  );
};

export default TrackedEmails;

import TrackedEmailCard from "@/components/trackedemails/TrackedEmailCard";
import TrackedEmailEmpty from "@/components/trackedemails/TrackedEmailEmpty";
import TrackedEmailFilter from "@/components/trackedemails/TrackedEmailFilter";
import TrackedEmailSkeleton from "@/components/trackedemails/TrackedEmailSkeleton";
import useTrackedEmails from "@/hooks/useTrackedEmails";
import type { TrackedEmailB } from "@/services/trackedEmail";
import { getTrackedEmailStatus } from "@/statusFilter";
import { ArrowRight, Clock, Plus, RefreshCw, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

const TrackedEmails = () => {
  const [showDone, setShowDone] = useState(false);
  const { data: emails = [], isPending, error } = useTrackedEmails(showDone);
  console.log(emails);

  const [isSyncing, setIsSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // compute active vs all
  const activeEmails = useMemo(() => {
    return emails.filter((e) => {
      const status = getTrackedEmailStatus(e.isDone, e.deadline);
      return !e.isDone && status !== "Completed";
    });
  }, [emails]);

  const activeCount = activeEmails.length;
  const allCount = emails.length;

  const baseEmails = useMemo(() => {
    return showDone === false ? activeEmails : emails;
  }, [showDone, activeEmails, emails]);

  const handleSyncOutbox = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 600);
  };

  // upcoming deadline for the right preview panel
  const pendingDeadline = useMemo(() => {
    return emails.filter((e) => e.isDone !== true).slice(0, 4);
  }, [emails]);

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
    <div className="w-full text-left px-4 md:px-8 py-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-5 border-b border-slate-200/80">
        <div>
          <h1 className="font-sans text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
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
            to={"/track_new"}
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
            activeCount={activeCount}
            allCount={allCount}
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
                  email.isDone,
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

        {/* Right side preview */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-4">
          {/* pending deadline */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold  text-slate-900 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Clock size={14} className="text-[#3525cd]" />
                Pending Deadline
              </h3>
            </div>

            {pendingDeadline.length === 0 ? (
              <p className="text-xs text-slate-400 py-1 font-sans">
                No pending response SLAs.
              </p>
            ) : (
              <div className="space-y-2.5">
                {pendingDeadline.map((item) => {
                  const status = getTrackedEmailStatus(
                    item.isDone,
                    item.deadline,
                  );

                  return (
                    <Link
                      to={`/tracked/detail/${item.id}`}
                      className="block bg-slate-50/60 hover:bg-slate-100/70 border border-slate-200/60 p-2.5 rounded-xl transition-all group/item"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-sans text-xs font-semibold text-slate-800 group-hover/item:text-[#3525cd] transition-colors line-clamp-1">
                          {item.subject}
                        </h4>
                        {status === "Overdue" ? (
                          <span className="text-[9px] font-medium text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200/60 shrink-0">
                            overdue
                          </span>
                        ) : (
                          <span className="text-[9px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200/60 shrink-0">
                            Waiting
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                        <span>{item.deadline}</span>
                        <ArrowRight
                          size={11}
                          className="group-hover/item:translate-x-0.5 transition-transform text-[#3525cd]"
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* quick tracking action */}
          <div className="bg-linear-to from-white via-slate-50/50 to-[#f8f9ff] border border-slate-200/90 hover:border-[#3525cd]/30 rounded-2xl p-4.5 shadow-2xs hover:shadow-xs transition-all relative overflow-hidden group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#3525cd]/10 text-[#3525cd] flex items-center justify-center shrink-0">
                  <Zap size={15} className="fill-[#3525cd]/20" />
                </div>
                <h3 className="font-sans text-xs font-bold text-slate-900 uppercase tracking-wider">
                  SLA Tracking
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#3525cd] bg-[#3525cd]/10 px-2 py-0.5 rounded-full border border-[#3525cd]/20">
                Active
              </span>
            </div>

            <p className="font-sans text-xs text-slate-600 mb-3.5 leading-relaxed">
              Monitor response deadlines & SLA compliance automatically for all
              outbox conversations.
            </p>

            <Link
              to="track_new"
              className="w-full  bg-[#3525cd] hover:bg-[#281ca8] text-white py-2.5 px-4 rounded-xl  font-sans text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs hover:shadow-xs transition-all cursor-pointer group/btn"
            >
              <Plus size={14} className="stroke-2.5" />
              <span>Track New Conversation</span>
              <ArrowRight
                size={13}
                className="group-hover/btn:translate-x-0.5 transition-transform"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackedEmails;

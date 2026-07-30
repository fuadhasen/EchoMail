import { useToast } from "@/context/ToastContext";
import {
  AlertTriangle,
  ArrowUpDown,
  Calendar,
  CheckCircle,
  CheckCircle2,
  ClipboardList,
  Clock,
  Eye,
  History,
  Mail,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  User,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { getTrackedEmails, type TrackedEmail } from "../data/mockTrackedEmails";
import type { StatusFilterTypes } from "@/components/trackedemails/TrackedEmailFilter";
import TrackedEmailFilter from "@/components/trackedemails/TrackedEmailFilter";
import TrackedEmailSkeleton from "@/components/trackedemails/TrackedEmailSkeleton";
import TrackedEmailEmpty from "@/components/trackedemails/TrackedEmailEmpty";
import TrackedEmailCard from "@/components/trackedemails/TrackedEmailCard";

const TrackedEmails = () => {
  const [emails, setEmails] = useState<TrackedEmail[]>(() =>
    getTrackedEmails(),
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterTypes>("All");

  const [deadlineFilter, setDeadlineFilter] = useState<
    "All" | "Overdue" | "Soon" | "Completed"
  >("All");

  // load data on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setEmails(getTrackedEmails());
      setIsLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  const handleSyncOutbox = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setEmails(getTrackedEmails());
      setIsSyncing(false);
    }, 600);
  };

  // compute status count
  const count = useMemo(() => {
    const all = emails.length;
    const waiting = emails.filter((e) => e.status === "Pending").length;
    const completed = emails.filter((e) => e.status === "Completed").length;
    const overdue = emails.filter((e) => e.status === "Overdue").length;

    return { all, waiting, completed, overdue };
  }, [emails]);

  // upcoming deadline for the right preview panel
  const pendingDeadline = useMemo(() => {
    return emails.filter((e) => e.status !== "Completed").slice(0, 4);
  }, [emails]);

  // filter logic
  const filteredEmails: TrackedEmail[] = useMemo(() => {
    return emails.filter((email) => {
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query || email.subject.toLowerCase().includes(query);

      let matchesStatus = true;
      if (statusFilter === "Waiting") {
        matchesStatus = email.status === "Pending";
      } else if (statusFilter === "Completed") {
        matchesStatus = email.status === "Completed";
      } else if (statusFilter === "Overdue") {
        matchesStatus = email.status === "Overdue";
      }

      return matchesSearch && matchesStatus;
    });
  }, [emails, searchTerm, statusFilter]);

  const handleResetFilter = () => {
    setSearchTerm("");
    setStatusFilter("All");
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
          <TrackedEmailFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            counts={count}
          />

          {/* List / Loading /Empty States */}
          {isLoading ? (
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
              {filteredEmails.map((email) => (
                <TrackedEmailCard key={email.id} email={email} />
              ))}
            </div>
          )}
        </div>

        {/* Right side preview */}
        <div>Right side</div>
      </div>
    </div>
  );
};

export default TrackedEmails;

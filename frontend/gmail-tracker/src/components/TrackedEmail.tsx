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
  Search,
  SlidersHorizontal,
  User,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  getTrackedEmails,
  type TrackedEmail,
} from "..//data/mockTrackedEmails";

const TrackedEmails = () => {
  const { triggerToast } = useToast();
  const [emails, setEmails] = useState<TrackedEmail[]>(() =>
    getTrackedEmails(),
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Pending" | "Completed" | "Overdue"
  >("All");
  const [deadlineFilter, setDeadlineFilter] = useState<
    "All" | "Overdue" | "Soon" | "Completed"
  >("All");

  const [sortField, setSortField] = useState<keyof TrackedEmail>("subject");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  // Track Email model state
  const [isTrackModelOpen, setIsTrackeModelOpen] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newRecipientsCount, setNewRecipientsCount] = useState(5);
  const [newDeadline, setNewDeadline] = useState("Due in 3 Days");

  useEffect(() => {
    setEmails(getTrackedEmails());
  }, []);

  // Summary/Audit Log modal state
  const [summaryEmail, setSummaryEmail] = useState<TrackedEmail | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "audit">("overview");

  const handleSort = (field: keyof TrackedEmail) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Filter and Search Logic
  const filteredEmails = useMemo(() => {
    return emails
      .filter((email) => {
        const matchSearch = email.subject
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        const matchStatus =
          statusFilter === "All" || email.status === statusFilter;

        let matchDeadline = true;
        if (deadlineFilter === "Overdue") {
          matchDeadline = email.status === "Overdue";
        } else if (deadlineFilter === "Soon") {
          matchDeadline =
            email.deadline.toLowerCase().includes("day") ||
            email.deadline.toLowerCase().includes("h") ||
            email.deadline.toLowerCase().includes("today");
        } else if (deadlineFilter === "Completed") {
          matchDeadline = email.status === "Completed";
        }

        return matchSearch && matchStatus && matchDeadline;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === "string" && typeof valB === "string") {
          return sortOrder === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }

        if (typeof valA === "number" && typeof valB === "number") {
          return sortOrder === "asc" ? valA - valB : valB - valA;
        }

        return 0;
      });
  }, [emails, searchTerm, statusFilter, deadlineFilter, sortField, sortOrder]);

  const getStatusBadge = (status: TrackedEmail["status"]) => {
    switch (status) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]">
            <CheckCircle2 size={12} className="stroke-[2.5]" />
            Completed
          </span>
        );
      case "Overdue":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#ffebee] text-[#c62828] border border-[#ffcdd2]">
            <AlertTriangle size={12} className="stroke-[2.5]" />
            Overdue
          </span>
        );
      case "Pending":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#eff4ff] text-[#3525cd] border border-[#c7c4d8]/30">
            <Clock size={12} className="stroke-[2.5]" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="flex-1 text-left">
      {/* Page Header Area */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="font-sans text-3xl font-bold text-[#0b1c30] tracking-tight">
            Tracked Emails
          </h2>
          <p className="font-sans text-sm text-[#777587] mt-1">
            Monitor emails awaiting responses and track recipient progress.
          </p>
        </div>
        <Link to={"/track_new"}>
          <button
            onClick={() => setIsTrackeModelOpen(true)}
            className="bg-[#3525cd] text-white hover:bg-[#3525cd]/95 py-2.5 px-5 rounded-xl font-sans text-xs font-bold tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer"
          >
            <Plus className="stroke-[2.5]" />
            Track Email
          </button>
        </Link>
      </div>
      {/* Tool bar area */}
      <div className="bg-white border border-[#c7c4d8]/30 rounded-2xl p-4 mb-6 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777587] w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Subject..."
            className="w-full bg-[#f8f9ff] border border-[#c7c4d8]/30 rounded-xl py-2 pl-10 pr-4 text-xs text-[#0b1c30] placeholder-[#777587]/70 font-sans focus:outline-none focus:ring-1 focus:ring-[#3525cd] focus:border-[#3525cd] transition-all"
          />
        </div>

        {/* filter panel */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* Status filter tab buttons */}
          <div className="flex  bg-[#f8f9ff] border border-[#c7c4d8]/20  rounded-xl p-1">
            {(["All", "Pending", "Overdue", "Completed"] as const).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans transition-all cursor-pointer ${statusFilter === status ? "bg-white text-[#3525cd] shadow-xs border border-[#c7c4d8]/10" : "text-[#777587] hover:text-[#0b1c30]"}`}
                >
                  {status}
                </button>
              ),
            )}
          </div>

          {/* deadline filter dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-[#777587]" />
            <select
              value={deadlineFilter}
              onChange={(e) => setDeadlineFilter(e.target.value as any)}
              className="bg-[#f8f9ff] border border-[#c7c4d8]/30 text-xs font-bold text-[#464555] rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#3525cd] font-sans cursor-pointer"
            >
              <option value="All">All Deadlines</option>
              <option value="Overdue">Overdue</option>
              <option value="Soon">Due Soon</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>
      {/* main table card */}
      <div className="bg-white border border-[#c7c4d8]/30 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#c7c4d8]/20 bg-[#f8f9ff]/50">
                <th
                  onClick={() => handleSort("subject")}
                  className="px-6 py-4 text-left font-sans text-[11px] font-bold text-[#777587] uppercase tracking-wider cursor-pointer select-none hover:text-[#0b1c30]"
                >
                  <div className="flex items-center gap-1.5">
                    Subjects
                    <ArrowUpDown size={12} className="opacity-70" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort("sentDate")}
                  className="px-6 py-4 text-left font-sans text-[11px] font-bold text-[#777587] uppercase tracking-wider cursor-pointer select-none hover:text-[#0b1c30]"
                >
                  <div className="flex items-center gap-1.5">
                    Sent Date
                    <ArrowUpDown size={12} className="opacity-70" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left font-sans text-[11px] font-bold text-[#777587] uppercase tracking-wider">
                  Recipient Response
                </th>
                <th
                  onClick={() => handleSort("deadline")}
                  className="px-6 py-4 text-left font-sans text-[11px] font-bold text-[#777587] uppercase tracking-wider cursor-pointer select-none hover:text-[#0b1c30]"
                >
                  <div className="flex items-center gap-1.5">
                    Deadline
                    <ArrowUpDown size={12} className="opacity-70" />
                  </div>
                </th>
                <th className="px-6 py-4 text-left font-sans text-[11px] font-bold text-[#777587] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right font-sans text-[11px] font-bold text-[#777587] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c7c4d8]/15">
              {filteredEmails.length == 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-[#777587] font-sans"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Mail className="w-8 h-8 text-[#c7c4d8]/80 stroke-[1.5]" />
                      <p className="text-sm font-bold text-[#0b1c30]">
                        No emails found
                      </p>
                      <p className="text-xs">
                        Try adjusting your search filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEmails.map((email) => {
                  const total = email.recipients.length;
                  const responded = email.recipients.filter(
                    (r) => r.responded,
                  ).length;
                  const responsePercent =
                    total > 0 ? Math.round((responded / total) * 100) : 0;

                  return (
                    <tr
                      key={email.id}
                      className="hover:bg-slate-50/40 transition-colors"
                    >
                      {/* Column 1: Subject */}
                      <td className="px-6 py-4.5 max-w-xs md:max-w-md">
                        <Link
                          to={`/tracked/detail/${email.id}`}
                          className="group inline-block"
                        >
                          <span className="font-sans text-xs font-bold text-[#0b1c30] text-clamp-1 transition-colors duration-200 group-hover:text-indigo-600 group-hover:underline cursor-pointer">
                            {email.subject}
                          </span>
                        </Link>
                      </td>

                      {/* Column 2: Sent Date */}
                      <td className="px-6 py-4.5 whitespace-nowrap text-xs font-sans font-semibold text-[#777587]">
                        {email.sentDate}
                      </td>

                      {/* Column 3: Recipients with dynamic progress bar */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="space-y-1.5">
                          <div className="font-sans text-xs text-[11px]  font-extrabold text-[#0b1c30]">
                            {responded} / {total}
                            <span className="text-[#777587] font-medium">
                              ({responsePercent}%)
                            </span>
                          </div>
                          <div className="w-28 bg-[#f1f0f7] h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-[#3525cd] h-full rounded-full transition-all duration-300"
                              style={{ width: `${responsePercent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Column 4: Deadlines */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="font-sans text-xs text-[#464555] font-semibold">
                          {email.deadline}
                        </div>
                      </td>

                      {/* Column 5: Status Badge*/}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        {getStatusBadge(email.status)}
                      </td>

                      {/* Column 6: Actions */}
                      <td className="px-6 py-4.5 whitespace-nowrap text-right">
                        <button
                          onClick={() => {
                            setSummaryEmail(email);
                            setActiveTab("overview");
                          }}
                          className="inline-flex items-center gap-1.5 font-sans text-xs font-bold text-[#3525cd] hover:text-[#3525cd]/80 bg-[#eff4ff] hover:bg-[#eff4ff]/80 px-3 py-1.5 rounded-lg border border-[#c7c4d8]/20 transition-all cursor-pointer"
                        >
                          <Eye size={12} />
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer area with row summary count */}
        <div className="px-6 py-4 bg-[#f8f9ff]/30 border-t border-[#c7c4d8]/15 flex items-center justify-between text-xs font-sans text-[#777587]">
          <div>
            Showing{" "}
            <span className="font-bold text-[#0b1c30]">
              {filteredEmails.length}
            </span>{" "}
            of <span className="font-bold text-[#0b1c30]">{emails.length}</span>{" "}
            tracked emails
          </div>
          <div className="flex gap-2">
            <button className="px-2.5 py-1.5 bg-white border border-[#c7c4d8]/30 rounded-lg text-[11px] font-bold text-[#777587] opacity-70 cursor-not-allowed">
              Prev
            </button>
            <button className="px-2.5 py-1.5 bg-white border border-[#c7c4d8]/30 rounded-lg text-[11px] font-bold text-[#777587] opacity-60 cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Summary Log */}
      {summaryEmail && (
        <div className="fixed inset-0 bg-[#0b1c30]/40 backdrop-blur-xs flex  items-center justify-center z-50 p-4">
          <div className="bg-white border border-[#c7c4d8]/40 rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden text-left animat-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-[#c7c4d8]/10 flex items-center justify-between bg-slate-50/50">
              <div>
                <span className="text-[9px] font-extrabold text-[#777587 uppercase tracking-wider font-mono">
                  Email Tracking Summary
                </span>
                <h3 className="font-sans text-base font-black text-[#0b1c30] line-clamp-1 mt-0.5">
                  {summaryEmail.subject}
                </h3>
              </div>
              <button
                onClick={() => setSummaryEmail(null)}
                className="text-[#777587] hover:text-[#0b1c30] p-1.5 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex bg-[#f8f9ff] border-b border-[#c7c4d8]/20 px-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex items-center gap-2 py-3 px-4 text-xs font-bold font-sans border-b-2 transition-all cursor-pointer ${activeTab === "overview" ? "border-[#3525cd] text-[#3525cd]" : "border-transparent text-[#777587] hover:text-[#0b1c30]"}`}
              >
                <ClipboardList size={14} />
                Overview & Recipients
              </button>
              <button
                onClick={() => setActiveTab("audit")}
                className={`flex items-center gap-2 py-3 px-4 text-xs  font-bold font-sans border-b-2 transition-all cursor-pointer ${activeTab === "audit" ? "border-[#3525cd] text-[#3525cd]" : "border-transparent text-[#777587] hover:text-[#0b1c30]"}`}
              >
                <History size={14} />
                Audit Logs
              </button>
            </div>

            {/* Scrollbar content area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scrollbar-none">
              {activeTab === "overview" ? (
                <>
                  {/* Summary Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#f8f9ff] border-[#c7c4d8]/20  rounded-xl p-4 space-y-3">
                      <div>
                        <span className="block text-[10px] font-bold text-[#777587] uppercase tracking-wider">
                          Sender Info
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="p-1.5 bg-[#eff4ff] text-[#3525cd] rounded-lg">
                            <User size={13} />
                          </div>
                          <span className="text-xs font-bold text-[#0b1c30]">
                            You (fuya241@gmail.com)
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="block text-[10px] font-bold text-[#777587] uppercase tracking-wider">
                          Tracking Initiated
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="p-1.5 bg-[#eff4ff] text-[#3525cd] rounded-lg">
                            <Calendar size={13} />
                          </div>
                          <span className="text-xs font-semibold text-[#464555]">
                            {summaryEmail.sentDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#f8f9ff] border border-[#c7c4d8]/20 rounded-xl p-4 space-y-3">
                      <div>
                        <span className="block text-[10px] font-bold text-[#777587] uppercase tracking-wider">
                          Deadline
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="p-1.5 bg-amber-50 text-amber-600  rounded-lg">
                            <Clock size={13} />
                          </div>
                          <span className="text-xs font-extrabold text-amber-700">
                            {summaryEmail.deadline}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-[#777587] uppercase tracking-wider">
                          Overall Status
                        </span>
                        <div className="mt-1">
                          {summaryEmail.status === "Completed" ? (
                            <span className="inlin-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]">
                              Completed
                            </span>
                          ) : summaryEmail.status === "Overdue" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#ffebee] text-[#c62828] border border-[#ffcdd2]">
                              Overdue
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#eff4ff] text-[#3525cd] border border-[#c7c4d8]/30">
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Response Progress Grid */}
                  <div className="border border-[#c7c4d8]/20 rounded-xl p-4 space-y-3 bg-white shadow-xs">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#464555]">
                        Response Progress
                      </span>
                      <span className="font-mono font-black text-[#3525cd] text-sm">
                        {summaryEmail.recipients.length > 0
                          ? Math.round(
                              (summaryEmail.recipients.filter(
                                (r) => r.responded,
                              ).length /
                                summaryEmail.recipients.length) *
                                100,
                            )
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-[#f1f0f7] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#3525cd] h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            summaryEmail.recipients.length > 0
                              ? Math.round(
                                  (summaryEmail.recipients.filter(
                                    (r) => r.responded,
                                  ).length /
                                    summaryEmail.recipients.length) *
                                    100,
                                )
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-[#777587] font-semibold font-sans pt-1">
                      <span className="">
                        {
                          summaryEmail.recipients.filter((r) => r.responded)
                            .length
                        }{" "}
                        Responded
                      </span>
                      <span>
                        {
                          summaryEmail.recipients.filter((r) => !r.responded)
                            .length
                        }{" "}
                        Awaiting
                      </span>
                      <span>
                        {summaryEmail.recipients.length} Total Recipients
                      </span>
                    </div>
                  </div>

                  {/* Recipient Response Matrix */}
                  <div className="space-y-3">
                    <h4 className="font-sans text-[11px] font-extrabold text-[#777587] uppercase tracking-wider">
                      Recipient Status Matrix
                    </h4>
                    <div className="border border-[#c7c4d8]/20 rounded-xl overflow-hidden divide-y divide-[#c7c4d8]/15 shadow-xs">
                      {summaryEmail.recipients.map((recipient) => (
                        <div className="p-3.5 flex items-center justify-between hover:bg-slate-50/20 transition-all text-shadow-xs">
                          <div className="space-y-0.5">
                            <p className="font-sans font-bold text-[#0b1c30]">
                              {recipient.name}
                            </p>
                            <p className="font-mono text-[10px] text-[#777587]">
                              {recipient.email}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-sans text-[10px] text-[#777587] font-medium bg-slate-100 px-2 py-0.5 rounded-md">
                              Reminders: {recipient.remindersSent}
                            </span>
                            {recipient.responded ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]">
                                <CheckCircle
                                  size={11}
                                  className="stroke-[2.5]"
                                />
                                Responded
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-150">
                                <Clock size={11} className="stroke-[2.5]" />
                                Awaiting Response
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                // Audit log section
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#c7c4d8]/15 pb-2">
                    <h4 className="font-sans text-[11px] font-extrabold text-[#777587] uppercase tracking-wider">
                      System $ Action History Logs
                    </h4>
                    <span className="text-[10px] font-mono text-[#777587]">
                      {summaryEmail.activityLogs.length} events logged
                    </span>
                  </div>
                  <div className="relative border border-[#c7c4d8]/30 ml-3 pl-5 space-y-6">
                    {summaryEmail.activityLogs.map((log) => {
                      let actionTitle = "System Action";
                      let repName = "";
                      let badgeStyle =
                        "bg-slate-50 text-slate-700 border-slate-200";

                      if (log.type === "sent") {
                        actionTitle = "Email Tracking Started";
                        badgeStyle =
                          "bg-[#eff4ff] text-[#3525cd] border-[#3525cd]/15";
                      } else if (log.type === "reply") {
                        actionTitle = "Recipient Response Logged";
                        badgeStyle =
                          "bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9]";

                        const matched = summaryEmail.recipients.find(
                          (r) =>
                            log.description.includes(r.name) ||
                            log.description
                              .toLowerCase()
                              .includes(r.email.toLowerCase()),
                        );
                        if (matched) {
                          repName = matched.name;
                        } else {
                          const match =
                            log.description.match(/from\s+([^(\n\r]+)/i);
                          if (match && match[1]) repName = match[1].trim();
                        }
                      } else if (log.type === "reminder") {
                        actionTitle = "Reminder Notification Sent";
                        badgeStyle =
                          "bg-amber-50 text-amber-700 border-amber-200";

                        const matched = summaryEmail.recipients.find((r) =>
                          log.description.includes(r.name),
                        );
                        if (matched) {
                          repName = matched.name;
                        }
                      } else if (log.type === "status_change") {
                        actionTitle = "Overall Status Updated";
                        badgeStyle =
                          "bg-slate-100 text-slate-700 border-slate-300";
                      }

                      return (
                        <div key={log.id} className="relative text-xs">
                          {/* circle timeline pin indicator */}
                          <div className="absolute -left-6.5 top-1.5 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#3525cd] z-10 flex items-center justify-center">
                            <span className="w-1 h-1 bg-[#3525cd] rounded-full" />
                          </div>
                          <div className="bg-[#f8f9ff]/50 border border-[#c7c4d8]/15 rounded-xl p-4.5 space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#c7c4d8]/10 pb-1.5">
                              <span
                                className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider font-mono border ${badgeStyle}`}
                              >
                                {actionTitle}
                              </span>
                              <span className="text-[9px] text-[#777587] font-semibold whitespace-nowrap">
                                {log.timestamp}
                              </span>
                            </div>
                            <p className="font-sans text-[#464555] font-medium leading-relaxed pt-0.5">
                              {log.description}
                            </p>

                            {repName && (
                              <div className="flex items-center gap-1.5 pt-1">
                                <span className="text-[10px] text-[#777587]  font-bold">
                                  Recipient:
                                </span>
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-white border border-[#c7c4d8]/20  rounded text-[10px] font-semibold text-[#0b1c30]">
                                  <User size={10} /> {repName}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4.5 border-t  border-[#c7c4d8]/10 flex items-center justify-between bg-slate-50/50">
              <Link
                to={`/tracked/detail/${summaryEmail.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3525cd] hover:underline cursor-pointer"
              >
                Go to Full Email Details Page →
              </Link>
              <button
                onClick={() => setSummaryEmail(null)}
                className="bg-[#0b1c30] hover:bg-[#0b1c30]/90 text-white px-4 py-2 rounded-xl text-xs font-bold font-sans cursor-pointer transition-all"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackedEmails;

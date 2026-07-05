import { useToast } from "@/context/ToastContext";
import {
  AlertTriangle,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Divide,
  Eye,
  Mail,
  Plus,
  Search,
  SlidersHorizontal,
  SpaceIcon,
  UserCheck,
  X,
} from "lucide-react";
import React, { useMemo, useState } from "react";

export interface EmailRow {
  id: number;
  subject: string;
  recipientsCount: number;
  respondedCount: number;
  totalCount: number;
  deadline: string;
  status: "Pending" | "Completed" | "Overdue";
}

const initialTrackedEmails: EmailRow[] = [
  {
    id: 1,
    subject: "Q4 Marketing Strategy Feedback",
    recipientsCount: 5,
    respondedCount: 3,
    totalCount: 5,
    deadline: "Due in 2 days",
    status: "Pending",
  },
  {
    id: 2,
    subject: "Q2 Performance Report Approval",
    recipientsCount: 5,
    respondedCount: 3,
    totalCount: 5,
    deadline: "Overdue by 24h",
    status: "Overdue",
  },
  {
    id: 3,
    subject: "Service Level Agreement Renewal",
    recipientsCount: 7,
    respondedCount: 7,
    totalCount: 7,
    deadline: "Completed Jun 21",
    status: "Completed",
  },
  {
    id: 4,
    subject: "Strategic Marketing Proposal Review",
    recipientsCount: 9,
    respondedCount: 6,
    totalCount: 9,
    deadline: "Due in 5 days",
    status: "Pending",
  },
  {
    id: 5,
    subject: "Vendor Workspace Security Compliance Audit",
    recipientsCount: 8,
    respondedCount: 4,
    totalCount: 8,
    deadline: "Due in 3 days",
    status: "Pending",
  },
  {
    id: 6,
    subject: "Client Onboarding Checklist",
    recipientsCount: 3,
    respondedCount: 3,
    totalCount: 3,
    deadline: "Completed Jun 20",
    status: "Completed",
  },
  {
    id: 7,
    subject: "Partnership Agreement Final Draft",
    recipientsCount: 4,
    respondedCount: 1,
    totalCount: 4,
    deadline: "Overdue by 2 days",
    status: "Overdue",
  },
  {
    id: 8,
    subject: "Board Meeting RSVP Request",
    recipientsCount: 12,
    respondedCount: 11,
    totalCount: 12,
    deadline: "Due Today, 5 PM",
    status: "Pending",
  },
];

const TrackedEmail = () => {
  const { triggerToast } = useToast();
  const [emails, setEmails] = useState<EmailRow[]>(initialTrackedEmails);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Pending" | "Completed" | "Overdue"
  >("All");
  const [deadlineFilter, setDeadlineFilter] = useState<
    "All" | "Overdue" | "Soon" | "Completed"
  >("All");

  const [sortField, setSortField] = useState<keyof EmailRow>("subject");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  // Track Email model state
  const [isTrackModelOpen, setIsTrackeModelOpen] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newRecipientsCount, setNewRecipientsCount] = useState(5);
  const [newDeadline, setNewDeadline] = useState("Due in 3 Days");

  // Row Detail mode status
  const [activeDetailEmail, setActiveDetailEmail] = useState<EmailRow | null>(
    null,
  );

  const handleSort = (field: keyof EmailRow) => {
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

  const handleTrackedEmails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) {
      triggerToast("Please fill in all fields", "info");
      return;
    }

    const newEmail: EmailRow = {
      id: Date.now(),
      subject: newSubject,
      recipientsCount: Number(newRecipientsCount),
      respondedCount: 0,
      totalCount: Number(newRecipientsCount),
      deadline: newDeadline,
      status: "Pending",
    };

    setEmails([newEmail, ...emails]);
    setIsTrackeModelOpen(false);

    // Reset form
    setNewSubject("");
    setNewRecipientsCount(5);
    setNewDeadline("Due in 3 days");

    triggerToast(`Successfully tracking ${newSubject}`, "success");
  };

  const getStatusBadge = (status: EmailRow["status"]) => {
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
        <button
          onClick={() => setIsTrackeModelOpen(true)}
          className="bg-[#3525cd] text-white hover:bg-[#3525cd]/95 py-2.5 px-5 rounded-xl font-sans text-xs font-bold tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer"
        >
          <Plus className="stroke-[2.5]" />
          Track Email
        </button>
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
                <th className="px-6 py-4 text-left font-sans text-[11px] font-bold text-[#777587] uppercase tracking-wider">
                  Recipients
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
                  return (
                    <tr
                      key={email.id}
                      className="hover:bg-slate-50/40 transition-colors"
                    >
                      {/* Column 1: Subject */}
                      <td className="px-6 py-4.5 max-w-xs md:max-w-md">
                        <div className="font-sans text-xs font-bold text-[#0b1c30] line-clamp-1">
                          {email.subject}
                        </div>
                      </td>

                      {/* Column 2: Recipients */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="font-sans text-xs text-[#777587] font-medium">
                          {email.recipientsCount} recipients
                        </div>
                      </td>

                      {/* Column 3: Deadlines */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="font-sans text-xs text-[#464555] font-semibold">
                          {email.deadline}
                        </div>
                      </td>

                      {/* Column 4: Status Badge*/}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        {getStatusBadge(email.status)}
                      </td>

                      {/* Column 5: Actions */}
                      <td className="px-6 py-4.5 whitespace-nowrap text-right">
                        <button
                          onClick={() => setActiveDetailEmail(email)}
                          className="inline-flex items-center gap-1.5 font-sans text-xs font-bold text-[#3525cd] hover:text-[#3525cd]/80 bg-[#eff4ff] hover:bg-[#eff4ff]/80 px-3 py-1.5 rounded-lg border border-[#c7c4d8]/20 transition-all cursor-pointer"
                        >
                          <Eye size={12} />
                          Details
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

      {/* MODAL 1: EMAIL DETAILS AND AUDIT LOG */}
      {activeDetailEmail && (
        <div className="fixed inset-0 bg-[#0b1c30]/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-[#c7c4d8]/40 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden text-left animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4.5 border border-[#c7c4d8]/10 flex items-center justify-between ">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-[#eff4ff] text-[#3525cd] rounded-lg">
                  <Mail size={14} />
                </div>
                <h3 className="font-sans text-sm font-bold text-[#0b1c30]">
                  Tracking Summary
                </h3>
              </div>
              <button
                onClick={() => setActiveDetailEmail(null)}
                className="text-[#777587] hover:text-[#0b1c30] p-1 rounded-full hover:bg-slate-100 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Details Content */}
            <div className="p-6 space-y-6">
              <div>
                <span className="text-[10px] font-extrabold text-[#777587] uppercase tracking-wider block mb-1">
                  Subject Line
                </span>{" "}
                <p className="font-sans text-sm font-bold text-[#0b1c30]">
                  {activeDetailEmail.subject}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-extrabold text-[#777587] uppercase tracking-wider block mb-1">
                    Sender Info
                  </span>
                  <p className="font-sans text-xs text-[#464555] font-medium">
                    You (fuya241@gmail.com)
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-[#777587] uppercase tracking-wider block mb-1">
                    Current Deadline
                  </span>
                  <p className="font-sans text-xs text-[#0b1c30] font-bold">
                    {activeDetailEmail.deadline}
                  </p>
                </div>
              </div>

              {/* Response Status Grid */}
              <div className="bg-slate-50/70 border border-[#c7c4d8]/20 rounded-xl p-4 grid grid-cols-3 gap-2 text-center">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-extrabold text-[#777587] uppercase tracking-wider block">
                    Total Sent
                  </span>
                  <p className="text-lg font-black text-[#0b1c30] font-sans">
                    {activeDetailEmail.totalCount}
                  </p>
                </div>
                <div className="space-y-0.5 border-x border-[#c7c4d8]/15">
                  <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block">
                    Responded
                  </span>
                  <p className="text-lg font-black text-emerald-700 font-sans">
                    {activeDetailEmail.recipientsCount}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider block">
                    Pending
                  </span>
                  <p className="text-lg font-black text-amber-700 font-sans">
                    {activeDetailEmail.recipientsCount -
                      activeDetailEmail.respondedCount}
                  </p>
                </div>
              </div>

              {/* Progress Detail */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-sans">
                  <span className="font-bold text-[#0b1c30]">
                    Overall Response Rate
                  </span>
                  <span className="font-bold text-[#3525cd]">
                    {Math.round(
                      (activeDetailEmail.respondedCount /
                        activeDetailEmail.totalCount) *
                        100,
                    )}
                    %
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#3525cd] rounded-full"
                    style={{
                      width: `${
                        (activeDetailEmail.respondedCount /
                          activeDetailEmail.totalCount) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Recipients CheckLists */}
              <div>
                <span className="text-[10px] font-extrabold text-[#777587] uppercase tracking-wider block">
                  Recipients Response Matrix
                </span>
                <div className="max-h-32 overflow-y-auto space-y-2 pr-1 scrollbar-none">
                  {Array.from({ length: activeDetailEmail.totalCount }).map(
                    (_, index) => {
                      const isResponded =
                        index < activeDetailEmail.respondedCount;
                      return (
                        <div className="flex items-center justify-between p-2 rounded-lg bg-[#f8f9ff] border border-[#c7c4d8]/10 text-xs font-sans">
                          <span className="font-medium text-[#464555]">
                            recipient-{index + 1}@organization.com
                          </span>
                          {isResponded ? (
                            <span className="flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 text-[10px]">
                              <UserCheck size={11} /> Responded
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 text-[10px]">
                              <Clock size={11} />
                              Awaiting
                            </span>
                          )}
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4.5 bg-[#f8f9ff]/50 border-t border-[#c7c4d8]/10 flex justify-end">
              <button
                className="bg-[#3525cd] text-white hover:bg-[#3525cd]/95 px-5 py-2 rounded-xl text-xs font-bold font-sans cursor-pointer transition-all"
                onClick={() => setActiveDetailEmail(null)}
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

export default TrackedEmail;

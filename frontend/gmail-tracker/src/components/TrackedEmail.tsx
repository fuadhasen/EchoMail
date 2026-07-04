import { useToast } from "@/context/ToastContext";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  SlidersHorizontal,
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
    </div>
  );
};

export default TrackedEmail;

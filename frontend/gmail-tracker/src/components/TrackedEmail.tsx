import { CheckCircle2 } from "lucide-react";
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
  const [newSender, setNewSender] = useState("You (fuya241@gmail.com)");
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
  });

  return <div>here the trackedEmail components will be putted here</div>;
};

export default TrackedEmail;

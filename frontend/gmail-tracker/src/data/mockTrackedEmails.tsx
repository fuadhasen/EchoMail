export interface Recipient {
  email: string;
  name: string;
  responded: boolean;
  respondedAt?: string;
  remindersSent: number;
}

export interface ActivityLog {
  id: string;
  type: "sent" | "reply" | "reminder" | "status_change";
  description: string;
  timestamp: string;
}

export interface TrackedEmail {
  id: string;
  subject: string;
  sentDate: string;
  deadline: string;
  status: "Pending" | "Completed" | "Overdue";
  recipients: Recipient[];
  activityLogs: ActivityLog[];
}

const defaultEmails: TrackedEmail[] = [
  {
    id: "1",
    subject: "Q4 Marketing Strategy Feedback",
    sentDate: "Jun 20, 2026, 10:15 AM",
    deadline: "Due in 2 days",
    status: "Pending",
    recipients: [
      {
        email: "sarah.j@organization.com",
        name: "Sarah Jenkins",
        responded: true,
        respondedAt: "Jun 21, 2026, 2:30 PM",
        remindersSent: 0,
      },
      {
        email: "alex.m@organization.com",
        name: "Alex Mercer",
        responded: true,
        respondedAt: "Jun 21, 2026, 4:15 PM",
        remindersSent: 0,
      },
      {
        email: "clara.t@organization.com",
        name: "Clara Tsai",
        responded: true,
        respondedAt: "Jun 22, 2026, 9:05 AM",
        remindersSent: 0,
      },
      {
        email: "david.k@organization.com",
        name: "David Kim",
        responded: false,
        remindersSent: 1,
      },
      {
        email: "elena.r@organization.com",
        name: "Elena Rostova",
        responded: false,
        remindersSent: 1,
      },
    ],
    activityLogs: [
      {
        id: "log-1-1",
        type: "sent",
        description: "Email tracking started with 5 recipients",
        timestamp: "Jun 20, 2026, 10:15 AM",
      },
      {
        id: "log-1-2",
        type: "reply",
        description: "Response received from Sarah Jenkins",
        timestamp: "Jun 21, 2026, 2:30 PM",
      },
      {
        id: "log-1-3",
        type: "reply",
        description: "Response received from Alex Mercer",
        timestamp: "Jun 21, 2026, 4:15 PM",
      },
      {
        id: "log-1-4",
        type: "reply",
        description: "Response received from Clara Tsai",
        timestamp: "Jun 22, 2026, 9:05 AM",
      },
      {
        id: "log-1-5",
        type: "reminder",
        description:
          "Automated follow-up reminder sent to David Kim and Elena Rostova",
        timestamp: "Jun 23, 2026, 10:00 AM",
      },
    ],
  },
  {
    id: "2",
    subject: "Q2 Performance Report Approval",
    sentDate: "Jun 15, 2026, 9:00 AM",
    deadline: "Overdue by 24h",
    status: "Overdue",
    recipients: [
      {
        email: "marcus.h@organization.com",
        name: "Marcus Holloway",
        responded: true,
        respondedAt: "Jun 16, 2026, 11:30 AM",
        remindersSent: 0,
      },
      {
        email: "fiona.g@organization.com",
        name: "Fiona Gallagher",
        responded: true,
        respondedAt: "Jun 17, 2026, 3:20 PM",
        remindersSent: 1,
      },
      {
        email: "stephen.s@organization.com",
        name: "Stephen Strange",
        responded: true,
        respondedAt: "Jun 18, 2026, 10:45 AM",
        remindersSent: 1,
      },
      {
        email: "bruce.b@organization.com",
        name: "Bruce Banner",
        responded: false,
        remindersSent: 2,
      },
      {
        email: "tony.s@organization.com",
        name: "Tony Stark",
        responded: false,
        remindersSent: 2,
      },
    ],
    activityLogs: [
      {
        id: "log-2-1",
        type: "sent",
        description: "Email tracking started with 5 recipients",
        timestamp: "Jun 15, 2026, 9:00 AM",
      },
      {
        id: "log-2-2",
        type: "reply",
        description: "Response received from Marcus Holloway",
        timestamp: "Jun 16, 2026, 11:30 AM",
      },
      {
        id: "log-2-3",
        type: "reminder",
        description:
          "First manual reminder sent to Fiona, Stephen, Bruce, and Tony",
        timestamp: "Jun 17, 2026, 9:00 AM",
      },
      {
        id: "log-2-4",
        type: "reply",
        description: "Response received from Fiona Gallagher",
        timestamp: "Jun 17, 2026, 3:20 PM",
      },
      {
        id: "log-2-5",
        type: "reply",
        description: "Response received from Stephen Strange",
        timestamp: "Jun 18, 2026, 10:45 AM",
      },
      {
        id: "log-2-6",
        type: "reminder",
        description:
          "Second warning reminder sent to Bruce Banner and Tony Stark",
        timestamp: "Jun 19, 2026, 9:00 AM",
      },
    ],
  },
  {
    id: "3",
    subject: "Service Level Agreement Renewal",
    sentDate: "Jun 10, 2026, 2:00 PM",
    deadline: "Completed Jun 21",
    status: "Completed",
    recipients: [
      {
        email: "legal.team@organization.com",
        name: "Legal Ops",
        responded: true,
        respondedAt: "Jun 12, 2026, 10:00 AM",
        remindersSent: 0,
      },
      {
        email: "harvey.s@organization.com",
        name: "Harvey Specter",
        responded: true,
        respondedAt: "Jun 14, 2026, 5:00 PM",
        remindersSent: 1,
      },
      {
        email: "mike.r@organization.com",
        name: "Mike Ross",
        responded: true,
        respondedAt: "Jun 21, 2026, 11:15 AM",
        remindersSent: 2,
      },
    ],
    activityLogs: [
      {
        id: "log-3-1",
        type: "sent",
        description: "SLA Renewal tracking initiated with 3 recipients",
        timestamp: "Jun 10, 2026, 2:00 PM",
      },
      {
        id: "log-3-2",
        type: "reply",
        description: "Response received from Legal Ops",
        timestamp: "Jun 12, 2026, 10:00 AM",
      },
      {
        id: "log-3-3",
        type: "reminder",
        description: "Friendly reminder sent to Harvey and Mike",
        timestamp: "Jun 14, 2026, 9:00 AM",
      },
      {
        id: "log-3-4",
        type: "reply",
        description: "Response received from Harvey Specter",
        timestamp: "Jun 14, 2026, 5:00 PM",
      },
      {
        id: "log-3-5",
        type: "reminder",
        description: "Final reminder sent to Mike Ross",
        timestamp: "Jun 20, 2026, 9:00 AM",
      },
      {
        id: "log-3-6",
        type: "reply",
        description: "Response received from Mike Ross",
        timestamp: "Jun 21, 2026, 11:15 AM",
      },
      {
        id: "log-3-7",
        type: "status_change",
        description: "Email status marked as Completed",
        timestamp: "Jun 21, 2026, 11:15 AM",
      },
    ],
  },
  {
    id: "4",
    subject: "Strategic Marketing Proposal Review",
    sentDate: "Jun 22, 2026, 11:30 AM",
    deadline: "Due in 5 days",
    status: "Pending",
    recipients: [
      {
        email: "david.c@organization.com",
        name: "David Cho",
        responded: true,
        respondedAt: "Jun 23, 2026, 9:00 AM",
        remindersSent: 0,
      },
      {
        email: "lisa.m@organization.com",
        name: "Lisa Min",
        responded: true,
        respondedAt: "Jun 23, 2026, 1:45 PM",
        remindersSent: 0,
      },
      {
        email: "ken.t@organization.com",
        name: "Ken Tanaka",
        responded: true,
        respondedAt: "Jun 24, 2026, 4:30 PM",
        remindersSent: 0,
      },
      {
        email: "rachel.g@organization.com",
        name: "Rachel Green",
        responded: false,
        remindersSent: 0,
      },
      {
        email: "joey.t@organization.com",
        name: "Joey Tribbiani",
        responded: false,
        remindersSent: 0,
      },
      {
        email: "chandler.b@organization.com",
        name: "Chandler Bing",
        responded: false,
        remindersSent: 0,
      },
    ],
    activityLogs: [
      {
        id: "log-4-1",
        type: "sent",
        description: "Email tracking started with 6 recipients",
        timestamp: "Jun 22, 2026, 11:30 AM",
      },
      {
        id: "log-4-2",
        type: "reply",
        description: "Response received from David Cho",
        timestamp: "Jun 23, 2026, 9:00 AM",
      },
      {
        id: "log-4-3",
        type: "reply",
        description: "Response received from Lisa Min",
        timestamp: "Jun 23, 2026, 1:45 PM",
      },
      {
        id: "log-4-4",
        type: "reply",
        description: "Response received from Ken Tanaka",
        timestamp: "Jun 24, 2026, 4:30 PM",
      },
    ],
  },
  {
    id: "5",
    subject: "AI Automation Engineer and Backend developer",
    sentDate: "Jun 22, 2026, 11:30 AM",
    deadline: "Due in 5 days",
    status: "Pending",
    recipients: [
      {
        email: "david.c@organization.com",
        name: "David Cho",
        responded: true,
        respondedAt: "Jun 23, 2026, 9:00 AM",
        remindersSent: 0,
      },
      {
        email: "lisa.m@organization.com",
        name: "Lisa Min",
        responded: true,
        respondedAt: "Jun 23, 2026, 1:45 PM",
        remindersSent: 0,
      },
      {
        email: "ken.t@organization.com",
        name: "Ken Tanaka",
        responded: true,
        respondedAt: "Jun 24, 2026, 4:30 PM",
        remindersSent: 0,
      },
      {
        email: "rachel.g@organization.com",
        name: "Rachel Green",
        responded: false,
        remindersSent: 0,
      },
      {
        email: "joey.t@organization.com",
        name: "Joey Tribbiani",
        responded: false,
        remindersSent: 0,
      },
      {
        email: "chandler.b@organization.com",
        name: "Chandler Bing",
        responded: false,
        remindersSent: 0,
      },
    ],
    activityLogs: [
      {
        id: "log-4-1",
        type: "sent",
        description: "Email tracking started with 6 recipients",
        timestamp: "Jun 22, 2026, 11:30 AM",
      },
      {
        id: "log-4-2",
        type: "reply",
        description: "Response received from David Cho",
        timestamp: "Jun 23, 2026, 9:00 AM",
      },
      {
        id: "log-4-3",
        type: "reply",
        description: "Response received from Lisa Min",
        timestamp: "Jun 23, 2026, 1:45 PM",
      },
      {
        id: "log-4-4",
        type: "reply",
        description: "Response received from Ken Tanaka",
        timestamp: "Jun 24, 2026, 4:30 PM",
      },
    ],
  },
];

const LOCAL_STORAGE_KEY = "echomail_tracked_emails";

export function getTrackedEmails(): TrackedEmail[] {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultEmails));
    return defaultEmails;
  }

  try {
    return JSON.parse(data);
  } catch {
    return defaultEmails;
  }
}

export function saveTrackedEmails(emails: TrackedEmail[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(emails));
}

export function getTrackedEmailById(id: string): TrackedEmail | undefined {
  const emails = getTrackedEmails();
  return emails.find((e) => e.id == id);
}

export function updateTrackedEmail(updatedEmail: TrackedEmail): void {
  const emails = getTrackedEmails();
  const index = emails.findIndex((e) => e.id === updatedEmail.id);

  if (index !== -1) {
    emails[index] = updatedEmail;
    saveTrackedEmails(emails);
  }
}

export function addTrackedEmail(email: Omit<TrackedEmail, "id">): TrackedEmail {
  const emails = getTrackedEmails();
  const newEmail: TrackedEmail = {
    ...email,
    id: String(Date.now() + Math.random()),
  };

  emails.unshift(newEmail);
  saveTrackedEmails(emails);
  return newEmail;
}

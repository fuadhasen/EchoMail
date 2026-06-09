const res = [
  {
    id: 1,
    subject: "Frontend Developer Interview",
    sender: "hr@techcorp.com",
    sent_date: "2026-06-01",
    deadline: "2026-06-15",
    created_at: "2026-06-01T10:00:00",
    is_done: false,
    time_left: "6",
    recipients: [
      {
        email: "candidate@example.com",
        has_responded: true,
        last_reminder: "2026-06-05",
      },
      {
        email: "manager@example.com",
        has_responded: false,
        last_reminder: "2026-06-07",
      },
    ],
  },

  {
    id: 2,
    subject: "Project Proposal Review",
    sender: "fuad@echomail.com",
    sent_date: "2026-06-02",
    deadline: "2026-06-20",
    created_at: "2026-06-02T09:30:00",
    is_done: false,
    time_left: "11",
    recipients: [
      {
        email: "client@company.com",
        has_responded: false,
        last_reminder: "__",
      },
    ],
  },

  {
    id: 3,
    subject: "Partnership Opportunity",
    sender: "contact@startup.io",
    sent_date: "2026-05-28",
    deadline: "2026-06-03",
    created_at: "2026-05-28T14:00:00",
    is_done: false,
    time_left: "-2",
    recipients: [
      {
        email: "founder@startup.io",
        has_responded: false,
        last_reminder: "2026-06-01",
      },
    ],
  },

  {
    id: 4,
    subject: "Job Offer Discussion",
    sender: "recruiter@company.com",
    sent_date: "2026-05-25",
    deadline: "2026-06-05",
    created_at: "2026-05-25T08:00:00",
    is_done: true,
    time_left: "0",
    recipients: [
      {
        email: "fuad@example.com",
        has_responded: true,
        last_reminder: "2026-05-29",
      },
    ],
  },
];

export default res;

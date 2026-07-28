export interface SimplifiedAttentionItem {
  id: number;
  subject: string;
  pendingRecipients: number;
  status: string;
  daysLeft: string;
}

export interface ActivityItems {
  id: number;
  iconType: "reply" | "reminder" | "view" | "mail";
  user?: string;
  boldText?: string;
  regularText: string;
  timeLabel: string;
}

// Frontend Interfaces
export interface SentEmailRecipient {
  name: string;
  email: string;
}

export interface SentEmailSender {
  name: string;
  email: string;
}

export interface SentEmail {
  id: string;
  thread_id: string;
  sender: SentEmailSender;
  subject: string;
  sentDate: string;
  snippet: string;
  recipients: SentEmailRecipient[];
}

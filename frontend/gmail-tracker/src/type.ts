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

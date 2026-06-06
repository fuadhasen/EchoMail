import type { Recipients } from "./TrackedDetail";

export interface TrackedEmailEntity {
  id: number;
  subject: string;
  deadline: string;
  created_at: string;
  is_done: boolean;
  time_left: string;
  sender: string;
  sent_date: string;
  recipients: Recipients[];
}

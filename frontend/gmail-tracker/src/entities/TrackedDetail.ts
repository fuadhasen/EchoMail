export interface TrackedDetail {
  id: number;
  subject: string;
  deadline: string;
  sent_date: string;
  is_done: boolean;
  recipients: Recipients[];
  required_recipients: string[];
  responded_recipients: string[];
  pending_recipients: string[];
}

export interface Recipients {
  id: number;
  email: string;
  name: string;
  must_respond: string;
  has_responded: string;
  response_id: string;
  last_reminder_sent: string;
  last_reminder: string;
}

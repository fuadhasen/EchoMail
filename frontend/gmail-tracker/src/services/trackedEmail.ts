import api from "./api";

export interface TrackEmailRequest {
  recipient_emails: string[];
  must_respond_emails: string[];
  deadline: string;
}

export interface TrackedRecipient {
  id: number;
  email: string;
  name: string | null;

  must_respond: boolean;
  has_respon: boolean;

  response_id: string | null;
  last_reminder_sent: string | null;
}

export interface TrackedNewResponse {
  tracked_email_id: number;
  email_id: string;
  thread_id: string;
  subject: string;
  sender: string;
  sent_date: string;
  deadline: string;
  recipients: TrackedRecipient[];
  required_recipients: TrackedRecipient[];
}

export interface TrackedEmailB {
  id: string;
  email_id: string;
  thread_id: string;
  subject: string;
  sender: string;
  sentDate: string;
  deadline: string;
  isDone: boolean;
  recipients: TrackedRecipient[];
  required_recipients: TrackedRecipient[];
}

export interface TrackedEmailsResponse {
  tracked_emails: TrackedEmailB[];
}

export const trackNew = async (
  emailId: string,
  data: TrackEmailRequest,
): Promise<TrackedNewResponse> => {
  const response = await api.post<TrackedNewResponse>(
    `/emails/${emailId}/track`,
    data,
  );
  return response.data;
};

export const trackedEmails = async (
  showDone: boolean,
): Promise<TrackedEmailB[]> => {
  const response = await api.get<TrackedEmailsResponse>("/tracked-emails", {
    params: { show_done: showDone },
  });

  return response.data.tracked_emails;
};

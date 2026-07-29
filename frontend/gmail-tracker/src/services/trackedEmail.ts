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

export interface TrackedEmailResponse {
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

export const trackEmail = async (
  emailId: string,
  data: TrackEmailRequest,
): Promise<TrackedEmailResponse> => {
  const response = await api.post<TrackedEmailResponse>(
    `/emails/${emailId}/track`,
    data,
  );
  return response.data;
};

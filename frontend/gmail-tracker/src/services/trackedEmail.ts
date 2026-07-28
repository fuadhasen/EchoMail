import api from "./api";

export interface TrackedEmailRequest {
  recipient_emails: string[];
  must_respond_emails: string[];
  deadline: string;
}

export const trackEmail = async (
  emailId: string,
  data: TrackedEmailRequest,
) => {
  const response = await api.post(`/emails/${emailId}/track`, data);
  return response.data;
};

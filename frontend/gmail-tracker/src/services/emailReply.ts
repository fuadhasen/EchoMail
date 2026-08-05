import api from "./api";

export interface EmailReply {
  response_id: string;
  sender: string;
  snippet: string;
  sent_at: string;
}

export interface EmailReplyResponse {
  responses: EmailReply[];
}

export const getEmailReply = async (
  email_id?: string,
  maxResults: number = 10,
): Promise<EmailReplyResponse> => {
  const response = await api.get(`/email-responses/${email_id}`, {
    params: { max_results: maxResults },
  });

  return response.data;
};

export interface EmailResponse {
  id: string;
  threadId: string;
  subject: string;
  sender: string;
  snippet: string;
  headers: string;
  sent_date: string;
}

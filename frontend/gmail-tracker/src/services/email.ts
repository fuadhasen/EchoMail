import type { SentEmail } from "@/type";
import api from "./api";
import { mapSentEmail } from "./emailmapper";

export interface SentEmailB {
  id: string;
  thread_id: string;
  subject: string;
  sender: string;
  recipients: string[];
  snippet: string;
  sent_date: string;
}

export interface SearchSentEmailResponse {
  emails: SentEmailB[];
}

// FE interface
export interface SearchSentEmailResult {
  emails: SentEmail[];
}

const searchSentEmails = async (
  searchTerm?: string,
): Promise<SearchSentEmailResult> => {
  const response = await api.get<SearchSentEmailResponse>(
    "/search-sent-emails",
    {
      params: {
        search_term: searchTerm,
      },
    },
  );

  return {
    emails: response.data.emails.map(mapSentEmail),
  };
};

export default searchSentEmails;

import api from "./api";

export interface Recipient {
  name: string;
  email: string;
}

export interface SentEmailB {
  id: string;
  thread_id: string;
  subject: string;
  sender: string;
  recipients: Recipient[];
  snippet: string;
  sentdate: string;
}

export interface SearchSentEmailResponse {
  emails: SentEmailB[];
}

const searchSentEmails = async (
  searchTerm: string,
): Promise<SearchSentEmailResponse> => {
  const response = await api.get<SearchSentEmailResponse>(
    "/search-sent-emails",
    {
      params: {
        search_term: searchTerm,
      },
    },
  );

  return response.data;
};

export default searchSentEmails;

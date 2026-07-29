import searchSentEmails from "@/services/email";
import { useQuery } from "@tanstack/react-query";

const useSentEmails = (searchTerm: string) => {
  return useQuery({
    queryKey: ["sent-emails", searchTerm],
    queryFn: () => searchSentEmails(searchTerm),

    enabled: !!searchTerm.trim(),
    staleTime: 1000 * 60 * 60,
  });
};

export default useSentEmails;

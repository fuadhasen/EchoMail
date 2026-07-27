import searchSentEmails from "@/services/email";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const useSentEmails = (searchTerm: string) => {
  return useQuery({
    queryKey: ["sent-emails", searchTerm],
    queryFn: () => searchSentEmails(searchTerm),

    enabled: !!searchTerm.trim(),
    staleTime: 5 * 60 * 1000,
  });
};

export default useSentEmails;

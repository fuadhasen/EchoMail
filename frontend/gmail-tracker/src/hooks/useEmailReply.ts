import { getEmailReply, type EmailReplyResponse } from "@/services/emailReply";
import { useQuery } from "@tanstack/react-query";

const useEmailReply = (email_id?: string) => {
  return useQuery<EmailReplyResponse>({
    queryKey: ["email-responses", email_id],
    queryFn: () => getEmailReply(email_id),
    enabled: !!email_id,

    staleTime: 1000 * 60 * 60,
  });
};

export default useEmailReply;

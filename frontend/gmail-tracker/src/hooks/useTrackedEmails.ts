import { trackedEmails } from "@/services/trackedEmail";
import { useQuery } from "@tanstack/react-query";

const useTrackedEmails = (showDone: boolean) => {
  return useQuery({
    queryKey: ["tracked-emails", showDone],
    queryFn: () => trackedEmails(showDone),
    staleTime: 1000 * 60 * 1,
  });
};

export default useTrackedEmails;

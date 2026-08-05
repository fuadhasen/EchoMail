import { markResponded } from "@/services/trackedEmail";
import { useMutation } from "@tanstack/react-query";

const useMarkResponded = () => {
  return useMutation<
    void,
    Error,
    { trackedEmailId: string; recipientEmail: string }
  >({
    mutationFn: ({ trackedEmailId, recipientEmail }) =>
      markResponded(trackedEmailId, recipientEmail),
  });
};

export default useMarkResponded;

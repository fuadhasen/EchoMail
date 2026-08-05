import { markUnResponded } from "@/services/trackedEmail";
import { useMutation } from "@tanstack/react-query";

const useMarkUnResponded = () => {
  return useMutation<
    void,
    Error,
    { trackedEmailId: string; recipientEmail: string }
  >({
    mutationFn: ({ trackedEmailId, recipientEmail }) =>
      markUnResponded(trackedEmailId, recipientEmail),
  });
};

export default useMarkUnResponded;

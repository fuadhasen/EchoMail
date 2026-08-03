import { sendReminder } from "@/services/trackedEmail";
import { useMutation } from "@tanstack/react-query";

const useSendReminder = () => {
  return useMutation<
    void,
    Error,
    { trackedEmailId: string; recipientEmail: string }
  >({
    mutationFn: ({ trackedEmailId, recipientEmail }) =>
      sendReminder(trackedEmailId, recipientEmail),
  });
};

export default useSendReminder;

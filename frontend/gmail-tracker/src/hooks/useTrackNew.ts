import {
  trackEmail,
  type TrackedEmailResponse,
  type TrackEmailRequest,
} from "@/services/trackedEmail";
import { useMutation } from "@tanstack/react-query";

const useTrackNew = () => {
  return useMutation<
    TrackedEmailResponse,
    Error,
    {
      emailId: string;
      data: TrackEmailRequest;
    }
  >({
    mutationFn: ({ emailId, data }) => trackEmail(emailId, data),
  });
};

export default useTrackNew;

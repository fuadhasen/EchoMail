import {
  trackNew,
  type TrackedNewResponse,
  type TrackEmailRequest,
} from "@/services/trackedEmail";
import { useMutation } from "@tanstack/react-query";

const useTrackNew = () => {
  return useMutation<
    TrackedNewResponse,
    Error,
    {
      emailId: string;
      data: TrackEmailRequest;
    }
  >({
    mutationFn: ({ emailId, data }) => trackNew(emailId, data),
  });
};

export default useTrackNew;

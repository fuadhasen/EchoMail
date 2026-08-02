import { markTrackedEmailDone } from "@/services/trackedEmail";
import { useMutation } from "@tanstack/react-query";

const useMarkDone = () => {
  return useMutation({
    mutationFn: (id: string | undefined) => markTrackedEmailDone(id),
  });
};

export default useMarkDone;

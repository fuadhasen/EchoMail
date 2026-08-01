import { trackedEmailById } from "@/services/trackedEmail";
import { useQuery } from "@tanstack/react-query";

const useTrackedDetail = (id: string | undefined) => {
  return useQuery({
    queryKey: [`tracked-emails/${id}`, id],
    queryFn: () => trackedEmailById(id),
  });
};

export default useTrackedDetail;

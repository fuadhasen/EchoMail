import api from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.post("/logout");
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["status"],
      });
    },
  });
};

export default useLogout;

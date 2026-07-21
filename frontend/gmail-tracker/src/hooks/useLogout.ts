import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await axios.post("http://localhost:8000/logout");
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["status"],
      });
    },
  });
};

export default useLogout;

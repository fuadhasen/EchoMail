import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type Status = "loading" | "authenticated" | "unauthenticated";

const useAuth = () => {
  const checkStatus = async () => {
    const res = await axios.get("http://localhost:8000/me");
    return res.data;
  };

  const { data, isPending, error } = useQuery({
    queryKey: ["status"],
    queryFn: () => checkStatus(),
    staleTime: 5 * 60 * 1000, // cache for 5 min
  });

  const status: Status = isPending
    ? "loading"
    : data.status == "authenticated"
    ? "authenticated"
    : "unauthenticated";

  return { status, isPending, error };
};

export default useAuth;

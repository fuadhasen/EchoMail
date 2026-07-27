import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export type Status = "loading" | "authenticated" | "unauthenticated";

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface AuthResponse {
  authenticated: boolean;
  user: User | null;
}

const useAuth = () => {
  const checkStatus = async (): Promise<AuthResponse> => {
    const res = await api.get("/auth/me");
    return res.data;
  };

  const { data, isPending, error } = useQuery({
    queryKey: ["status"],
    queryFn: () => checkStatus(),
    staleTime: 5 * 60 * 1000, // cache for 5 min
  });

  const status: Status = isPending
    ? "loading"
    : data?.authenticated
      ? "authenticated"
      : "unauthenticated";

  return { status, user: data?.user ?? null, isPending, error };
};

export default useAuth;

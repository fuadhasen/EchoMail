import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import ms from "ms";

const useEmailRecipients = (id: string) => {
  const fetchRecipients = async () => {
    const res = await api.get(`/email_recipients/${id}`);
    return res.data.recipients;
  };

  const { data, error, isPending } = useQuery<string[], Error>({
    queryKey: ["recipients", id],
    queryFn: () => fetchRecipients(),
    staleTime: ms("24h"),
  });

  return { data: data ?? [], error, isPending };
};

export default useEmailRecipients;

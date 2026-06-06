import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ms from "ms";

const useEmailRecipients = (id: string) => {
  const fetchRecipients = async () => {
    const res = await axios.get(`http://localhost:8000/email_recipients/${id}`);
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

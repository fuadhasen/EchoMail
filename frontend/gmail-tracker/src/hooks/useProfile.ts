import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import ms from "ms";

interface Profile {
  emailAddresses: { value: string }[];
  photos: { url: string }[];
}

const useProfile = () => {
  const fetchProfile = async () => {
    const res = await axios.get("http://localhost:8000/user_info");
    return res.data.user_info;
  };

  const { data, error, isPending } = useQuery<Profile, Error>({
    queryKey: ["profile"],
    queryFn: () => fetchProfile(),
    staleTime: ms("24h"),
  });

  return { data, error, isPending };
};

export default useProfile;

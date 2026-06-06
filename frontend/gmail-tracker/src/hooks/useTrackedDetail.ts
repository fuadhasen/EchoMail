import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import ms from "ms";
import type { TrackedDetail } from "../entities/TrackedDetail";

const useTrackedDetail = (id: string) => {
  const fetchEmailDetail = async () => {
    const res = await axios.get(`http://localhost:8000/tracked-emails/${id}`);
    return res.data;
  };

  const { data, error, isPending } = useQuery<TrackedDetail, Error>({
    queryKey: ["tracked-detail", id],
    queryFn: () => fetchEmailDetail(),
    staleTime: ms("24h"),
  });

  const sent_date = data?.sent_date
    ? new Date(data?.sent_date).toDateString()
    : "undefined";
  const deadline = data?.deadline
    ? new Date(data.deadline).toDateString()
    : "undefined";
  const response = data?.recipients.map((res) => {
    const lastReminderDate = dayjs(res.last_reminder_sent);
    const lastReminderSent = lastReminderDate.isValid()
      ? lastReminderDate.fromNow()
      : "__";

    res["last_reminder"] = lastReminderSent;
    return res;
  });

  return { data, response, sent_date, deadline, error, isPending };
};

export default useTrackedDetail;

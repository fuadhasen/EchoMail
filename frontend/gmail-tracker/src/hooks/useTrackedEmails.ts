import { useQuery } from "@tanstack/react-query";
import ms from "ms";
import type { TrackedEmailEntity } from "../entities/TrackedEmailEntity";
import axios from "axios";
import dayjs from "dayjs";

const useTrackedEmails = (url: string) => {
  const fetchTrackedEmails = async () => {
    const res = await axios.get(url);
    return res.data.tracked_emails;
  };

  const {
    data: emails,
    error,
    isPending,
  } = useQuery<TrackedEmailEntity[], Error>({
    queryKey: ["tracked_emails", url],
    queryFn: () => fetchTrackedEmails(),
    staleTime: ms("1h"),
  });

  const res = emails?.map((res) => {
    const sent_date = new Date(res.sent_date).toDateString();
    const deadline = new Date(res.deadline).toDateString();

    const response = res.recipients.map((res) => {
      const lastReminderDate = dayjs(res.last_reminder_sent);
      const lastReminderSent = lastReminderDate.isValid()
        ? lastReminderDate.fromNow()
        : "__";

      res["last_reminder"] = lastReminderSent;
      return res;
    });

    const time_left = new Date(res.deadline).getTime() - new Date().getTime();
    const days_left = time_left / 86400000; // microseconds
    res["time_left"] = days_left.toFixed();
    res["sent_date"] = sent_date;
    res["deadline"] = deadline;
    res["recipients"] = response;
    return res;
  });

  return { res, error, isPending };
};

export default useTrackedEmails;

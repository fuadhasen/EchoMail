import { dailyActivities } from "@/services/activity";
import { useQuery } from "@tanstack/react-query";

const useActivityData = () => {
  return useQuery({
    queryKey: ["daily-activities"],
    queryFn: dailyActivities,
    staleTime: 1000 * 60 * 1,

    select: (data) => {
      const activityMap = new Map(data.map((item) => [item.day, item]));

      const today = new Date();

      const last7Days = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (6 - index));

        return date;
      });

      // 3. Build the data that the graph will use
      return last7Days.map((date) => {
        const dateKey = date.toISOString().split("T")[0];

        const activity = activityMap.get(dateKey);

        return {
          day: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),

          responses: activity?.responses ?? 0,

          reminders: activity?.reminders ?? 0,

          completed: activity?.completed ?? 0,

          actions:
            (activity?.responses ?? 0) +
            (activity?.reminders ?? 0) +
            (activity?.completed ?? 0),
        };
      });
    },
  });
};

export default useActivityData;

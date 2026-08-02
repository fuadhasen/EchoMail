export type TrackedEmailStatus = "waiting" | "completed" | "overdue";

export const getTrackedEmailStatus = (is_done: boolean, deadline: string) => {
  if (is_done) {
    return "Completed";
  }

  if (new Date(deadline).getTime() < Date.now()) {
    return "Overdue";
  }

  return "Waiting";
};

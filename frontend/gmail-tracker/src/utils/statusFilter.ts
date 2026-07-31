export type TrackedEmailStatus = "waiting" | "completed" | "overdue";

export const getTrackedEmailStatus = (isDone: boolean, deadline: string) => {
  if (isDone) {
    return "Completed";
  }

  if (new Date(deadline).getTime() < Date.now()) {
    return "Overdue";
  }

  return "Waiting";
};

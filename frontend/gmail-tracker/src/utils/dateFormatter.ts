export const formatSenderName = (sender: string): string => {
  const match = sender.match(/^(.+?)\s*<.*>$/);

  return match ? match[1].trim() : sender;
};

export const formatSentDate = (date: string | number): string => {
  const dateObject = new Date(date);

  if (Number.isNaN(dateObject.getTime())) {
    return "Unknown date";
  }

  return dateObject.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const formatDeadline = (deadline: string): string => {
  const deadlineDate = new Date(deadline);

  if (Number.isNaN(deadlineDate.getTime())) {
    return "Invalid deadline";
  }

  const now = new Date();
  const diffMs = deadlineDate.getTime() - now.getTime();

  // Overdue
  if (diffMs <= 0) {
    const overdueMs = Math.abs(diffMs);

    const overdueMinutes = Math.floor(overdueMs / (1000 * 60));
    const overdueHours = Math.floor(overdueMinutes / 60);
    const overdueDays = Math.floor(overdueHours / 24);

    if (overdueDays > 0) {
      return `Overdue by ${overdueDays} ${overdueDays === 1 ? "day" : "days"}`;
    }

    if (overdueHours > 0) {
      return `Overdue by ${overdueHours} ${
        overdueHours === 1 ? "hour" : "hours"
      }`;
    }

    return `Overdue by ${Math.max(overdueMinutes, 1)} minutes`;
  }

  // still waiting
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `Due in ${diffDays} ${diffDays === 1 ? "day" : "days"}`;
  }

  if (diffHours > 0) {
    return `Due in ${diffHours} ${diffHours === 1 ? "hour" : "hours"}`;
  }

  return `Due in ${Math.max(diffMinutes, 1)} minutes`;
};

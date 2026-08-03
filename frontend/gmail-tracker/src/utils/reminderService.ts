export const COOLDOWN_HOURS = 24;
export const COOLDOWN_MS = COOLDOWN_HOURS * 60 * 60 * 1000;

export interface CooldownInfo {
  isEligible: boolean;
  lastSentText: string;
  timeRemainingText: string | null;
  buttonText: string;
  hoursRemaining: number;
  minutesRemaining: number;
}

/**
 * Calculate recipient reminder cooldown status derived dynamically from last_reminder_sent
 * its for a better UX but the actual restriction will be handled at the backend
 */
export function getCooldownInfo(
  lastReminderSent: string | null,
  nowMs: number = Date.now(),
): CooldownInfo {
  if (!lastReminderSent) {
    return {
      isEligible: true,
      lastSentText: "Never",
      timeRemainingText: null,
      buttonText: "Send Reminder",
      hoursRemaining: 0,
      minutesRemaining: 0,
    };
  }

  const sentMs = new Date(lastReminderSent).getTime();
  if (isNaN(sentMs)) {
    return {
      isEligible: true,
      lastSentText: "Never",
      timeRemainingText: null,
      buttonText: "Send Reminder",
      hoursRemaining: 0,
      minutesRemaining: 0,
    };
  }

  // how many ms left to send reminder again
  const elapsedMs = Math.max(0, nowMs - sentMs);

  if (elapsedMs >= COOLDOWN_MS) {
    const elapsedHours = Math.floor(elapsedMs / (1000 * 60 * 60));
    const elapsedDays = Math.floor(elapsedHours / 24);
    const lastSentText =
      elapsedDays > 0
        ? `${elapsedDays} day${elapsedDays > 1 ? "s" : ""} ago`
        : `${elapsedHours} hour${elapsedHours > 1 ? "s" : ""} ago`;

    return {
      isEligible: true,
      lastSentText,
      timeRemainingText: null,
      buttonText: "Send Reminder",
      hoursRemaining: 0,
      minutesRemaining: 0,
    };
  }

  //Active cooldown state (u can't send reminder here)
  const elapsedHours = Math.floor(elapsedMs / (1000 * 60 * 60));
  const elapsedMins = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));

  const lastSentText =
    elapsedHours == 0
      ? elapsedMins === 0
        ? "Just now"
        : `${elapsedMins} min${elapsedMins > 1 ? "s" : ""} ago`
      : `${elapsedHours} hour${elapsedHours > 1 ? "s" : ""} ago`;

  const remainingMs = COOLDOWN_MS - elapsedMs;
  const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
  const remainingMins = Math.floor(
    (remainingMs % (1000 * 60 * 60)) / (1000 * 60),
  );

  const timeRemainingText =
    remainingHours > 0
      ? `Available again in ${remainingHours} hour${remainingHours > 1 ? "s" : ""}`
      : `Available again in ${remainingMins} min${remainingMins > 1 ? "s" : ""}`;

  const buttonText =
    remainingHours > 0
      ? `Available in ${remainingHours}h`
      : `Available in ${remainingMins}m`;

  return {
    isEligible: false,
    lastSentText,
    timeRemainingText,
    buttonText,
    hoursRemaining: remainingHours,
    minutesRemaining: remainingMins,
  };
}

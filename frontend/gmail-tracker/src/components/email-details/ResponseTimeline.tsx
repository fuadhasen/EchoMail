import type { TrackedEmailB } from "@/services/trackedEmail";
import { getTrackedEmailStatus } from "@/utils/statusFilter";
import { AlertCircle, Check, CheckCircle2, Clock, Send } from "lucide-react";

interface ResponseTimelineProps {
  email: TrackedEmailB;
  onSync?: () => void;
}

interface TimelineEvent {
  id: string;
  type: "sent" | "response" | "reminder" | "completed" | "active_monitoring";
  dateLabel: string;
  timeLabel: string;
  title: string;
  meta: string;
  duration?: string | null;
  recipientEmail?: string;
  recipientName?: string;
  timestampMs: number;
}

function parseToTimestampMs(dateStr?: string | null, fallbackMs = 0): number {
  if (!dateStr) return fallbackMs;
  try {
    const directDate = new Date(dateStr).getTime();
    if (!isNaN(directDate)) return directDate;

    // Handle "Jun 20, 2026, 10:15 AM" format
    const commaParts = dateStr.split(",").map((s) => s.trim());
    if (commaParts.length >= 3) {
      const parsed = new Date(
        `${commaParts[0]}, ${commaParts[1]} ${commaParts[2]}`,
      ).getTime();
      if (!isNaN(parsed)) return parsed;
    }
  } catch {
    // Ignore
  }
  return fallbackMs;
}

/**
 *
 * Calculate human-readable turnaround time
 *
 */

function calculateTurnaround(
  sentDateStr: string,
  responseDateStr: string | null,
): string | null {
  if (!responseDateStr) {
    return null;
  }

  const sent = parseToTimestampMs(sentDateStr);
  const resp = parseToTimestampMs(responseDateStr);

  if (sent <= 0 || resp <= 0 || resp < sent) {
    return null;
  }

  const diffMinutes = Math.floor((resp - sent) / (1000 * 60));

  const days = Math.floor(diffMinutes / (60 * 24));
  const hours = Math.floor((diffMinutes % (60 * 24)) / 60);
  const mins = diffMinutes % 60;

  if (days > 0) {
    return `${days}d ${hours}h`;
  }

  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }

  return `${Math.max(mins, 1)}m`;
}

function parseDateTimeLabels(dateStr: string | null): {
  dateLabel: string;
  timeLabel: string;
} {
  if (!dateStr) {
    return { dateLabel: "", timeLabel: "" };
  }

  const d = new Date(dateStr);

  if (isNaN(d.getTime())) {
    return {
      dateLabel: "Timeline",
      timeLabel: dateStr,
    };
  }

  const dateLabel = d.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const timeLabel = d.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return {
    dateLabel,
    timeLabel,
  };
}

function getRecipientDisplayName(name?: string | null, email = ""): string {
  if (name && name.trim()) return name.trim();
  if (!email) return "Recipient";
  const prefix = email.split("@")[0];
  return prefix
    .split(/[._-]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const ResponseTimeline = ({ email }: ResponseTimelineProps) => {
  const totalRecipients = email.recipients.length;

  const respondedRecipients = email.recipients.filter((r) => r.has_responded);
  const pendingRecipients = email.recipients.filter((r) => !r.has_responded);
  const status = getTrackedEmailStatus(email.is_done, email.deadline);
  const isCompleted =
    status === "Completed" ||
    (totalRecipients > 0 && pendingRecipients.length === 0);

  // helper to format mock timeline eveents
  const generateTimeEvents = () => {
    const events: TimelineEvent[] = [];
    const sentTimeMs = parseToTimestampMs(
      email.sent_date,
      Date.now() - 86400000,
    );

    // 1. Top Action: Outbound Email Dispatch
    const sentParsed = parseDateTimeLabels(email.sent_date);
    const sentEvent: TimelineEvent = {
      id: "event-sent",
      type: "sent",
      dateLabel: sentParsed.dateLabel,
      timeLabel: sentParsed.timeLabel,
      title: "You sent the email",
      meta: email.subject
        ? `Subject: "${email.subject}"`
        : "Initial outbound campaign dispatch",
      timestampMs: sentTimeMs,
    };

    // 2. Detected Responses Events
    const responseEvents: TimelineEvent[] = respondedRecipients.map(
      (recipient) => {
        const displayName = getRecipientDisplayName(
          recipient.name,
          recipient.email,
        );

        const responseTimestampStr = recipient.response_at;

        const calculatedResponseMs = parseToTimestampMs(
          responseTimestampStr,
          sentTimeMs,
        );
        const respParsed = parseDateTimeLabels(responseTimestampStr);
        const turnaround = calculateTurnaround(
          email.sent_date,
          responseTimestampStr,
        );

        return {
          id: `event-resp-${recipient.email}`,
          type: "response",
          dateLabel: respParsed.dateLabel,
          timeLabel: respParsed.timeLabel,
          title: `${displayName} responded`,
          meta: recipient.name ? recipient.email : "Direct recipient reply",
          duration: turnaround,
          recipientEmail: recipient.email,
          recipientName: displayName,
          timestampMs: calculatedResponseMs,
        };
      },
    );

    // latest response should be at the top
    responseEvents.sort((a, b) => b.timestampMs - a.timestampMs);

    const reminderEvents: TimelineEvent[] = [];
    email.recipients.forEach((r, idx) => {
      const lastReminder = r.last_reminder_sent;
      if (lastReminder) {
        const remParsed = parseDateTimeLabels(lastReminder);
        const hasName = Boolean(r.name && r.name.trim());
        const remDisplayName = hasName ? r.name!.trim() : r.email;
        reminderEvents.push({
          id: `event-rem-recip-${r.email}-${idx}`,
          type: "reminder",
          dateLabel: remParsed.dateLabel,
          timeLabel: remParsed.timeLabel,
          title: "Follow-up reminder sent",
          meta: hasName
            ? `Reminder dispatched to ${remDisplayName} (${r.email})`
            : `Reminder dispatched to ${r.email}`,
          timestampMs: parseToTimestampMs(lastReminder, sentTimeMs + 86400000),
        });
      }
    });

    // Sort reminders descending as well (latest reminder first)
    reminderEvents.sort((a, b) => b.timestampMs - a.timestampMs);

    // 4. Bottom Action: Terminal Milestone Sentinel (Completed or Active Monitoring)
    const terminalEvent: TimelineEvent = isCompleted
      ? {
          id: "event-completed",
          type: "completed",
          dateLabel: "Milestone",
          timeLabel: "Completed",
          title: "Tracking completed",
          meta: "All required recipients have confirmed their responses",
          timestampMs: Number.MAX_SAFE_INTEGER,
        }
      : {
          id: "event-monitoring",
          type: "active_monitoring",
          dateLabel: "Ongoing",
          timeLabel: "Live",
          title: "Tracking active",
          meta: `Monitoring inbox for ${pendingRecipients.length} remaining ${
            pendingRecipients.length === 1 ? "response" : "responses"
          }`,
          timestampMs: Number.MAX_SAFE_INTEGER,
        };

    // Construct timeline: Top Sent Event -> Responses (latest at top) -> Reminders -> Bottom Terminal Action
    events.push(sentEvent, ...responseEvents, ...reminderEvents, terminalEvent);
    return events;
  };

  const timelineEvents = generateTimeEvents();

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs p-6 sm:p-7 font-sans text-left space-y-6 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Response Activity
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time chronological activity stream of dispatch, replies, and
            reminders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs font-mono font-medium text-slate-600 bg-slate-50 border border-slate-200/80 px-3 py-1 rounded-lg shrink-0">
            <span className="font-semibold text-slate-900">
              {respondedRecipients.length}
            </span>{" "}
            / {totalRecipients} responded
          </div>
        </div>
      </div>

      <div className="relative pl-7 sm:pl-8">
        <div className="absolute left-3.25 top-4 bottom-5 w-px bg-slate-200/90" />

        <div className="space-y-4">
          {timelineEvents.map((event) => {
            return (
              <div key={event.id} className="relative group transition-all">
                <div className="absolute -left-7 sm:-left-8 top-3 w-6.75 flex items-center justify-center">
                  {event.type === "sent" && (
                    <span className="w-3 h-3 rounded-full bg-slate-900 ring-4 ring-white shadow-2xs" />
                  )}

                  {event.type === "response" && (
                    <span className="w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-white shadow-2xs flex items-center justify-center">
                      <span className="w-1 h-1 rounded-full bg-white" />
                    </span>
                  )}

                  {event.type === "reminder" && (
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-white shadow-2xs" />
                  )}

                  {event.type === "completed" && (
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center ring-4 ring-white shadow-2xs">
                      <Check size={10} className="stroke-3" />
                    </span>
                  )}

                  {event.type === "active_monitoring" && (
                    <span className="w-3 h-3 rounded-full bg-[#3525cd] ring-4 ring-white animate-pulse" />
                  )}
                </div>

                <div className="p-3 sm:px-4 sm:py-3 rounded-xl border border-transparent group-hover:border-slate-200/70 group-hover:bg-slate-50/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
                  <div className="sm:w-36 md:w-44 shrink-0 flex sm:flex-col items-baseline sm:items-start justify-between sm:justify-center gap-1">
                    <span className="text-xs font-semibold text-slate-800 tracking-tight">
                      {event.dateLabel}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400 font-medium">
                      {event.timeLabel}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-sm font-semibold tracking-tight truncate ${
                          event.type === "completed"
                            ? "text-slate-900 font-bold"
                            : event.type === "active_monitoring"
                              ? "text-slate-700 font-medium"
                              : "text-slate-900"
                        }`}
                      >
                        {event.title}
                      </h3>
                      {event.type === "response" && (
                        <span
                          className="inline-flex items-center text-emerald-600 font-bold text-xs"
                          title="Response confirmed"
                        >
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {event.meta}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center sm:justify-end">
                    {event.type === "response" && event.duration && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium text-emerald-700 bg-emerald-50/90 border border-emerald-200/70 shadow-2xs">
                        <Clock
                          size={12}
                          className="text-emerald-600 shrink-0"
                        />
                        <span>{event.duration} turnaround</span>
                      </div>
                    )}

                    {event.type === "sent" && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium text-slate-600 bg-slate-50 border border-slate-200/80">
                        <Send size={11} className="text-slate-400 shrink-0" />
                        <span>{totalRecipients} recipients</span>
                      </div>
                    )}

                    {event.type === "reminder" && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium text-amber-700 bg-amber-50 border border-amber-200/70">
                        <AlertCircle
                          size={12}
                          className="text-amber-500 shrink-0"
                        />
                        <span>Follow-up sent</span>
                      </div>
                    )}

                    {event.type === "completed" && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80">
                        <CheckCircle2
                          size={12}
                          className="text-emerald-600 shrink-0"
                        />
                        <span>100% complete</span>
                      </div>
                    )}

                    {event.type === "active_monitoring" && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium text-[#3525cd] bg-indigo-50 border border-indigo-200/70">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3525cd] animate-pulse shrink-0" />
                        <span>In progress</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResponseTimeline;

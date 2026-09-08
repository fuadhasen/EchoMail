import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Cpu,
  Radio,
  Send,
  Workflow,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import useTrackedEmails from "@/hooks/useTrackedEmails";
import { getTrackedEmailStatus } from "@/utils/statusFilter";
import { useNavigate } from "react-router";
import useActivityData from "@/hooks/useActivityData";

interface GlobalActivityEvent {
  id: string;
  emailId: string;
  emailSubject: string;
  type: "sent" | "response" | "reminder" | "completed";
  dateLabel: string;
  timeLabel: string;
  title: string;
  meta: string;
  recipientEmail?: string;
  recipientName?: string;
  duration?: string;
  badgeText?: string;
  timestampMs: number;
}

/**
 * Converts various date string formats to milliseconds for accurate chronological sorting.
 */
function parseToTimestampMs(dateStr?: string | null, fallbackMs = 0): number {
  if (!dateStr) return fallbackMs;
  try {
    const directDate = new Date(dateStr).getTime();
    if (!isNaN(directDate)) return directDate;

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
 * Calculates human-readable turnaround duration between dispatch and reply.
 */
function calculateTurnaround(
  sentDateStr: string,
  responseDateStr?: string | null,
): string {
  if (responseDateStr && sentDateStr) {
    try {
      const sent = parseToTimestampMs(sentDateStr);
      const resp = parseToTimestampMs(responseDateStr);
      if (sent > 0 && resp > 0 && resp >= sent) {
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
        return `${mins || 1}m`;
      }
    } catch {
      // fallback
    }
  }
  return "Prompt";
}

/**
 * Extracts clean Date and Time strings from arbitrary timestamp formats.
 */
function parseDateTimeLabels(dateStr: string | null): {
  dateLabel: string;
  timeLabel: string;
} {
  if (!dateStr) {
    return { dateLabel: "Initial", timeLabel: "12:00 PM" };
  }

  const commaParts = dateStr.split(",").map((s) => s.trim());
  if (commaParts.length >= 3) {
    return {
      dateLabel: `${commaParts[0]}, ${commaParts[1]}`,
      timeLabel: commaParts[2],
    };
  }
  if (commaParts.length === 2) {
    return { dateLabel: commaParts[0], timeLabel: commaParts[1] };
  }

  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const dateLabel = `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
      const timeLabel = d.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
      return { dateLabel, timeLabel };
    }
  } catch {
    // Ignore
  }

  return { dateLabel: "Timeline", timeLabel: dateStr };
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-md border border-slate-800 space-y-0.5">
        <p className="font-semibold text-slate-200">
          {label}: {data.actions} actions
        </p>
        <p className="text-[10px] text-slate-400">
          {data.reminders} reminders · {data.responses} responses ·{" "}
          {data.completed} completed
        </p>
      </div>
    );
  }
};

const Automation = () => {
  const navigate = useNavigate();

  const { data: activityData } = useActivityData();

  const totalActions = activityData?.reduce(
    (total, day) => total + day.actions,
    0,
  );

  const totalReminders = activityData?.reduce(
    (total, day) => total + day.reminders,
    0,
  );

  const totalResponses = activityData?.reduce(
    (total, day) => total + day.responses,
    0,
  );

  const totalCompleted = activityData?.reduce(
    (total, day) => total + day.completed,
    0,
  );

  const [showAllActivity, setShowAllActivity] = useState(false);
  const [filterType, setFilterType] = useState<
    "all" | "response" | "reminder" | "completed"
  >("all");

  const { data: emails = [] } = useTrackedEmails(true);

  const allEvents: GlobalActivityEvent[] = useMemo(() => {
    const events: GlobalActivityEvent[] = [];

    emails.forEach((email) => {
      const sentTimeMs = parseToTimestampMs(
        email.sent_date,
        Date.now() - 86400000,
      );

      const totalRecips = email.recipients?.length || 0;

      // 1. Dispatch Event
      const sentParsed = parseDateTimeLabels(email.sent_date);
      events.push({
        id: `sent-${email.id}`,
        emailId: email.id,
        emailSubject: email.subject,
        type: "sent",
        dateLabel: sentParsed.dateLabel,
        timeLabel: sentParsed.timeLabel,
        title: "Campaign tracking initiated",
        meta: `Outbound email with ${totalRecips} tracked ${totalRecips === 1 ? "recipient" : "recipients"}`,
        badgeText: `${totalRecips} recipients`,
        timestampMs: sentTimeMs,
      });

      // 2. Direct Recipient Response
      email.recipients.forEach((r) => {
        const hasResponded = r.has_responded;
        if (hasResponded) {
          const responseTimestampStr = r.response_at;
          const hasName = Boolean(r.name && r.name.trim());
          const displayName = hasName ? r.name!.trim() : r.email;
          const respParsed = parseDateTimeLabels(responseTimestampStr);
          const turnaround = calculateTurnaround(
            email.sent_date,
            responseTimestampStr,
          );

          const responseMs = parseToTimestampMs(
            responseTimestampStr,
            sentTimeMs,
          );

          events.push({
            id: `resp-${email.id}-${r.email}`,
            emailId: email.id,
            emailSubject: email.subject,
            type: "response",
            dateLabel: respParsed.dateLabel,
            timeLabel: respParsed.timeLabel,
            title: `${displayName} responded`,
            meta: hasName ? `${r.email}` : "Direct recipient reply",
            recipientEmail: r.email,
            recipientName: displayName,
            duration: turnaround,
            badgeText: `${turnaround} turnaround`,
            timestampMs: responseMs,
          });
        }

        // 3. Reminder
        const lastReminder = r.last_reminder_sent;
        if (lastReminder) {
          const remParsed = parseDateTimeLabels(lastReminder);
          const hasName = Boolean(r.name && r.name.trim());
          const displayName = hasName ? r.name!.trim() : r.email;
          const remMs = parseToTimestampMs(lastReminder, sentTimeMs + 86400000);

          events.push({
            id: `rem-${email.id}-${r.email}`,
            emailId: email.id,
            emailSubject: email.subject,
            type: "reminder",
            dateLabel: remParsed.dateLabel,
            timeLabel: remParsed.timeLabel,
            title: "Follow-up reminder sent",
            meta: hasName
              ? `Automated reminder to ${displayName} (${r.email})`
              : `Automated reminder to ${r.email}`,
            recipientEmail: r.email,
            recipientName: displayName,
            badgeText: "Follow-up sent",
            timestampMs: remMs,
          });
        }
      });

      // 4. compiled milestone
      const status = getTrackedEmailStatus(email.is_done, email.deadline);
      const isCompleted = status === "Completed";

      if (isCompleted) {
        let latestRespMs = sentTimeMs;
        email.recipients.forEach((r) => {
          const respStr = r.response_at;
          if (respStr) {
            const t = parseToTimestampMs(respStr);
            if (t > latestRespMs) latestRespMs = t;
          }
        });

        const completedParsed = parseDateTimeLabels(
          email.deadline.includes(",") ? email.deadline : email.sent_date,
        );

        events.push({
          id: `completed-${email.id}`,
          emailId: email.id,
          emailSubject: email.subject,
          type: "completed",
          dateLabel: completedParsed.dateLabel,
          timeLabel: completedParsed.timeLabel,
          title: "Thread tracking completed",
          meta: "All required recipients confirmed responses",
          badgeText: "100% complete",
          timestampMs: latestRespMs + 1000,
        });
      }
    });

    // newest event at the top
    events.sort((a, b) => b.timestampMs - a.timestampMs);
    return events;
  }, [emails]);

  const filteredEvents = useMemo(() => {
    if (filterType === "all") return allEvents;
    return allEvents.filter((ev) => ev.type === filterType);
  }, [allEvents, filterType]);

  // compact slice
  const displayedEvents = useMemo(() => {
    if (showAllActivity) return filteredEvents;
    return filteredEvents.slice(0, 4);
  }, [filteredEvents, showAllActivity]);

  const counts = useMemo(() => {
    return {
      all: allEvents.length,
      response: allEvents.filter((e) => e.type === "response").length,
      reminder: allEvents.filter((e) => e.type === "reminder").length,
      completed: allEvents.filter((e) => e.type === "completed").length,
    };
  }, [allEvents]);

  return (
    <div className="w-full space-y-5 font-sans text-left px-4 md:px-8 py-4 ">
      <header className="w-full border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
        <div className="spacey-y-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Automation
          </h1>
          <p className="text-sm text-slate-500 font-normal leading-relaxed mt-1">
            Echomail is working in the background for you.
          </p>
        </div>
      </header>

      <section className="w-full bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-2xs space-y-3.5 sm:space-y-4">
        <div className="space-y-0.5">
          <span className="text-[10px] font-semibold tracking-wider uppercase text-[#3525cd]">
            Engine Overview
          </span>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
            How Echomail Automation Works
          </h2>
          <p className="text-xs text-slate-500 font-normal leading-relaxed max-w-2xl">
            A continuous background workflow that monitors recipient activity,
            evaluate threads status, excute follow-ups automatically.
          </p>
        </div>

        {/* Process Visualization */}
        <div className="relative pt-1 pb-1">
          {/* horizontal line */}
          <div className="hidden md:block absolute  top-4.5 left-[10%] right-[10%] h-0.5 bg-slate-200/90 z-0" />

          <div className="grid grid-cols-1  md:grid-cols-4 gap-4 md:gap-2 relative z-10">
            {/* STEP 01 */}
            <div className="relative flex flex-row md:flex-col items-start md:items-center text-left md:text-center gap-3 md:gap-0 group">
              <div className="relative w-9 h-9 rounded-full bg-white border-2 border-[#3525cd] text-[#3525cd]  flex items-center justify-center shrink-0 shadow-2xs transition-all group-hover:scale-105 z-10">
                <Radio size={16} strokeWidth={2.2} />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
              </div>

              <div className="space-y-1 md:mt-2 flex-1">
                <span className="text-base font-mono font-extrabold tracking-wider text-[#3525cd] block">
                  01
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                  Response Detection
                </h3>
                <p className="text-[11px] text-slate-500 font-normal leading-relaxed md:max-w-45 md:mx-auto">
                  Continuously checks tracked emails for new recipient replies.
                </p>

                <div className="pt-0.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/80 text-[10px] font-medium text-slate-600">
                    Every 5 min
                  </span>
                </div>
              </div>
            </div>

            {/* STEP 02 */}
            <div className="relative flex flex-row md:flex-col items-start md:items-center text-left md:text-center gap-3 md:gap-0 group">
              <div className="md:hidden absolute  left-4.25 -top-4 h-4 w-0.5 bg-slate-200/90" />

              <div className="w-9 h-9 rounded-full bg-white border-2 border-slate-300 text-slate-600 flex items-center justify-center  shrink-0 shadow-2xs transition-all group-hover:border-[#3525cd] group-hover:text-[#3525cd] group-hover:scale-105 z-10">
                <Cpu size={16} strokeWidth={2.2} />
              </div>

              <div className="space-y-1 md:mt-2 flex-1">
                <span className="text-base font-mono font-extrabold tracking-wider text-slate-400 group-hover:text-[#3525cd] transition-colors block">
                  02
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                  Response Evaluation
                </h3>
                <p className="text-[11px] text-slate-500 font-normal leading-relaxed md:max-w-45 md:mx-auto">
                  Checks who has responded and who is still pending.
                </p>
                <div className="pt-0.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/80 text-[10px] font-medium text-slate-600">
                    12 recipients monitored
                  </span>
                </div>
              </div>
            </div>

            <div className="relative flex flex-row md:flex-col items-start md:items-center text-left md:text-center gap-3 md:gap-0 group">
              {/* Mobile Vertical Connector Line */}
              <div className="md:hidden absolute left-4.25 -top-4 h-4 w-0.5 bg-slate-200/90" />

              {/* Node Icon */}
              <div className="w-9 h-9 rounded-full bg-white border-2 border-slate-300 text-slate-600 flex items-center justify-center shrink-0 shadow-2xs transition-all group-hover:border-[#3525cd] group-hover:text-[#3525cd] group-hover:scale-105 z-10">
                <Workflow size={16} strokeWidth={2.2} />
              </div>

              <div className="space-y-1 md:mt-2 flex-1">
                <span className="text-base font-mono font-extrabold tracking-wider text-slate-400 group-hover:text-[#3525cd] transition-colors block">
                  03
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                  Automation Decision
                </h3>
                <p className="text-[11px] text-slate-500 font-normal leading-relaxed md:max-w-45 md:mx-auto">
                  Determines whether a reminder or completion action is
                  required.
                </p>
                <div className="pt-0.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/80 text-[10px] font-medium text-slate-600">
                    Evaluated automatically
                  </span>
                </div>
              </div>
            </div>

            {/* STEP 04 */}
            <div className="relative flex flex-row md:flex-col items-start md:items-center text-left md:text-center gap-3 md:gap-0 group">
              {/* Mobile Vertical Connector Line */}
              <div className="md:hidden absolute left-4.5 -top-4 h-4 w-0.5 bg-slate-200/90" />

              {/* Node Icon */}
              <div className="w-9 h-9 rounded-full bg-white border-2 border-slate-300 text-slate-600 flex items-center justify-center shrink-0 shadow-2xs transition-all group-hover:border-[#3525cd] group-hover:text-[#3525cd] group-hover:scale-105 z-10">
                <Send size={16} strokeWidth={2.2} />
              </div>

              <div className="space-y-1 md:mt-2 flex-1">
                <span className="text-base font-mono font-extrabold tracking-wider text-slate-400 group-hover:text-[#3525cd] transition-colors block">
                  04
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                  Action
                </h3>
                <p className="text-[11px] text-slate-500 font-normal leading-relaxed md:max-w-45 md:mx-auto">
                  Sends reminders or completes the tracked email when
                  appropriate.
                </p>
                <div className="pt-0.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/80 text-[10px] font-medium text-slate-600">
                    Automatic dispatch
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* left */}
        <div className="lg:col-span-6 space-y-5 flex flex-col justify-between">
          {/* Mini Graph */}
          <section className="w-full bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                  Automation Activity
                </h2>
                <p className="text-[11px] text-slate-500 font-normal">
                  Last 7 days
                </p>
              </div>

              <div className="text-right">
                <span className="text-base sm:text-lg font-extrabold text-slate-900 leading-none block">
                  {totalActions}
                </span>

                <span className="text-[9px] font-medium text-slate-400 uppercase tracking-wider">
                  actions
                </span>
              </div>
            </div>

            {/* lightweight area chart */}
            <div className="h-28 w-full pb-1 pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={activityData}
                  margin={{ top: 6, right: 6, left: -28, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="purpleGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3525cd" stopOpacity={0.2} />
                      <stop
                        offset="95%"
                        stopColor="#3525cd"
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#64748b" }}
                    dy={4}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: "#94a3b8" }}
                    domain={[0, "auto"]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="actions"
                    stroke="#3525cd"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#purpleGradient)"
                    activeDot={{
                      r: 4,
                      fill: "#3525cd",
                      stroke: "#ffffff",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-1">
              <div className="font-mono text-slate-500 text-sm">
                {totalReminders} reminders · {totalResponses} responses ·{" "}
                {totalCompleted} completed
              </div>
            </div>
          </section>
        </div>

        {/* Right */}
        <div className="lg:col-span-6 space-y-5">
          <section className="w-full h-full bg-white  border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
            {/* header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                  Recent Activity
                </h2>
                <p className="text-[11px] text-slate-500 font-normal">
                  Latest automated background events
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200/70">
                <button
                  onClick={() => setFilterType("all")}
                  className={`px-2 py-0.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                    filterType === "all"
                      ? "bg-white text-slate-900 shadow-2xs font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  All ({counts.all})
                </button>

                <button
                  onClick={() => setFilterType("response")}
                  className={`px-2 py-0.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                    filterType === "response"
                      ? "bg-emerald-600 text-white shadow-2xs font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Replies ({counts.response})
                </button>

                <button
                  onClick={() => setFilterType("reminder")}
                  className={`px-2 py-0.5 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                    filterType === "reminder"
                      ? "bg-amber-600 text-white shadow-2xs font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Reminders ({counts.reminder})
                </button>
              </div>
            </div>

            {/* time line stream */}
            <div className="relative pl-7 sm:pl-8 pt-1">
              <div
                className="absolute left-3.75 top-3 bottom-3 w-px bg-slate-200/90"
                aria-hidden="true"
              />

              {displayedEvents.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No activity found for the selected filter.
                </div>
              ) : (
                <div className="space-y-3">
                  {displayedEvents.map((event) => {
                    return (
                      <div
                        key={event.id}
                        onClick={() =>
                          navigate(`/app/tracked/detail/${event.emailId}`)
                        }
                        className="relative group transition-all cursor-pointer"
                      >
                        <div className="absolute -left-7 sm:-left-8 top-3.5 w-6.75 flex items-center justify-center">
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
                            <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center ring-4 ring-white shadow-2xs">
                              <Check size={9} className="stroke-3" />
                            </span>
                          )}
                        </div>

                        <div className="p-3 rounded-xl border border-slate-100/90 hover:border-slate-300/80 bg-slate-50/40 hover:bg-slate-50/90 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 shadow-2xs">
                          {/* left column */}
                          <div className="sm:w-28 md:w-32 shrink-0 flex sm:flex-col items-baseline sm:items-start justify-between sm:justify-center gap-0.5">
                            <span className="text-[11px] font-semibold text-slate-800 tracking-tight">
                              {event.dateLabel}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400 font-medium">
                              {event.timeLabel}
                            </span>
                          </div>

                          {/* middle */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                Thread
                              </span>
                              <span className="text-[11px] font-semibold text-[#3525cd] hover:underline truncate max-w-47.5 sm:max-w-xs">
                                {event.emailSubject}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 ">
                              <h3
                                className={`text-xs font-semibold tracking-tight truncate ${
                                  event.type === "completed"
                                    ? "text-slate-900 font-bold"
                                    : "text-slate-900"
                                }`}
                              >
                                {event.title}
                              </h3>
                              {event.type === "response" && (
                                <span
                                  className="inline-flex items-center text-emerald-600 font-bold text-[11px]"
                                  title="Response confirmed"
                                >
                                  ✓
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {event.meta}
                            </p>
                          </div>

                          <div className="shrink-0 flex items-center gap-1.5 sm:justify-end">
                            {event.type === "response" && event.duration && (
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-mono font-medium text-slate-600 bg-slate-100 border border-slate-200/80">
                                <Clock
                                  size={10}
                                  className="text-emerald-600 shrink-0"
                                />
                                <span>{event.duration}</span>
                              </div>
                            )}

                            {event.type === "sent" && (
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-mono font-medium text-slate-600 bg-slate-100 border border-slate-200/80">
                                <Send
                                  size={10}
                                  className="text-slate-400 shrink-0"
                                />
                                <span>{event.badgeText}</span>
                              </div>
                            )}

                            {event.type === "reminder" && (
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-mono font-medium text-amber-700 bg-amber-50 border border-amber-200/70">
                                <AlertCircle
                                  size={10}
                                  className="text-amber-500 shrink-0"
                                />
                                <span>Sent</span>
                              </div>
                            )}

                            {event.type === "completed" && (
                              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80">
                                <CheckCircle2
                                  size={10}
                                  className="text-emerald-600 shrink-0"
                                />
                                <span>Complete</span>
                              </div>
                            )}

                            <div className="text-slate-400 group-hover:text-[#3525cd] transition-colors pl-1">
                              <ArrowRight
                                size={13}
                                className="group-hover:translate-x-0.5 transition-transform"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 font-medium">
                {showAllActivity
                  ? `Showing all ${filteredEvents.length} events`
                  : `Showing ${Math.min(4, filteredEvents.length)}  of ${filteredEvents.length} events`}
              </span>

              {filteredEvents.length > 4 && (
                <button
                  type="button"
                  onClick={() => setShowAllActivity(!showAllActivity)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3525cd] hover:text-[#2b1ea8] transition-colors cursor-pointer hover:underline"
                  id="btn-toggle-see-all-activity"
                >
                  <span>
                    {showAllActivity
                      ? "Show less activity"
                      : `See all activity (${filteredEvents.length})`}
                  </span>
                  {showAllActivity ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Automation;

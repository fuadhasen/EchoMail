import { useToast } from "@/context/ToastContext";
import type { TrackedEmailB } from "@/services/trackedEmail";
import { formatSentDate } from "@/utils/dateFormatter";
import {
  Activity,
  BarChart3,
  Bell,
  CheckCircle2,
  Clock,
  Filter,
  Mail,
  Radio,
  Send,
  Sparkles,
  Zap,
} from "lucide-react";
import React, { useState } from "react";

interface ResponseTimelineProps {
  email: TrackedEmailB;
  onSync?: () => void;
}

const ResponseTimeline = ({ email }: ResponseTimelineProps) => {
  const [eventFilter, setEventFilter] = useState<
    "all" | "responses" | "reminders"
  >("all");

  const totalRecipients = email.recipients.length;
  const respondedRecipients = email.recipients.filter((r) => r.has_responded);
  const pendingRecipients = email.recipients.filter((r) => !r.has_responded);
  const completionPercentage =
    totalRecipients > 0
      ? Math.round((respondedRecipients.length / totalRecipients) * 100)
      : 0;

  // helper to format mock timeline eveents
  const generateTimeEvents = () => {
    const events: Array<{
      id: string;
      type: "sent" | "detected" | "reminder" | "monitoring";
      title: string;
      recipientEmail?: string;
      description: string;
      timestamp: string;
      badge?: string;
      icon: React.ElementType;
      iconBg: string;
      iconColor: string;
    }> = [];

    // 1. Initial Sent Event
    events.push({
      id: "evt-sent",
      type: "sent",
      title: "Email Sent & Tracking Initiated",
      description: `Tracked email sent to ${totalRecipients} recipient${totalRecipients > 1 ? "s" : ""}. Automatic response detection activated.`,
      timestamp: formatSentDate(email.sent_date),
      icon: Send,
      iconBg: "bg-indigo-50 border-indigo-100",
      iconColor: "text-[#3525cd]",
    });

    // 2. Detected Responses Events
    respondedRecipients.forEach((r, idx) => {
      const times = ["4h 12m", "18h 40m", "1d 2h", "2h 05m"];
      const respTime = times[idx % times.length];

      events.push({
        id: `evt-detected-${r.email}`,
        type: "detected",
        title: `Automatic Response Detected`,
        recipientEmail: r.email,
        description: `Incoming reply detected via Gmail Outbox sync. Status automatically updated to Responded.`,
        // r.respondedAt should be added here later
        timestamp: "Yesterday at 2:15 PM",
        badge: `Response time: ${respTime}`,
        icon: Sparkles,
        iconBg: "bg-emerald-50 border-emerald-100",
        iconColor: "text-emerald-600",
      });
    });

    // 3. Reminders sent
    email.recipients.forEach((r) => {
      if (r.last_reminder_sent) {
        const formattedTime = new Date(r.last_reminder_sent).toLocaleString(
          [],
          {
            dateStyle: "short",
            timeStyle: "short",
          },
        );

        events.push({
          id: `evt-recipient-reminder-${r.email}`,
          type: "reminder",
          title: `Follow-up Reminder Sent`,
          recipientEmail: r.email,
          description: `Follow-up reminder dispatched to ${r.name} (${r.email}).`,
          timestamp: formattedTime,
          icon: Bell,
          iconBg: "bg-amber-50 border-amber-100",
          iconColor: "text-amber-600",
        });
      }
    });

    // 4. current monitoring status event
    if (pendingRecipients.length > 0) {
      events.push({
        id: "evt-monitoring",
        type: "monitoring",
        title: "Active Outbox Monitoring",
        description: `EchoMail is scanning for incoming replies from ${pendingRecipients.map((r) => r.name).join(", ")}.`,
        timestamp: "Ongoing (Every 5 mins)",
        badge: "● Live Monitoring",
        icon: Radio,
        iconBg: "bg-slate-100 border-slate-200",
        iconColor: "text-amber-500 animate-pulse",
      });
    } else {
      events.push({
        id: "evt-completed",
        type: "detected",
        title: "Tracking Loop Completed",
        description:
          "All required recipients have responded to this email thread.",
        timestamp: "Thread Closed",
        badge: "100% Complete",
        icon: CheckCircle2,
        iconBg: "bg-emerald-50 border-emerald-100",
        iconColor: "text-emerald-600",
      });
    }

    return events;
  };

  const allTimelineEvents = generateTimeEvents();

  const filteredEvents = allTimelineEvents.filter((evt) => {
    if (eventFilter === "responses") return evt.type === "detected";

    if (eventFilter === "reminders") return evt.type === "reminder";
    return true;
  });

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
      {/* thread activity header */}
      <div className="bg-slate50/80 border border-slate-200/80  rounded-xl p-3.5 sm:p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="space-y-0.5">
            <h4 className="font-sans text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <BarChart3 size={15} className="text-[#3525cd]" />
              <span>Thread Activity Audit Trial</span>
            </h4>
            <p className="font-sans text-xs text-slate-500">
              Chronological ledger of outbox dipatches, captured responses, and
              reminder events.
            </p>
          </div>

          <div>
            <span className="text-[10px] font-mono font-bold text-slate-700 bg-white border border-slate-200/80 px-2 py-1 rounded-lg shadow-2xs flex items-center gap-1">
              <Activity size={11} className="text-[#3525cd]" />
              {allTimelineEvents.length} Events
            </span>
          </div>
        </div>

        {/* quick event filter bar */}
        <div className="pt-2 border-t border-slate-200/60  flex items-center justify-between gap-2 flex-wrap text-xs font-sans">
          <div className="flex items-center gap-1">
            <Filter size={12} className="text-slate-400 mr-1" />
            <span className="text-[11px] text-slate-500 font-medium mr-1">
              Filter:
            </span>

            <button
              type="button"
              onClick={() => setEventFilter("all")}
              className={`px-2.5 py-1 rounded-lg  text-[11px] font-semibold transition-all cursor-pointer ${
                eventFilter === "all"
                  ? "bg-white text-slate-900 shadow-2xs border border-slate-200/80"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              All ({allTimelineEvents.length})
            </button>

            <button
              type="button"
              onClick={() => setEventFilter("responses")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                eventFilter === "responses"
                  ? "bg-white text-[#3525cd] shadow-2xs border border-indigo-100"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Responses (
              {allTimelineEvents.filter((e) => e.type === "detected").length})
            </button>

            <button
              type="button"
              onClick={() => setEventFilter("reminders")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                eventFilter === "reminders"
                  ? "bg-white text-amber-700 shadow-2xs border border-amber-100"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Reminders (
              {allTimelineEvents.filter((e) => e.type === "reminder").length})
            </button>
          </div>

          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
            <Clock size={10} />
            Auto-updated
          </span>
        </div>
      </div>

      {/* response timeline header */}
      <div className="pt-1 flex items-center justify-between">
        <h4 className="font-sans text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
          <Activity size={14} className="text-[#3525cd]" />
          <span>Timeline Events</span>
        </h4>
        <span className="text-[11px] font-mono text-slate-400 font-medium">
          Showing {filteredEvents.length} of {allTimelineEvents.length}
        </span>
      </div>

      {/* vertical timeline */}
      <div className="relative  pl-4 sm:pl-6 space-y-4 before:absolute before:top-2 before:bottom-2 before:left-3.75 sm:before:left-5.75 before:w-0.5 before:bg-slate-200">
        {filteredEvents.map((evt) => {
          const IconComponent = evt.icon;
          return (
            <div
              key={evt.id}
              className="relative flex items-start gap-3 text-xs font-sans"
            >
              {/* icon marker */}
              <div
                className={`relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full border ${evt.iconBg} ${evt.iconColor}  flex items-center justify-center shrink-0 shadow-2xs`}
              >
                <IconComponent size={14} />
              </div>

              {/* event content */}
              <div className="flex-1 min-w-0 bg-slate-50/50 border border-slate-200/60 p-3 rounded-xl space-y-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900">
                      {evt.title}
                    </span>
                    {evt.recipientEmail && (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] text-slate-600 bg-white border border-slate-200/80 px-2 py-0.5 rounded-md shadow-2xs font-medium">
                        <Mail size={10} className="text-slate-400 shrink-0" />
                        <span>{evt.recipientEmail}</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {evt.timestamp}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {evt.description}
                </p>

                {evt.badge && (
                  <div className="pt-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-indigo-50/80 text-[#3525cd] border border-indigo-100">
                      <Zap size={10} />
                      {evt.badge}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResponseTimeline;

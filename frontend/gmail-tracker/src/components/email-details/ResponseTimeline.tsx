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
    </div>
  );
};

export default ResponseTimeline;

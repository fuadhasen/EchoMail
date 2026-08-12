import { useToast } from "@/context/ToastContext";
import type { TrackedEmailB } from "@/services/trackedEmail";
import { formatSentDate } from "@/utils/dateFormatter";
import { Bell, Send, Sparkles } from "lucide-react";
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
        title: `Automatic Response Detected: ${r.name}`,
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
          title: `Follow-up Reminder Sent: ${r.name}`,
          description: `Follow-up reminder dispatched to ${r.name} (${r.email}).`,
          timestamp: formattedTime,
          icon: Bell,
          iconBg: "bg-amber-50 border-amber-100",
          iconColor: "text-amber-600",
        });
      }
    });
  };

  return <div>ResponseTimeline</div>;
};

export default ResponseTimeline;

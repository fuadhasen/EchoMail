import { useToast } from "@/context/ToastContext";
import {
  getTrackedEmailById,
  updateTrackedEmail,
  type TrackedEmail,
} from "@/data/mockTrackedEmails";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AlertTriangle, ArrowLeft, CheckCircle2, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
dayjs.extend(relativeTime);

const EmailDetail = () => {
  // const query = useUrlQuery();
  // const id = query.get("id");
  // const navigate = useNavigate();

  // const { response, data, error, isPending, sent_date, deadline } =
  //   useTrackedDetail(id!);

  // if (error) return <p>{error.message}</p>;
  // if (isPending) return <EmailDetailSkeleton />;
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { triggerToast } = useToast();
  const [email, setEmail] = useState<TrackedEmail | null>(null);

  useEffect(() => {
    if (id) {
      const found = getTrackedEmailById(id);
      if (found) {
        setEmail(found);
      } else {
        triggerToast("Tracked email thread not found", "info");
        navigate("/tracked");
      }
    }
  }, [id, navigate, triggerToast]);

  if (!email) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3525cd] " />
      </div>
    );
  }

  const totalRecipients = email.recipients.length;
  const respondedRecipients = email.recipients.filter((r) => r.responded);
  const pendingRecipients = email.recipients.filter((r) => !r.responded);
  const completionPercentage =
    totalRecipients > 0
      ? Math.round(respondedRecipients.length / totalRecipients) * 100
      : 0;

  // Actions
  const handleSendBuldReminder = () => {
    if (pendingRecipients.length == 0) {
      triggerToast("All recipients have already responded!", "info");
      return;
    }

    const updatedRecipients = email.recipients.map((r) => {
      if (!r.responded) {
        return { ...r, remindersSent: r.remindersSent + 1 };
      }

      return r;
    });

    const newLog = {
      id: `log-reminder-${Date.now()}`,
      type: "reminder" as const,
      description: `Bulk reminder sent to ${pendingRecipients.length} pending Recipients`,
      timestamp: new Date().toLocaleString(),
    };

    const updatedEmail: TrackedEmail = {
      ...email,
      recipients: updatedRecipients,
      activityLogs: [newLog, ...email.activityLogs],
    };

    updateTrackedEmail(updatedEmail);
    setEmail(updatedEmail);
    triggerToast(
      `Sent reminders to ${pendingRecipients.length} recipients!`,
      "success",
    );
  };

  const handleSendIndividualReminder = (recipientEmail: string) => {
    const updatedRecipients = email.recipients.map((r) => {
      if (r.email === recipientEmail) {
        return { ...r, reminderSent: r.remindersSent + 1 };
      }
      return r;
    });

    const recipient = email.recipients.find((r) => r.email === recipientEmail);
    const newLog = {
      id: `log-single-reminder-${Date.now()}`,
      type: "reminder" as const,
      description: `Reminder sent to ${recipient?.name || recipientEmail}`,
      timestamp: new Date().toLocaleString(),
    };

    const updatedEmail: TrackedEmail = {
      ...email,
      recipients: updatedRecipients,
      activityLogs: [newLog, ...email.activityLogs],
    };

    updateTrackedEmail(updatedEmail);
    setEmail(updatedEmail);
    triggerToast(
      `Reminder sent to ${recipient?.name || recipientEmail}!`,
      "success",
    );
  };

  const handleToggleRecipientResponded = (recipientEmail: string) => {
    const targetRecipient = email.recipients.find(
      (r) => r.email === recipientEmail,
    );

    if (!targetRecipient) return;

    const newStatus = !targetRecipient.responded;

    const updatedRecipients = email.recipients.map((r) => {
      if (r.email === recipientEmail) {
        return {
          ...r,
          responded: newStatus,
          respondedAt: newStatus ? new Date().toLocaleString() : undefined,
        };
      }
      return r;
    });

    const logAction = newStatus
      ? "Response logged from"
      : "Response removed for";

    const newLog = {
      id: `log-toggle-response-${Date.now()}`,
      type: (newStatus ? "reply" : "status_change") as any,
      description: `${logAction} ${targetRecipient.name} (${recipientEmail})`,
      timestamp: new Date().toLocaleString(),
    };

    const allDone = updatedRecipients.every((r) => r.responded);
    const updatedStatus = allDone ? "Completed" : "Pending";

    const updatedEmail: TrackedEmail = {
      ...email,
      recipients: updatedRecipients,
      status: updatedStatus,
      activityLogs: [newLog, ...email.activityLogs],
    };
    updateTrackedEmail(updatedEmail);
    setEmail(updatedEmail);
    triggerToast(
      newStatus
        ? `Logged response from ${targetRecipient.name}`
        : `Removed response log for ${targetRecipient.name}`,
      "success",
    );
  };

  const handleOverallStatus = (status: TrackedEmail["status"]) => {
    const newLog = {
      id: `log-status-${Date.now()}`,
      type: "status_change" as const,
      description: `Overall tracking status marked as ${status}`,
      timestamp: new Date().toLocaleString(),
    };

    const updatedEmail: TrackedEmail = {
      ...email,
      status,
      activityLogs: [newLog, ...email.activityLogs],
    };
    updateTrackedEmail(updatedEmail);
    setEmail(updatedEmail);
    triggerToast(`Email status updated to ${status}!`, "success");
  };

  const getStatusBadge = (status: TrackedEmail["status"]) => {
    switch (status) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9]">
            <CheckCircle2 size={13} className="stroke-[2.5]" />
            Completed
          </span>
        );
      case "Overdue":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#ffebee] text-[#c62828] border border-[#ffcdd2]">
            <AlertTriangle size={13} className="stroke-[2.5]" />
            Overdue
          </span>
        );
      case "Pending":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#eff4ff] text-[#3525cd] border border-[#c7c4d8]/30">
            <Clock size={13} className="stroke-[2.5]" />
            Awaiting Responses
          </span>
        );
    }
  };

  return (
    <div className="bg-red-100">
      {/* Back link and navigation */}
      <div>
        <div>
          <Link to={}>
            <ArrowLeft />
            Back to Tracked Emails
          </Link>
        </div>
      </div>

      {/* main grid layout */}
      <div>main grid layout</div>
    </div>
  );
};

export default EmailDetail;

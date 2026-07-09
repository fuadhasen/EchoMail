import { useToast } from "@/context/ToastContext";
import {
  getTrackedEmailById,
  updateTrackedEmail,
  type TrackedEmail,
} from "@/data/mockTrackedEmails";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
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
  };

  return <div>The emails detail page for the Id: {id}</div>;
};

export default EmailDetail;

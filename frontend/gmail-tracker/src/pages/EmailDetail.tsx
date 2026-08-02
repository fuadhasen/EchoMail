import ConversationSection from "@/components/email-details/ConversationSection";
import EmailDetailsSkeleton from "@/components/email-details/EmailDetailsSkeleton";
import EmailHeader from "@/components/email-details/EmailHeader";
import RecipientTrackingTable from "@/components/email-details/RecipientTrackingTable";
import RightPanel from "@/components/email-details/RightPanel";
import { useToast } from "@/context/ToastContext";
import {
  getTrackedEmailById,
  getTrackedEmails,
  updateTrackedEmail,
  type ThreadMessage,
  type TrackedEmail,
} from "@/data/mockTrackedEmails";
import useTrackedDetail from "@/hooks/useTrackedDetail";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
dayjs.extend(relativeTime);

const EmailDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { triggerToast } = useToast();

  const { data: email, isPending, error } = useTrackedDetail(id);
  console.log();

  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (error) {
      triggerToast("Unable to load tracked email.", "info");
      navigate("/tracked");
    }
  }, [error, navigate, triggerToast]);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 600);
    triggerToast("Gmail thread synced successfully.", "info");
  };

  if (isPending) {
    return (
      <div className="w-full text-left px-4 md:px-8 py-4">
        <EmailDetailsSkeleton />
      </div>
    );
  }

  if (!email) {
    return null;
  }

  const totalRecipients = email.recipients.length;
  const respondedRecipients = email.recipients.filter((r) => r.has_responded);
  const pendingRecipients = email.recipients.filter((r) => !r.has_responded);

  const requiredRecipients = email.recipients.filter(
    (r) => r.must_responded !== false,
  );
  const requiredResponded = requiredRecipients.filter((r) => r.has_responded);

  const completionPercentage =
    totalRecipients > 0
      ? Math.round((respondedRecipients.length / totalRecipients) * 100)
      : 0;

  // const handleSendIndividualReminder = (recipientEmail: string) => {
  //   const updatedRecipients = email.recipients.map((r) => {
  //     if (r.email === recipientEmail) {
  //       return { ...r, remindersSent: r.remindersSent + 1 };
  //     }
  //     return r;
  //   });

  //   const recipient = email.recipients.find((r) => r.email === recipientEmail);
  //   const updatedEmail: TrackedEmail = {
  //     ...email,
  //     recipients: updatedRecipients,
  //   };

  //   updateTrackedEmail(updatedEmail);
  //   setEmail(updatedEmail);
  //   triggerToast(
  //     `Reminder sent to ${recipient?.name || recipientEmail}!`,
  //     "success",
  //   );
  // };

  // const handleToggleRecipientResponded = (recipientEmail: string) => {
  //   const targetRecipient = email.recipients.find(
  //     (r) => r.email === recipientEmail,
  //   );
  //   if (!targetRecipient) return;

  //   const newStatus = !targetRecipient.responded;
  //   const nowFormatted = new Date().toLocaleString([], {
  //     dateStyle: "short",
  //     timeStyle: "short",
  //   });

  //   const updatedRecipients = email.recipients.map((r) => {
  //     if (r.email === recipientEmail) {
  //       return {
  //         ...r,
  //         responded: newStatus,
  //         respondedAt: newStatus ? nowFormatted : undefined,
  //       };
  //     }
  //     return r;
  //   });

  //   // check if thread messages need updating
  //   let existingMessages = email.threadMessages
  //     ? [...email.threadMessages]
  //     : [];
  //   if (newStatus) {
  //     // if marking as responded and no message exists from this email (not sent yet but user want to make it responded), create a mock message
  //     const hasMessage = existingMessages.some(
  //       (m) => m.senderEmail.toLowerCase() === recipientEmail.toLowerCase(),
  //     );
  //     if (!hasMessage) {
  //       const newMessage: ThreadMessage = {
  //         id: `msg-${Date.now()}`,
  //         senderName: targetRecipient.name,
  //         senderEmail: targetRecipient.email,
  //         timestamp: nowFormatted,
  //         content: `Thanks, I've reviewed the email and confirmed my approval.`,
  //       };
  //       // this recipient also responded with this message for this thread
  //       existingMessages.push(newMessage);
  //     }
  //   } else {
  //     // remove reply if toggling back to unresponded
  //     existingMessages = existingMessages.filter(
  //       (m) =>
  //         m.senderEmail.toLowerCase() !== recipientEmail.toLowerCase() ||
  //         m.isOutbound,
  //     );
  //   }

  //   // check if required recipients are all done(true or false)
  //   const requiredDone = updatedRecipients
  //     .filter((r) => r.isRequired !== false)
  //     .every((r) => r.responded);

  //   const updatedOverallStatus = requiredDone
  //     ? "Completed"
  //     : email.status === "Completed"
  //       ? "Pending"
  //       : email.status;

  //   const updatedEmail: TrackedEmail = {
  //     ...email,
  //     recipients: updatedRecipients,
  //     status: updatedOverallStatus,
  //     threadMessages: existingMessages,
  //   };
  //   updateTrackedEmail(updatedEmail);
  //   setEmail(updatedEmail);
  //   triggerToast(
  //     newStatus
  //       ? `Logged response from ${targetRecipient.name}`
  //       : `Removed response log for ${targetRecipient.name}`,
  //     "success",
  //   );
  // };

  const handleOverallStatus = (status: string) => {
    // const updatedEmail: TrackedEmail = {
    //   ...email,
    //   status,
    // };
    // updateTrackedEmail(updatedEmail);
    // setEmail(updatedEmail);
    triggerToast(`Email status updated to ${status}!`, "success");
  };

  // const handleMockReply = (
  //   senderName: string,
  //   senderEmail: string,
  //   content: string,
  // ) => {
  //   const nowFormatted = new Date().toLocaleString([], {
  //     dateStyle: "short",
  //     timeStyle: "short",
  //   });

  //   const newMsg: ThreadMessage = {
  //     id: `msg-${Date.now()}`,
  //     senderName,
  //     senderEmail,
  //     timestamp: nowFormatted,
  //     content,
  //   };
  //   const existingMessages = email.threadMessages
  //     ? [...email.threadMessages]
  //     : [];
  //   existingMessages.push(newMsg);

  //   // mark recipient as responded if they exist in the recipient list
  //   const updatedRecipients = email.recipients.map((r) => {
  //     if (r.email.toLowerCase() === senderEmail.toLowerCase()) {
  //       return {
  //         ...r,
  //         responded: true,
  //         respondedAt: nowFormatted,
  //       };
  //     }
  //     return r;
  //   });

  //   const updatedEmail: TrackedEmail = {
  //     ...email,
  //     recipients: updatedRecipients,
  //     threadMessages: existingMessages,
  //   };

  //   updateTrackedEmail(updatedEmail);
  //   setEmail(updatedEmail);
  //   triggerToast(`Added reply from ${senderName} to Gmail thread.`, "success");
  // };

  return (
    <div className="w-full text-left px-4 md:px-8 py-4 space-y-6">
      <EmailHeader
        email={email}
        isSyncing={isSyncing}
        onSync={handleSync}
        onSetStatus={handleOverallStatus}
      />

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* <div className="lg:col-span-8 space-y-6">
          <RecipientTrackingTable
            recipients={email.recipients}
            onSendReminder={handleSendIndividualReminder}
            onToggleResponse={handleToggleRecipientResponded}
          />

          <ConversationSection
            messages={email.threadMessages}
            subject={email.subject}
            onAddMockReply={handleMockReply}
          />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <RightPanel
            email={email}
            respondedCount={respondedRecipients.length}
            totalCount={totalRecipients}
            requiredCount={requiredRecipients.length}
            requiredRespondedCount={requiredResponded.length}
            completionPercentage={completionPercentage}
          />
        </div> */}
      </div>
    </div>
  );
};

export default EmailDetail;

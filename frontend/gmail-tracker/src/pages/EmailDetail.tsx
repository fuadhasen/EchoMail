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
import useMarkDone from "@/hooks/useMarkDone";
import useSendReminder from "@/hooks/useSendReminder";
import useTrackedDetail from "@/hooks/useTrackedDetail";
import type { TrackedRecipient } from "@/services/trackedEmail";
import { getTrackedEmailStatus } from "@/utils/statusFilter";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { MessageSquare, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
dayjs.extend(relativeTime);

const EmailDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { triggerToast } = useToast();
  const queryClient = useQueryClient();

  const { data: email, isPending, error } = useTrackedDetail(id);
  console.log();

  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<"recipients" | "conversation">(
    "recipients",
  );

  const markDoneMutation = useMarkDone();

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

  const sendReminderMutation = useSendReminder();
  const [sendingRecipient, setSendingRecipient] = useState<string | null>(null);
  const handleSendIndividualReminder = (recipientEmail: string) => {
    if (!email) return;

    setSendingRecipient(recipientEmail);

    sendReminderMutation.mutate(
      {
        trackedEmailId: email.id,
        recipientEmail: recipientEmail,
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ["tracked-emails", id],
          });

          triggerToast("Reminder recorded successfully.", "success");
        },

        // need further modification
        onError: () => {
          triggerToast("Unable to send reminder.", "info");
        },

        onSettled: () => {
          setSendingRecipient(null);
        },
      },
    );
  };

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

  const handleToggleRecipientResponded = () => {
    triggerToast("recipient status toggled function is executed", "info");
  };

  const handleMarkDone = () => {
    if (!email) return;

    markDoneMutation.mutate(email.id, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [`tracked-emails`, id],
        });

        await queryClient.invalidateQueries({
          queryKey: ["tracked-emails"],
        });

        triggerToast(`Email status updated Successfully`, "success");
      },

      onError: () => {
        triggerToast("Failed to mark email as complete.", "info");
      },
    });
  };

  if (isPending) {
    return (
      <div className="w-full text-left px-4 md:px-8 py-4">
        <EmailDetailsSkeleton />
      </div>
    );
  }

  // if there is now email with this detail id
  if (!email) {
    return null;
  }

  const totalRecipients = email.recipients.length;
  const respondedRecipients = email.recipients.filter((r) => r.has_responded);
  // const pendingRecipients = email.recipients.filter((r) => !r.has_responded);

  const requiredRecipients = email?.recipients.filter(
    (r) => r.must_responded !== false,
  );
  const requiredResponded = requiredRecipients?.filter((r) => r.has_responded);

  const completionPercentage =
    totalRecipients > 0
      ? Math.round((respondedRecipients.length / totalRecipients) * 100)
      : 0;

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
        onSetStatus={handleMarkDone}
      />

      {/* Work space View Mode Controller */}
      <div className="flex  flex-wrap items-center justify-between gap-3 bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("recipients")}
            className={`px-3.5 py-1.5 rounded-xl font-sans text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "recipients"
                ? "bg-[#3525cd] text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
            }`}
          >
            <Users size={14} />
            <span>Recipient Progress</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                activeTab === "recipients"
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {totalRecipients}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("conversation")}
            className={`px-3.5 py-1.5 rounded-xl font-sans text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "conversation"
                ? "bg-[#3525cd] text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
            }`}
          >
            <MessageSquare size={14} />
            <span>Conversation Thread</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                activeTab === "conversation"
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {0} hard coded
            </span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-3 pr-2 text-xs font-mono">
          <span className="text-slate-500">
            Completion:{" "}
            <strong className="text-slate-900">{completionPercentage}%</strong>
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500">
            Replies:{" "}
            <strong className="text-emerald-600">
              {respondedRecipients.length}/{totalRecipients}
            </strong>
          </span>
        </div>
      </div>

      {/* Dynamic View Mode Workspace */}
      {activeTab === "recipients" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            <RecipientTrackingTable
              recipients={email.recipients}
              onSendReminder={handleSendIndividualReminder}
              onToggleResponse={handleToggleRecipientResponded}
              isSending={sendingRecipient}
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
          </div>
        </div>
      )}

      {activeTab === "conversation" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            <ConversationSection
              messages={email.threadMessages}
              subject={email.subject}
              onAddMockReply={handleMockReply}
            />
          </div>
          <div className="lg:col-span-4 space-y-6">right panel</div>
        </div>
      )}

      {/* <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"> */}
      {/* <div className="lg:col-span-8 space-y-6"> */}
      {/* 
      {/* </div> */}
      {/*<div className="lg:col-span-4 space-y-6">
         
        </div> */}
      {/* // </div> */}
    </div>
  );
};

export default EmailDetail;

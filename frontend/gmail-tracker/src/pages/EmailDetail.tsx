import AutomaticDetectionCard from "@/components/email-details/AutomaticDetectionCard";
import ConversationSection from "@/components/email-details/ConversationSection";
import EmailDetailsSkeleton from "@/components/email-details/EmailDetailsSkeleton";
import EmailHeader from "@/components/email-details/EmailHeader";
import RecipientTrackingTable from "@/components/email-details/RecipientTrackingTable";
import ResponseTimeline from "@/components/email-details/ResponseTimeline";
import RightPanel from "@/components/email-details/RightPanel";
import { useToast } from "@/context/ToastContext";
import useEmailReply from "@/hooks/useEmailReply";
import useMarkDone from "@/hooks/useMarkDone";
import useMarkResponded from "@/hooks/useMarkResponded";
import useMarkUnResponded from "@/hooks/useMarkUnResponded";
import useSendReminder from "@/hooks/useSendReminder";
import useTrackedDetail from "@/hooks/useTrackedDetail";
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
  const {
    data: replyMessages,
    isPending: isReplyPending,
    error: replyError,
    refetch: refetchReplies,
    isFetching: isFetchingReplies,
  } = useEmailReply(email?.email_id);

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncOutbox = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 600);
  };

  const [activeTab, setActiveTab] = useState<
    "recipients" | "conversation" | "timeline"
  >("recipients");

  const markDoneMutation = useMarkDone();

  useEffect(() => {
    if (error) {
      triggerToast("Unable to load tracked email.", "info");
      navigate("/tracked");
    }
  }, [error, navigate, triggerToast]);

  useEffect(() => {
    if (replyError) {
      triggerToast("Unable to load conversation.", "info");
    }
  }, [replyError, triggerToast]);

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

    console.log("this endpoint is hitted");

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

  const markRespondedMutation = useMarkResponded();
  const [processingRecipient, setProcessingRecipient] = useState<string | null>(
    null,
  );
  // mark responded
  const handleToggleRecipientResponded = (recipientEmail: string) => {
    if (!email) return;

    setProcessingRecipient(recipientEmail);

    markRespondedMutation.mutate(
      {
        trackedEmailId: email.id,
        recipientEmail: recipientEmail,
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ["tracked-emails", id],
          });

          await queryClient.invalidateQueries({
            queryKey: ["tracked-emails"],
          });

          triggerToast("Mark recipient responded successfully.", "success");
        },

        onError: () => {
          triggerToast("Unable to mark responded.", "info");
        },

        onSettled: () => {
          setProcessingRecipient(null);
        },
      },
    );
  };

  const markUnRespondedMutation = useMarkUnResponded();
  const handleUndoResponded = (recipientEmail: string) => {
    if (!email) return;

    // here we need to make is_done = false

    setProcessingRecipient(recipientEmail);

    markUnRespondedMutation.mutate(
      {
        trackedEmailId: email.id,
        recipientEmail,
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ["tracked-emails", id],
          });

          await queryClient.invalidateQueries({
            queryKey: ["tracked-emails"],
          });

          triggerToast("Recipient response status undone.", "success");
        },

        onError: () => {
          triggerToast("Unable to undo response status.", "info");
        },

        onSettled: () => {
          setProcessingRecipient(null);
        },
      },
    );
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
    (r) => r.must_respond !== false,
  );
  const requiredResponded = requiredRecipients?.filter((r) => r.has_responded);

  const completionPercentage =
    totalRecipients > 0
      ? Math.round((respondedRecipients.length / totalRecipients) * 100)
      : 0;

  return (
    <div className="w-full text-left px-4 md:px-8 py-4 space-y-6">
      <EmailHeader
        email={email}
        isSyncing={isSyncing}
        onSync={handleSync}
        onSetStatus={handleMarkDone}
        activeView={activeTab}
        onViewChange={setActiveTab}
        replyMessages={replyMessages?.responses}
      />

      {/* Work space View Mode Controller */}

      {/* Dynamic View Mode Workspace */}
      {activeTab === "recipients" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            <RecipientTrackingTable
              recipients={email.recipients}
              onSendReminder={handleSendIndividualReminder}
              onToggleResponse={handleToggleRecipientResponded}
              onUndoResponded={handleUndoResponded}
              sendingRecipient={sendingRecipient}
              processingRecipient={processingRecipient}
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
              messages={replyMessages?.responses ?? []}
              email={email}
              isPending={isReplyPending}
              isError={replyError}
              onRetry={refetchReplies}
              isRetrying={isFetchingReplies}
            />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <AutomaticDetectionCard email={email} onSync={handleSyncOutbox} />
          </div>
        </div>
      )}

      {activeTab === "timeline" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            <ResponseTimeline email={email} />
          </div>

          <div className="lg:col-span-4 space-y-6">
            <AutomaticDetectionCard email={email} onSync={handleSyncOutbox} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailDetail;

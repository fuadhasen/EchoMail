import ConversationSection from "@/components/email-details/ConversationSection";
import EmailDetailsSkeleton from "@/components/email-details/EmailDetailsSkeleton";
import EmailHeader from "@/components/email-details/EmailHeader";
import RecipientTrackingTable from "@/components/email-details/RecipientTrackingTable";
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
      />

      {/* Work space View Mode Controller */}
      <div className="border-b border-slate-200/80 pl-2 text-center">
        <nav
          className="flex items-center gap-8 -mb-px"
          aria-label="Email view tabs"
        >
          <button
            type="button"
            onClick={() => setActiveTab("recipients")}
            className={`group relative pb-3 pt-1 text-sm font-sans transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === "recipients"
                ? "font-bold text-slate-900"
                : "font-medium text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>Recipients</span>
            <span
              className={`text-[11px] font-mono px-1.5 py-0.5 rounded-md font-semibold transition-colors ${
                activeTab === "recipients"
                  ? "bg-indigo-50 text-[#3525cd]"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {totalRecipients}
            </span>
            <span
              className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#3525cd] rounded-full transition-all duration-200 ${
                activeTab === "recipients"
                  ? "opacity-100 scale-x-100"
                  : "opacity-0 scale-x-75"
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("conversation")}
            className={`group relative pb-3 pt-1 text-sm font-sans transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === "conversation"
                ? "font-bold text-slate-900"
                : "font-medium text-slate-500 hover:text-slate-800"
            }`}
          >
            <span>Conversation</span>
            <span
              className={`text-[11px] font-mono px-1.5 py-0.5 rounded-md font-semibold transition-colors ${
                activeTab === "conversation"
                  ? "bg-indigo-50 text-[#3525cd]"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {replyMessages &&
                (replyMessages.responses.length > 0
                  ? replyMessages.responses.length + " replies"
                  : replyMessages.responses.length + " reply")}
            </span>
            <span
              className={`absolute bottom-0 left-0 right-0 h-0.5 bg-[#3525cd] rounded-full transition-all duration-200 ${
                activeTab === "conversation"
                  ? "opacity-100 scale-x-100"
                  : "opacity-0 scale-x-75"
              }`}
            />
          </button>
        </nav>
      </div>

      {/* 
         
      */}

      {/* Dynamic View Mode Workspace */}
      {activeTab === "recipients" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            <RecipientTrackingTable
              recipients={email.recipients}
              onSendReminder={handleSendIndividualReminder}
              onToggleResponse={handleToggleRecipientResponded}
              onUndoResponded={handleUndoResponded}
              isSending={sendingRecipient}
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
    </div>
  );
};

export default EmailDetail;

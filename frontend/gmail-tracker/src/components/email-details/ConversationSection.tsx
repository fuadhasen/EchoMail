import type { EmailReply } from "@/services/emailReply";
import { Clock, MessageSquare } from "lucide-react";
import ConversationMessage from "./ConversationMessage";
import { useState } from "react";
import ConversationSkeleton from "./ConversationSkeleton";
import type { TrackedEmailB } from "@/services/trackedEmail";
import { formatSentDate } from "@/utils/dateFormatter";
import ConversationError from "./ConversationError";

interface ConversationSectionProps {
  messages?: EmailReply[];
  email: TrackedEmailB;
  isPending: boolean;
  isError: Error | null;
  isRetrying: boolean;
  onRetry?: () => Promise<unknown>;
}

const ConversationSection = ({
  messages = [],
  email,
  isPending,
  isError,
  onRetry,
  isRetrying,
}: ConversationSectionProps) => {
  if (isPending) {
    return <ConversationSkeleton />;
  }

  if (isError) {
    return <ConversationError onRetry={onRetry} isRetrying={isRetrying} />;
  }
  const latestReply = messages.length - 1;

  const replyCount = messages.length;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
      {/* top header and subject */}
      <div className="pb-3 border-b border-slate-100 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg  bg-[#eff4ff] text-[#3525cd] flex items-center justify-center border border-[#3525cd]/15">
              <MessageSquare size={14} />
            </div>
            <div>
              <h3 className="font-sans text-xs font-bold text-slate-900 uppercase">
                Conversation Thread
              </h3>
            </div>

            <span className="text-[11px] font-mono font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200/60">
              {messages.length} {messages.length === 1 ? "message" : "messages"}
              {replyCount > 0 &&
                ` (${replyCount} ${replyCount === 1 ? "reply" : "replies"})`}
            </span>
          </div>
        </div>

        {/* email subject line and sub-metadata */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 bg-slate-50/70 p-2.5 rounded-xl border border-slate-200/50">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-mono font-semibold text-slate-400 block uppercase">
              Subject
            </span>
            <p className="font-sans text-xs sm:text-sm font-semibold text-slate-900 truncate">
              {email.subject}
            </p>
          </div>

          {email.sent_date && (
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 shrink-0">
              <span className="flex items-center gap-1">
                <Clock size={11} /> {formatSentDate(email.sent_date)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* message stack */}
      {messages.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-xs font-sans">
          No conversation messages captured in this thread yet.
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg, idx) => (
            <ConversationMessage
              key={msg.response_id}
              message={msg}
              isLatestReply={idx === latestReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ConversationSection;

import type { EmailReply } from "@/services/emailReply";
import { Clock, Inbox, MessageSquare } from "lucide-react";
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
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
      {/* header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#3525cd] flex items-center justify-center shrink-0">
            <MessageSquare size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-sans text-sm font-bold text-slate-900 tracking-tight">
                Thread Responses
              </h3>
              <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {replyCount} {replyCount === 1 ? "reply" : "replies"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* main thread body */}
      {messages.length === 0 ? (
        <div className="py-12 px-4 text-center bg-slate-50/30 flex flex-col items-center justify-center">
          <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
            <Inbox size={18} />
          </div>
          <h4 className="font-sans text-xs sm:text-sm font-bold text-slate-800">
            No responses yet
          </h4>
          <p className="font-sans text-xs text-slate-500 max-w-sm leading-normal mt-0.5">
            Conversation replies from recipients will appear here automatically.
          </p>
        </div>
      ) : (
        <div>
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

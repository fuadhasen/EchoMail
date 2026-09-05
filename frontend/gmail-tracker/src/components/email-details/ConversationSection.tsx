import type { EmailReply } from "@/services/emailReply";
import { Inbox, MessageSquare } from "lucide-react";
import ConversationMessage from "./ConversationMessage";
import ConversationSkeleton from "./ConversationSkeleton";
import type { TrackedEmailB } from "@/services/trackedEmail";
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
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden font-sans text-left">
      {/* header */}
      <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-[#3525cd] flex items-center justify-center shrink-0 border border-indigo-100/80">
            <MessageSquare size={16} />
          </div>
          <div className="flex items-center gap-2">
            <h3 className="font-sans text-sm font-bold text-slate-900 tracking-tight">
              Thread Responses
            </h3>
            <span className="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {replyCount} {replyCount === 1 ? "reply" : "replies"}
            </span>
          </div>
        </div>
      </div>

      {/* main thread body */}
      {messages.length === 0 ? (
        <div className="py-14 px-4 text-center bg-slate-50/40 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
            <Inbox size={20} />
          </div>
          <h4 className="font-sans text-sm font-bold text-slate-800">
            No responses yet
          </h4>
          <p className="font-sans text-xs text-slate-500 max-w-sm leading-relaxed mt-1">
            Conversation replies from recipients will automatically appear here as they arrive in your inbox.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
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

import type { EmailReply } from "@/services/emailReply";
import {
  formatEmail,
  formatSenderName,
  formatSentDate,
} from "@/utils/dateFormatter";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ConversationMessageProps {
  key?: string;
  message: EmailReply;
  isLatestReply?: boolean;
}

const ConversationMessage = ({
  message,
  isLatestReply,
}: ConversationMessageProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const textContent = message.snippet || "";
  const timeText = message.sent_at;

  const MAX_CHAR_LIMIT = 260;
  const isLongMessage = textContent.length > MAX_CHAR_LIMIT;
  const displayContent =
    isLongMessage && !isExpanded
      ? textContent.substring(0, MAX_CHAR_LIMIT) + "..."
      : textContent;

  const displayName = formatSenderName(message.sender) || message.sender;
  const emailAddress = formatEmail(message.sender);

  const initials = displayName
    ? displayName
        .split(/\s+/)
        .map((name) => name[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "??";

  return (
    <div className="p-4 sm:p-5 hover:bg-slate-50/40 transition-colors">
      <div className="flex items-start gap-3 sm:gap-3.5">
        {/* Avatar */}
        <div className="relative flex flex-col items-center shrink-0">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 select-none ${
              isLatestReply
                ? "bg-[#3525cd] text-white shadow-2xs"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
            }`}
          >
            {initials}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              <span className="font-sans text-xs sm:text-sm font-bold text-slate-900 truncate">
                {displayName}
              </span>

              {emailAddress && emailAddress !== displayName && (
                <span className="text-[11px] text-slate-500 font-sans truncate">
                  &lt;{emailAddress}&gt;
                </span>
              )}

              {isLatestReply && (
                <span className="text-[10px] font-mono font-semibold text-[#3525cd] bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                  Latest Response
                </span>
              )}
            </div>

            {timeText && (
              <time className="font-mono text-xs text-slate-400 shrink-0">
                {formatSentDate(timeText)}
              </time>
            )}
          </div>

          <div className="bg-slate-50/70 border border-slate-200/60 rounded-xl p-3 sm:p-3.5">
            <p className="font-sans text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap selection:bg-indigo-100">
              {displayContent}
            </p>

            {isLongMessage && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-xs font-semibold text-[#3525cd] hover:text-[#281ca8] cursor-pointer inline-flex items-center gap-1 transition-colors"
              >
                <span>{isExpanded ? "Show less" : "Read full message"}</span>
                {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationMessage;

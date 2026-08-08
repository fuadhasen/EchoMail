import type { EmailReply } from "@/services/emailReply";
import {
  formatEmail,
  formatSenderName,
  formatSentDate,
} from "@/utils/dateFormatter";
import { ChevronDown, ChevronUp, Sparkles, User } from "lucide-react";
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

  const textContent = message.snippet;
  const timeText = message.sent_at;

  const MAX_CHAR_LIMIT = 220;
  const isLongMessage = textContent.length > MAX_CHAR_LIMIT;
  const displayContent =
    isLongMessage && !isExpanded
      ? textContent.substring(0, MAX_CHAR_LIMIT) + "..."
      : textContent;

  return (
    <div
      className={`p-2 sm:px-4.5 sm:py-2.5 rounded-xl border transition-all duration-200 relative
        ${
          isLatestReply
            ? "bg-white border-[#3525cd]/30 ring-1 ring-[#3525cd]/10 shadow-2xs"
            : "bg-white border-slate-200/90 shadow-2xs hover:border-slate-300"
        }`}
    >
      {/* sender header */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-sans font-bold text-xs shrink-0 border ${"bg-emerald-50 text-emerald-700 border-emerald-200/80"}`}
          >
            {<User size={14} />}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-sans text-xs sm:text-sm font-semibold text-slate-900 truncate">
                {formatSenderName(message.sender)}
              </h4>

              {isLatestReply && (
                <span className="text-[10px] font-sans font-semibold text-[#3525cd] bg-[#eff4ff] border border-[#3525cd]/30 px-2 py-0.2 rounded-md flex items-center gap-1">
                  <Sparkles size={10} className="text-[#3525cd]" />
                  Lates Reply
                </span>
              )}
            </div>
            <p className="font-mono text-[11px] text-slate-500 truncate">
              {formatEmail(message.sender)}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-slate-400 font-medium shrink-0 pt-0.5">
          {formatSentDate(timeText)}
        </span>
      </div>

      {/* message body */}
      <div className="pl-10 sm:pl-10.5 pr-1">
        <p className="font-sans text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
          {displayContent}
        </p>

        {isLongMessage && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[#3525cd] hover:text-[#281ca8] focus:outline-none cursor-pointer"
          >
            <span>{isExpanded ? "Show less" : "Read full message"}</span>
            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default ConversationMessage;

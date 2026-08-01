import type { ThreadMessage } from "@/data/mockTrackedEmails";
import { CheckCircle2, User } from "lucide-react";
import React from "react";

interface ConversationMessageProps {
  key?: string;
  message: ThreadMessage;
}

const ConversationMessage = ({ message }: ConversationMessageProps) => {
  const isOutbound = message.isOutbound;
  const initials = message.senderName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
        isOutbound
          ? "bg-slate-50/70 border-slate-200/80"
          : "bg-white border-slate-200/90 shadow-2xs hover:border-slate-300"
      }`}
    >
      {/* sender bar */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-sans font-bold text-xs shrink-0 border ${
              isOutbound
                ? "bg-[#eff4ff] text-[#3525cd] border-[#3525cd]/20"
                : "bg-emerald-50 text-emerald-700 border-emerald-200/80"
            }`}
          >
            {initials || <User size={14} />}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-sans text-xs sm:text-sm font-semibold text-slate-900 truncate">
                {message.senderName}
              </h4>

              {isOutbound ? (
                <span className="text-[10px] font-mono font-medium text-[#3525cd] bg-[#eff4ff] border border-[#3525cd]/20 px-2 py-0.2 rounded-md">
                  Original Email
                </span>
              ) : (
                <span className="text-[10px] font-mono font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.2 rounded-md flex items-center gap-1">
                  <CheckCircle2 size={10} />
                  Gmail Reply
                </span>
              )}
            </div>
            <p className="font-mono text-[11px] text-slate-500 truncate">
              {message.senderEmail}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-slate-400 font-medium shrink-0 pt-0.5">
          {message.timestamp}
        </span>
      </div>

      {/* message body */}
      <div className="pl-11 pr-2">
        <p className="font-sans text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
      </div>
    </div>
  );
};

export default ConversationMessage;

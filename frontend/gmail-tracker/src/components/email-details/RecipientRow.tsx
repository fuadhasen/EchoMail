import type { Recipient } from "@/data/mockTrackedEmails";
import { Check, RotateCw, Send, User } from "lucide-react";
import React from "react";

interface RecipientRowProps {
  key?: string;
  recipient: Recipient;
  onSendReminder: (email: string) => void;
  onToggleResponse: (email: string) => void;
}

const RecipientRow = ({
  recipient,
  onSendReminder,
  onToggleResponse,
}: RecipientRowProps) => {
  const initials = recipient.name
    .split("")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const isRequired = recipient.isRequired !== false; //default to true if undefined

  return (
    <tr className="hover:bg-slate-50/70 transition-colors group">
      {/* responder name and email */}
      <td className="py-3.5 px-4 sm:px-5 align-middle">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-8 h-8 rounded-lg  flex items-center justify-center font-sans font-bold text-xs shrink-0 border ${
              recipient.responded
                ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                : "bg-amber-50 text-amber-800 border-amber-200/80"
            }`}
          >
            {initials || <User size={14} />}
          </div>

          <div className="min-w-0">
            <h4
              className={`font-sans text-xs sm:text-sm font-semibold truncate ${
                recipient.responded ? "text-slate-600" : "text-slate-900"
              }`}
            >
              {recipient.name}
            </h4>
            <p className="font-mono text-[11px] text-slate-500 truncate">
              {recipient.email}
            </p>
          </div>
        </div>
      </td>
      {/* required, optional field */}
      <td className="py-3.5 px-4 sm:px-5 align-middle whitespace-nowrap">
        {isRequired ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#3525cd] bg-[#eff4ff] border border-[#3525cd]/20 px-2.5 py-0.5 rounded-md">
            Required
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 border border-slate-200/60 px-2.5 py-0.5 rounded-md">
            Optional
          </span>
        )}
      </td>
      {/* Response status */}
      <td className="py-3.5 px-4 sm:px-5 align-middle whitespace-nowrap">
        {recipient.responded ? (
          <div className="space-y-0.5">
            <span className="inline-flex items-center gap-1  text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
              <Check size={11} className="stroke-2.5" />
              Responded
            </span>
            {recipient.respondedAt && (
              <p className="text-[10px] font-mono text-slate-400">
                {recipient.respondedAt}
              </p>
            )}
          </div>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-800 bg-amber-50  border border-amber-200/80 px-2.5 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Waiting Response
          </span>
        )}
      </td>
      {/* Reminder Sent */}
      <td className="py-3.5 px-4 sm:px-5 align-middle whitespace-nowrap font-mono text-xs text-slate-600">
        {recipient.remindersSent > 0 ? (
          <span className="font-semibold text-slate-800">
            {recipient.remindersSent} sent
          </span>
        ) : (
          <span className="text-slate-400">0 sent</span>
        )}
      </td>

      {/* quick action */}
      <td className="py-3.5 px-4 sm:px-5 align-middle text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-2">
          {recipient.responded ? (
            <>
              <button
                onClick={() => onSendReminder(recipient.email)}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 hover:border-slate-300 py-1 px-2.5 rounded-lg font-sans text-xs font-semibold flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                title="send direct reminder email"
              >
                <Send size={11} className="text-[#3525cd]" />
                <span>Remind</span>
              </button>

              <button
                onClick={() => onToggleResponse(recipient.email)}
                className="bg-[#3525cd] hover:bg-[#281ca8] text-white py-1 px-2.5 rounded-lg font-sans text-xs font-semibold flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
              >
                <Check />
                <span>Mark Responded</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => onToggleResponse(recipient.email)}
              className="bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200/80 py-1 px-2.5 rounded-lg font-sans text-xs font-medium flex items-center gap-1 transition-all cursor-pointer"
              title="Undo response status"
            >
              <RotateCw />
              Undo
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default RecipientRow;

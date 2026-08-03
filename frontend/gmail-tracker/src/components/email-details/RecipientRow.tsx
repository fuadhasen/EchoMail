import type { TrackedRecipient } from "@/services/trackedEmail";
import { getCooldownInfo } from "@/utils/reminderService";
import { Check, RotateCw, Send, User } from "lucide-react";
import { useState } from "react";

interface RecipientRowProps {
  key?: string;
  recipient: TrackedRecipient;
  onSendReminder: (email: string) => Promise<void> | void;
  onToggleResponse: (email: string) => void;
}

const RecipientRow = ({
  recipient,
  onSendReminder,
  onToggleResponse,
}: RecipientRowProps) => {
  const [isSending, setIsSending] = useState(false);
  const initials = recipient.name
    ? recipient.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : recipient.email.split("@")[0].substring(0, 2).toUpperCase();

  const isRequired = recipient.must_responded !== false; //default to true if undefined
  // check this recipient need reminder or not
  const cooldown = getCooldownInfo(recipient.last_reminder_sent);

  const handleSendReminderClick = async () => {
    if (isSending || !cooldown.isEligible) return;
    setIsSending(true);
    try {
      await onSendReminder(recipient.email);
    } catch {
      //error handled by parent service
    } finally {
      setIsSending(false);
    }
  };

  return (
    <tr className="hover:bg-slate-50/70 transition-colors group">
      {/* responder name and email */}
      <td className="py-3.5 px-4 sm:px-5 align-middle">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-8 h-8 rounded-lg  flex items-center justify-center font-sans font-bold text-xs shrink-0 border ${
              recipient.has_responded
                ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                : "bg-amber-50 text-amber-800 border-amber-200/80"
            }`}
          >
            {initials || <User size={14} />}
          </div>

          <div className="min-w-0">
            <h4
              className={`font-sans text-xs sm:text-sm font-semibold truncate ${
                recipient.has_responded ? "text-slate-600" : "text-slate-900"
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
        {recipient.has_responded ? (
          <div className="space-y-0.5">
            <span className="inline-flex items-center gap-1  text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
              <Check size={11} className="stroke-2.5" />
              Responded
            </span>
            {recipient.response_id && (
              <p className="text-[10px] font-mono text-slate-400">
                {recipient.response_id}
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
        {recipient.last_reminder_sent ? (
          <span className="font-semibold text-slate-800">
            {new Date(recipient.last_reminder_sent).toLocaleString()} sent
          </span>
        ) : (
          <span className="text-slate-400">Not sent</span>
        )}
      </td>

      {/* quick action */}
      <td className="py-3.5 px-4 sm:px-5 align-middle text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-2">
          {!recipient.has_responded ? (
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
                <Check size={12} className="stroke-2.5" />
                <span>Mark Responded</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => onToggleResponse(recipient.email)}
              className="bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200/80 py-1 px-2.5 rounded-lg font-sans text-xs font-medium flex items-center gap-1 transition-all cursor-pointer"
              title="Undo response status"
            >
              <RotateCw size={11} />
              Undo
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default RecipientRow;

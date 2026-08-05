import type { TrackedRecipient } from "@/services/trackedEmail";
import { getCooldownInfo } from "@/utils/reminderService";
import {
  Check,
  CheckCircle2,
  Clock,
  Info,
  Loader2,
  RotateCcw,
  Send,
  User,
} from "lucide-react";

interface RecipientRowProps {
  key?: string;
  recipient: TrackedRecipient;
  onSendReminder: (email: string) => Promise<void> | void;
  onToggleResponse: (email: string) => void;
  onUndoResponded: (email: string) => void;
  isSending: boolean;
  isMarking: boolean;
}

const RecipientRow = ({
  recipient,
  onSendReminder,
  onToggleResponse,
  onUndoResponded,
  isSending,
  isMarking,
}: RecipientRowProps) => {
  const initials = recipient.name
    ? recipient.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : recipient.email.split("@")[0].substring(0, 2).toUpperCase();

  // check this recipient need reminder or not
  const cooldown = getCooldownInfo(recipient.last_reminder_sent);

  const handleSendReminderClick = async () => {
    if (isSending || !cooldown.isEligible) return;
    onSendReminder(recipient.email);
  };

  return (
    <div
      className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-3 grou ${
        recipient.has_responded
          ? "bg-white border-slate-200/80 hover:border-emerald-300 shadow-2xs"
          : !cooldown.isEligible
            ? "bg-slate-50/50 border-slate-200/80 shadow-2xs"
            : "bg-white border-slate-200/80 hover:border-[#3525cd]/30 shadow-2xs"
      }`}
    >
      {/* left group: avatar, name, email, cooldown subtext */}
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <div className="relative shrink-0 mt-0.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-sans font-bold text-xs border ${
              recipient.has_responded
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            {initials || <User size={15} />}
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-sans text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-[#3525cd] transition-colors">
              {recipient.name}
            </h4>
          </div>

          <p className="font-mono text-[11px] text-slate-500 truncate">
            {recipient.email}
          </p>

          {/* cooldown information for pending responders */}
          {!recipient.has_responded && (
            <div className="pt-0.5 text-[11px] font-sans space-y-0.5">
              {!cooldown.isEligible ? (
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-slate-500">
                  <span className="inline-flex items-center gap-1 font-medium text-slate-600">
                    <Clock size={11} className="text-slate-400" />
                    Last reminder:{" "}
                    <strong className="font-semibold text-slate-700">
                      {cooldown.lastSentText}
                    </strong>
                  </span>
                  <span className="hidden sm:inline text-slate-300">•</span>
                  <span className="text-[#3525cd] font-medium bg-[#eff4ff] border border-[#3525cd]/15 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                    <Info size={10} />
                    {cooldown.timeRemainingText}
                  </span>
                </div>
              ) : (
                <div className="text-slate-500 text-[11px]">
                  {recipient.last_reminder_sent ? (
                    <span>
                      Last reminder:{" "}
                      <strong className="font-medium text-slate-700">
                        {cooldown.lastSentText}
                      </strong>
                    </span>
                  ) : (
                    <span className="text-slate-400">
                      No reminders sent yet
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* middle group: response status badge*/}
      <div className="flex items-center gap-4 text-xs shrink-0">
        <div>
          {recipient.has_responded ? (
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 size={11} className="text-emerald-600" />
                Responded
              </span>
              <span className="hidden lg:inline text-[10px] font-mono text-slate-400">
                {recipient.last_reminder_sent
                  ? `Last reminder: ${cooldown.lastSentText}`
                  : "No reminders sent"}
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full">
              <Clock size={11} className="text-amber-600 animate-pulse" />
              Awaiting Response
            </div>
          )}
        </div>

        {/* right action buttons */}
        <div className="flex items-center gap-2">
          {!recipient.has_responded ? (
            <>
              {cooldown.isEligible ? (
                <button
                  type="button"
                  onClick={handleSendReminderClick}
                  disabled={isSending}
                  className="bg-[#3525cd] hover:bg-[#281ca8] active:bg-[#1f1587] disabled:opacity-75 text-white py-1.5 px-3 rounded-lg font-sans text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                  title="Send follow-up reminder email"
                >
                  {isSending ? (
                    <>
                      <Loader2 size={12} className="animate-spin text-white" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={12} />
                      <span>Send Reminder</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="bg-slate-100 border border-slate-200/90 text-slate-500 font-sans text-xs font-medium py-1.5 px-3 rounded-lg flex items-center gap-1.5 cursor-not-allowed transition-all"
                  title={`Reminder on 24h cooldown. ${cooldown.timeRemainingText}`}
                >
                  <Clock size={12} className="text-slate-400" />
                  <span>{cooldown.buttonText}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onToggleResponse(recipient.email)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 py-1.5 px-2.5 rounded-lg font-sans text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                title="Manually mark as responded if you received a response outside this email thread."
              >
                {isMarking ? (
                  <>
                    <Loader2 size={12} className="animate-spin text-white" />
                    <span>Marking...</span>
                  </>
                ) : (
                  <>
                    <Check size={13} className="stroke-2.5" />
                    <span className="hidden sm:inline">Mark Responded</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => onUndoResponded(recipient.email)}
              className="bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/80 py-1.5 px-3 rounded-lg font-sans text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
              title="Undo response status"
            >
              {isMarking ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  <span>Undoing...</span>
                </>
              ) : (
                <>
                  <RotateCcw size={12} />
                  <span>Undo</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipientRow;

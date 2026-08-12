import type { TrackedRecipient } from "@/services/trackedEmail";
import {
  ArrowUpDown,
  Check,
  CheckCircle2,
  CheckSquare,
  Clock,
  Copy,
  Info,
  Loader2,
  MinusSquare,
  RotateCcw,
  Search,
  Send,
  Sparkles,
  Square,
  User,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useToast } from "@/context/ToastContext";
import { getCooldownInfo } from "@/utils/reminderService";

interface RecipientTrackingTableProps {
  recipients: TrackedRecipient[];
  onSendReminder: (email: string) => void;
  onToggleResponse: (email: string) => void;
  onUndoResponded: (email: string) => void;
  sendingRecipient: string | null;
  processingRecipient: string | null;
}

type SortField = "status" | "name" | "email" | "requirement";

const RecipientTrackingTable = ({
  recipients,
  onSendReminder,
  onToggleResponse,
  onUndoResponded,
  sendingRecipient,
  processingRecipient,
}: RecipientTrackingTableProps) => {
  const { triggerToast } = useToast();

  const [sortBy, setSortBy] = useState<SortField>("status");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // selection and dispatch states
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

  // const [isBulkSending, setIsBulkSending] = useState<boolean>(false);
  // const [sendingProgress, setIsSendingProgress] = useState<{
  //   current: number;
  //   total: number;
  // } | null>(null);

  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  // sort logic
  const sortedRecipients = useMemo(() => {
    return [...recipients].sort((a, b) => {
      let comparision = 0;
      if (sortBy === "status") {
        comparision =
          a.has_responded === b.has_responded ? 0 : a.has_responded ? 1 : -1;
      } else if (sortBy === "name") {
        comparision = (a.name ?? "").localeCompare(b.name ?? "");
      } else if (sortBy === "email") {
        comparision = a.email.localeCompare(b.email);
      } else if (sortBy === "requirement") {
        const aReq = a.must_respond !== false ? 1 : 0;
        const bReq = b.must_respond !== false ? 1 : 0;
        comparision = aReq - bReq;
      }

      return sortOrder === "asc" ? comparision : -comparision;
    });
  }, [recipients, sortBy, sortOrder]);

  // selection state helper
  const allSelected =
    sortedRecipients.length > 0 &&
    sortedRecipients.every((r) => selectedEmails.includes(r.email));

  const isSomeSelected =
    sortedRecipients.some((r) => selectedEmails.includes(r.email)) &&
    !allSelected;

  const handleToggleSelectAll = () => {
    const emails = sortedRecipients.map((r) => r.email);

    // if all remove, or add
    if (allSelected) {
      setSelectedEmails(
        selectedEmails.filter((email) => !emails.includes(email)),
      );
    } else {
      setSelectedEmails([
        ...selectedEmails,
        ...emails.filter((email) => !selectedEmails.includes(email)),
      ]);
    }
  };

  const handleToggleSelectOne = (email: string) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email],
    );
  };

  const handleSortToggle = (field: SortField) => {
    if (sortBy == field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleBulkSendReminders = async () => {
    // later u will check is that eligible or not
    triggerToast("Bulk Reminder sent to all recipients", "info");
  };

  const handleCopySelectedEmails = () => {
    const text = selectedEmails.join(",");
    navigator.clipboard.writeText(text);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  return (
    <>
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
        {/* header with title, search & filter tabs */}
        {selectedEmails.length > 0 && (
          <div className="bg-[#3525cd] text-white py-3 px-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm border-b border-indigo-900 transition-all duration-200 animate-in fade-in">
            <div className="flex items-center gap-3 text-xs font-sans">
              <span className="font-bold bg-white/20 text-white px-2.5 py-1 rounded-lg font-mono">
                {selectedEmails.length} of {recipients.length} Selected
              </span>

              <span className="text-indigo-100 hidden sm:inline text-xs font-medium">
                Perform action on selected recipients
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopySelectedEmails}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Copy selected email addresses to clipboard"
              >
                <Copy size={13} />
                <span>{copiedToast ? "Copied!" : "Copy Emails"}</span>
              </button>

              {/* bulk reminders dispatch button */}
              <button></button>
              <button
                type="button"
                onClick={() => setSelectedEmails([])}
                className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer ml-1"
                title="Deselect all"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Enterprise table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/90 border-b border-slate-200/90 text-[11px]  font-sans font-bold text-slate-600 uppercase tracking-wider select-none">
                <th className="py-3.5 px-4 w-12 text-center">
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    className="text-slate-400 hover:text-slate-700 focus:outline-none cursor-pointer  flex items-center justify-center mx-auto transition-colors"
                    title={allSelected ? "Deselect all" : "Select all"}
                  >
                    {allSelected ? (
                      <CheckSquare size={16} className="text-[#3525cd]" />
                    ) : isSomeSelected ? (
                      <MinusSquare size={16} className="text-[#3525cd]" />
                    ) : (
                      <Square
                        size={16}
                        className="text-slate-300 hover:text-slate-400"
                      />
                    )}
                  </button>
                </th>

                <th
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => handleSortToggle("name")}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={
                        sortBy === "name" ? "text-[#3525cd] font-extrabold" : ""
                      }
                    >
                      Recipient
                    </span>
                    <ArrowUpDown
                      size={12}
                      className={
                        sortBy === "name" ? "text-[#3525cd]" : "text-slate-400"
                      }
                    />
                  </div>
                </th>

                <th
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => handleSortToggle("requirement")}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={
                        sortBy === "requirement"
                          ? "text-[#3525cd] font-extrabold"
                          : ""
                      }
                    >
                      Obligation
                    </span>
                    <ArrowUpDown
                      size={12}
                      className={
                        sortBy === "requirement"
                          ? "text-[#3525cd]"
                          : "text-slate-400"
                      }
                    />
                  </div>
                </th>

                <th
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => handleSortToggle("status")}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={
                        sortBy === "status"
                          ? "text-[#3525cd] font-extrabold"
                          : ""
                      }
                    >
                      Response Status
                    </span>
                    <ArrowUpDown
                      size={12}
                      className={
                        sortBy === "status"
                          ? "text-[#3525cd]"
                          : "text-slate-400"
                      }
                    />
                  </div>
                </th>

                <th className="py-3.5 px-4">
                  <span>Follow-up & Cooldown</span>
                </th>

                <th className="py-3.5 px-4 text-right">
                  <span>Actions</span>
                </th>
              </tr>
            </thead>

            <tbody className="devide-y devide-slate-100 bg-white">
              {sortedRecipients.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-slate-400 text-xs"
                  >
                    No recipients found
                  </td>
                </tr>
              ) : (
                sortedRecipients.map((recipient) => {
                  const isSelected = selectedEmails.includes(recipient.email);
                  const isRequired = recipient.must_respond !== false;
                  const cooldown = getCooldownInfo(
                    recipient.last_reminder_sent,
                  );
                  // emails map for sending recipient will be true for some time (till backend call is finished)
                  const isSingleSending = sendingRecipient === recipient.email;
                  const isMarking = processingRecipient === recipient.email;

                  return (
                    <tr
                      key={recipient.email}
                      className={`hover:bg-slate-50/80 transition-colors text-xs font-sans ${
                        isSelected ? "bg-indigo-50/40" : ""
                      }`}
                    >
                      {/* checkbox */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleSelectOne(recipient.email)}
                          className="text-slate-400 hover:text-slate-700 cursor-pointer flex items-center justify-center mx-auto transition-colors"
                        >
                          {isSelected ? (
                            <CheckSquare size={16} className="text-[#3525cd]" />
                          ) : (
                            <Square
                              size={16}
                              className="text-slate-300 hover:text-slate-400"
                            />
                          )}
                        </button>
                      </td>

                      {/* recipient profile */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border ${
                              recipient.has_responded
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-indigo-50 text-[#3525cd] border-indigo-100"
                            }`}
                          >
                            {<User size={14} />}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 truncate text-xs sm:text-sm">
                              {recipient.name}
                            </h4>
                            <p className="font-mono text-[11px] text-slate-500 truncate">
                              {recipient.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* requirement role */}
                      <td className="py-3 px-4">
                        {isRequired ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-50 text-[#3525cd] border border-indigo-100">
                            Required
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium text-slate-500 bg-slate-100 border border-slate-200">
                            Optional
                          </span>
                        )}
                      </td>

                      {/* status */}
                      <td className="py-3 px-4">
                        {recipient.has_responded ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full">
                            <CheckCircle2
                              size={13}
                              className="text-emerald-600"
                            />
                            <span>Responded</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full">
                            <Clock
                              size={13}
                              className="text-amber-600 animate-pulse"
                            />
                            <span>Awaiting Reply</span>
                          </span>
                        )}
                      </td>

                      {/* cooldown info */}
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {!recipient.has_responded ? (
                          cooldown.isEligible ? (
                            <span className="text-emerald-700 font-semibold inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                              <Sparkles
                                size={11}
                                className="text-emerald-600"
                              />
                              Ready for follow-up
                            </span>
                          ) : (
                            <span className="text-slate-600 inline-flex items-center gap-1">
                              <Info size={11} className="text-amber-500" />
                              Cooldown: {cooldown.timeRemainingText}
                            </span>
                          )
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* action button */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!recipient.has_responded ? (
                            <>
                              {cooldown.isEligible ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    onSendReminder(recipient.email)
                                  }
                                  disabled={isSingleSending}
                                  className="bg-[#3525cd] hover:bg-[#281ca8] active:bg-[#1f1587] disabled:opacity-75 text-white py-1 px-3 rounded-lg font-sans text-[11px]  font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                                  title="Send individual reminder email"
                                >
                                  {isSingleSending ? (
                                    <>
                                      <Loader2
                                        size={10}
                                        className="animate-spin text-white"
                                      />
                                      <span>Sending...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Send
                                        size={11}
                                        className="shrink-0 translate-y-[0.5px]"
                                      />
                                      <span className="leading-none">
                                        Send Reminder
                                      </span>
                                    </>
                                  )}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  disabled
                                  className="bg-slate-100 text-slate-400 border border-slate-200/80 py-1 px-2 rounded-lg text-[11px] font-medium cursor-not-allowed"
                                  title={
                                    cooldown.timeRemainingText || undefined
                                  }
                                >
                                  On cooldown
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() =>
                                  onToggleResponse(recipient.email)
                                }
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 py-1 px-2 rounded-lg font-semibold text-[11px] flex items-center gap-1 transition-all cursor-pointer"
                                title="Mark manually as responded"
                              >
                                {isMarking ? (
                                  <>
                                    <Loader2
                                      size={12}
                                      className="animate-spin text-white"
                                    />
                                    <span>Marking...</span>
                                  </>
                                ) : (
                                  <>
                                    <Check size={13} className="stroke-2.5" />
                                    <span className="hidden sm:inline">
                                      Done
                                    </span>
                                  </>
                                )}
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onUndoResponded(recipient.email)}
                              className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 py-1 px-2.5 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
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
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* table footer */}
        <div className="p-4 border-t border-slate-200/80 bg-slate-50/80 flex items-center justify-between gap-3 text-xs text-slate-600 font-sans">
          <div className="flex items-center gap-3"></div>
        </div>
      </div>
    </>
  );
};

export default RecipientTrackingTable;

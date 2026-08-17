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
type StatusFilter = "all" | "pending" | "responded";

const RecipientTrackingTable = ({
  recipients,
  onSendReminder,
  onToggleResponse,
  onUndoResponded,
  sendingRecipient,
  processingRecipient,
}: RecipientTrackingTableProps) => {
  const { triggerToast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

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

  const totalCount = recipients.length;
  const respondedCount = recipients.filter((r) => r.has_responded).length;
  const pendingCount = totalCount - respondedCount;

  // filtered Recipients
  const filteredRecipients = useMemo(() => {
    return recipients.filter((recipient) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        recipient.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipient.email.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (statusFilter === "pending") return !recipient.has_responded;
      if (statusFilter === "responded") return recipient.has_responded;

      return true;
    });
  }, [recipients, searchQuery, statusFilter]);

  // selection state helper
  const allSelected =
    filteredRecipients.length > 0 &&
    filteredRecipients.every((r) => selectedEmails.includes(r.email));

  const isSomeSelected =
    filteredRecipients.some((r) => selectedEmails.includes(r.email)) &&
    !allSelected;

  const handleToggleSelectAll = () => {
    if (allSelected) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(filteredRecipients.map((r) => r.email));
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

  // const handleBulkSendReminders = async () => {
  //   // later u will check is that eligible or not
  //   triggerToast("Bulk Reminder sent to all recipients", "info");
  // };

  const handleCopySelectedEmails = () => {
    const text = selectedEmails.join(",");
    navigator.clipboard.writeText(text);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  return (
    <>
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden font-sans text-left">
        {/* 1. Header Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search recipients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3525cd]/15 focus:border-[#3525cd] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100/70 p-1 rounded-xl border border-slate-200/70 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === "all"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("pending")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === "pending"
                  ? "bg-white text-[#3525cd] shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Awaiting ({pendingCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("responded")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === "responded"
                  ? "bg-white text-emerald-700 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Check size={12} className="text-emerald-600 stroke-[2.5]" />
              <span>Responded ({respondedCount})</span>
            </button>
          </div>
        </div>

        {selectedEmails.length > 0 && (
          <div className="bg-indigo-50 border-b border-indigo-100 px-4 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-150">
            <div className="flex items-center gap-2 text-xs text-slate-800">
              <span className="w-5 h-5 rounded-full bg-[#3525cd] text-white flex items-center justify-center font-bold text-[10px]">
                {selectedEmails.length}
              </span>
              <span className="font-semibold">Selected</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={handleCopySelectedEmails}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Copy size={12} />
                <span>Copy</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedEmails([])}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                title="Clear selection"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Enterprise table */}
        <div className="p-4 sm:p-5 space-y-2.5 bg-slate-50/40">
          {filteredRecipients.length === 0 ? (
            <div className="py-12 px-4 text-center space-y-2 bg-white rounded-xl border border-slate-200/80">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <User size={18} />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                No recipients found
              </h3>
              <p className="text-xs text-slate-500">
                Try adjusting your search or filter.
              </p>
            </div>
          ) : (
            filteredRecipients.map((recipient) => {
              const isSelected = selectedEmails.includes(recipient.email);
              const isRequired = recipient.must_respond !== false;
              const cooldown = getCooldownInfo(recipient.last_reminder_sent);

              const isSingleSending = sendingRecipient === recipient.email;
              const isMarking = processingRecipient === recipient.email;

              return (
                <div
                  key={recipient.email}
                  className={`bg-white rounded-xl border transition-all duration-150 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group ${
                    isSelected
                      ? "border-[#3525cd] bg-indigo-50/20 shadow-xs"
                      : "border-slate-200/90 hover:border-slate-300 hover:shadow-xs"
                  }`}
                >
                  {/* Left: Checkbox + Avatar + Name + Email + Tag */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Select Checkbox */}
                    <button
                      type="button"
                      onClick={() => handleToggleSelectOne(recipient.email)}
                      className="text-slate-400 hover:text-slate-700 cursor-pointer shrink-0"
                      aria-label={`Select ${recipient.name}`}
                    >
                      {isSelected ? (
                        <CheckSquare size={16} className="text-[#3525cd]" />
                      ) : (
                        <Square
                          size={16}
                          className="text-slate-300 group-hover:text-slate-400"
                        />
                      )}
                    </button>

                    {/* Clean Initials Avatar with Live Status Dot */}
                    <div className="relative shrink-0">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                          recipient.has_responded
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-indigo-50 text-[#3525cd] border border-indigo-100"
                        }`}
                      >
                        {<User size={13} />}
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                          recipient.has_responded
                            ? "bg-emerald-500"
                            : "bg-amber-400"
                        }`}
                      />
                    </div>

                    {/* Name, Email & Requirement Badge */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                          {recipient.name}
                        </h4>
                        {isRequired ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                            Required
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium text-slate-400 bg-slate-50">
                            Optional
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <span className="truncate text-[11px]">
                          {recipient.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Clean Status Capsule & Direct Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {/* Status Pill */}
                    {recipient.has_responded ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                        <Check size={11} className="stroke-[2.5]" />
                        <span>Responded</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/70">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        <span>Awaiting</span>
                      </span>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      {!recipient.has_responded ? (
                        <>
                          {cooldown.isEligible ? (
                            <button
                              type="button"
                              onClick={() => onSendReminder(recipient.email)}
                              disabled={isSingleSending}
                              className="bg-[#3525cd] hover:bg-[#281ca8] text-white py-1.5 px-3 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
                              title="Send nudge email"
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
                            <span
                              className="bg-slate-100 text-slate-500 px-2.5 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1 cursor-default"
                              title={
                                cooldown.timeRemainingText || "In cooldown"
                              }
                            >
                              <Clock size={11} className="text-slate-400" />
                              <span>
                                {cooldown.timeRemainingText || "Cooldown"}
                              </span>
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => onToggleResponse(recipient.email)}
                            className="bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 py-1.5 px-2.5 rounded-lg font-medium text-xs flex items-center gap-1 transition-all cursor-pointer"
                            title="Mark response as complete"
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
                                <span className="hidden sm:inline">Done</span>
                              </>
                            )}
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onUndoResponded(recipient.email)}
                          className="bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 border border-slate-200 py-1.5 px-2.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all cursor-pointer"
                          title="Revert to awaiting response"
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
            })
          )}
        </div>

        {/* table footer */}
        <div className="px-4 sm:px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleSelectAll}
              className="inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-slate-900 cursor-pointer select-none"
            >
              {allSelected ? (
                <CheckSquare size={14} className="text-[#3525cd]" />
              ) : isSomeSelected ? (
                <MinusSquare size={14} className="text-[#3525cd]" />
              ) : (
                <Square
                  size={14}
                  className="text-slate-300 hover:text-slate-400"
                />
              )}
              <span>Select all</span>
            </button>
          </div>

          <span>
            {respondedCount} of {totalCount} completed (
            {Math.round((respondedCount / (totalCount || 1)) * 100)}%)
          </span>
        </div>
      </div>
    </>
  );
};

export default RecipientTrackingTable;

import type { TrackedRecipient } from "@/services/trackedEmail";
import {
  ArrowUpDown,
  CheckCircle2,
  CheckSquare,
  Clock,
  MinusSquare,
  Search,
  Square,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
import RecipientRow from "./RecipientRow";
import { useToast } from "@/context/ToastContext";
import { getCooldownInfo } from "@/utils/reminderService";

interface RecipientTrackingTableProps {
  recipients: TrackedRecipient[];
  onSendReminder: (email: string) => void;
  onToggleResponse: (email: string) => void;
  onUndoResponded: (email: string) => void;
  isSending: string | null;
  processingRecipient: string | null;
}

type SortField = "status" | "name" | "email" | "requirement";

const RecipientTrackingTable = ({
  recipients,
  onSendReminder,
  onToggleResponse,
  onUndoResponded,
  isSending,
  processingRecipient,
}: RecipientTrackingTableProps) => {
  const { triggerToast } = useToast();

  const [sortBy, setSortBy] = useState<SortField>("status");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // pagination state
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // selection and dispatch states
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [sendingEmailsMap, setSendingEmailsMap] = useState<
    Record<string, boolean>
  >({});

  // Bulk action and processing state
  const [isBulkSending, setIsBulkSending] = useState<boolean>(false);
  const [sendingProgress, setIsSendingProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);

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

  const handleSortToggle = (field: Sortfeild) => {
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
                  const isSingleSending = !!sendingEmailsMap[recipient.email];

                  const initials =
                    recipient.name ??
                    ""
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase();

                  return (
                    <tr
                      key={recipient.email}
                      className={`hover:bg-slate-50/80 transition-colors text-xs font-sans ${
                        isSelected ? "bg-indigo-50/40" : ""
                      }`}
                    >
                      {/* checkbox */}
                      <td>
                        {isSelected ? (
                          <CheckSquare size={16} className="text-[#3525cd]" />
                        ) : (
                          <Square
                            size={16}
                            className="text-slate-300 hover:text-slate-400"
                          />
                        )}
                      </td>

                      {/* recipient profile */}
                      <td></td>

                      {/* requirement role */}
                      <td></td>

                      {/* status */}
                      <td></td>

                      {/* cooldown info */}
                      <td></td>

                      {/* action button */}
                      <td></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* <div className="bg-white border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 bg-slate-50/40">
            {recipients.length === 0 ? (
              <div className="p-8 text-center bg-white border border-slate-200/80 rounded-xl space-y-2">
                <p className="text-slate-500 text-xs font-semibold">
                  No recipients found
                </p>
                <p className="text-slate-400 text-xs">
                  No recipients match your current search or filter criteria.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 -p-10">
                {recipients.map((recipient) => (
                  <RecipientRow
                    key={recipient.email}
                    recipient={recipient}
                    onSendReminder={onSendReminder}
                    onToggleResponse={onToggleResponse}
                    onUndoResponded={onUndoResponded}
                    isSending={isSending === recipient.email}
                    isMarking={processingRecipient === recipient.email}
                  />
                ))}
              </div>
            )}
          </div>
        </div> */}
      </div>
    </>
  );
};

export default RecipientTrackingTable;

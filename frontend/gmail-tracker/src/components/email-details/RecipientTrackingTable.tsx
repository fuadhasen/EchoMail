import type { TrackedRecipient } from "@/services/trackedEmail";
import { CheckCircle2, Clock, Search, User } from "lucide-react";
import { useState } from "react";
import RecipientRow from "./RecipientRow";

interface RecipientTrackingTableProps {
  recipients: TrackedRecipient[];
  onSendReminder: (email: string) => void;
  onToggleResponse: (email: string) => void;
}

const RecipientTrackingTable = ({
  recipients,
  onSendReminder,
  onToggleResponse,
}: RecipientTrackingTableProps) => {
  const [activeFilter, setActiveFilter] = useState<
    "all" | "pending" | "responded" | "required"
  >("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const pendingList = recipients.filter((r) => !r.has_responded);
  const respondedList = recipients.filter((r) => r.has_responded);
  const requiredList = recipients.filter((r) => r.must_responded !== false);

  const filteredRecipients = recipients.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      r.name?.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q);

    if (activeFilter === "pending") return matchesQuery && !r.has_responded;
    if (activeFilter === "responded") return matchesQuery && r.has_responded;
    if (activeFilter === "required")
      return matchesQuery && r.must_responded !== false;
    return matchesQuery;
  });

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
      {/* header with title, search & filter tabs */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#3525cd] flex items-center justify-center border border-[#3525cd]/15">
            <User size={16} />
          </div>

          <div>
            <h2 className="font-sans text-sm font-bold text-slate-900 tracking-tight">
              Recipient Progress
            </h2>
            <span className="text-[11px] font-sans text-slate-500">
              Track individual responses and send targeted reminders
            </span>
          </div>
        </div>

        {/* controls row: search input and filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
          {/* search box on the left */}
          <div className="relative flex-1 max-w-xs">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search responder by name or email..."
              className="w-full bg-slate-50/80 border border-slate-200/80 rounded-xl py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3525cd]/15 focus:border-[#3525cd] transition-all font-sans"
            />
          </div>

          {/* quick filter tab */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-100/80 p-1 rounded-xl">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === "all"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              All {recipients.length}
            </button>

            <button
              onClick={() => setActiveFilter("pending")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === "pending"
                  ? "bg-white text-amber-800 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Clock size={12} className="text-amber-500" />
              Awaiting ({pendingList.length})
            </button>

            <button
              onClick={() => setActiveFilter("responded")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === "responded"
                  ? "bg-white text-emerald-700 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <CheckCircle2 size={12} className="text-emerald-500" />
              Responded ({respondedList.length})
            </button>

            <button
              onClick={() => setActiveFilter("required")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === "required"
                  ? "bg-white text-[#3525cd] shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Required ({requiredList.length})
            </button>
          </div>
        </div>
      </div>

      {/* recipient workspace */}
      <div className="p-4 sm:p-5 bg-slate-50/40">
        {filteredRecipients.length === 0 ? (
          <div className="p-8 text-center bg-white border border-slate-200/80 rounded-xl space-y-2">
            <p className="text-slate-500 text-xs font-semibold">
              No recipients found
            </p>
            <p className="text-slate-400 text-xs">
              No recipients match your current search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredRecipients.map((recipient) => (
              <RecipientRow
                key={recipient.email}
                recipient={recipient}
                onSendReminder={onSendReminder}
                onToggleResponse={onToggleResponse}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipientTrackingTable;

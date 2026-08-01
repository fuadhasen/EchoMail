import type { Recipient } from "@/data/mockTrackedEmails";
import { CheckCircle2, Clock, Search, User } from "lucide-react";
import React, { useState } from "react";
import RecipientRow from "./RecipientRow";

interface RecipientTrackingTableProps {
  recipients: Recipient[];
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

  const pendingList = recipients.filter((r) => !r.responded);
  const respondedList = recipients.filter((r) => r.responded);
  const requiredList = recipients.filter((r) => r.isRequired !== false);

  const filteredRecipients = recipients.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q);

    if (activeFilter === "pending") return matchesQuery && !r.responded;
    if (activeFilter === "responded") return matchesQuery && r.responded;
    if (activeFilter === "required")
      return matchesQuery && r.isRequired !== false;
    return matchesQuery;
  });

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-slate-200/80 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <User size={16} className="text-[#3525cd]" />
            <h2 className="font-sans text-sm font-bold text-slate-900 tracking-tight">
              Recipient Tracking Workspace
            </h2>
            <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200/60">
              {recipients.length} total
            </span>
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

        {/* search input */}
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search responder by name or email..."
            className="w-full bg-slate-50/70 border border-slate-200/80 rounded-xl py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3525cd]/15 focus:border-[#3525cd] transition-all font-sans"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-2.5 px-4 sm:px-5">Responder</th>
              <th className="py-2.5 px-4 sm:px-5">Requirement</th>
              <th className="py-2.5 px-4 sm:px-5">Status</th>
              <th className="py-2.5 px-4 sm:px-5">Reminders</th>
              <th className="py-2.5 px-4 sm:px-5 text-right">Quick Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredRecipients.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-8 text-center text-slate-400 text-xs font-sans"
                >
                  No responders match your filter criteria.
                </td>
              </tr>
            ) : (
              filteredRecipients.map((recipient) => (
                <RecipientRow
                  key={recipient.email}
                  recipient={recipient}
                  onSendReminder={onSendReminder}
                  onToggleResponse={onToggleResponse}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecipientTrackingTable;

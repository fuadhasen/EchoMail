import type { TrackedEmail } from "@/data/mockTrackedEmails";
import type { TrackedEmailB } from "@/services/trackedEmail";
import {
  formatDeadline,
  formatSenderName,
  formatSentDate,
} from "@/utils/dateFormatter";
import { getTrackedEmailStatus } from "@/utils/statusFilter";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Hourglass,
  RefreshCw,
  RotateCcw,
  User,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import MarkCompleteModal from "./MarkCompleteModal";

interface EmailHeaderProps {
  email: TrackedEmailB;
  isSyncing?: boolean;
  onSync?: () => void;
  onSetStatus: () => void;
}

const EmailHeader = ({
  email,
  isSyncing,
  onSync,
  onSetStatus,
}: EmailHeaderProps) => {
  const [isMarkCompleteModalOpen, setIsMarkCompleteModalOpen] = useState(false);
  const status = getTrackedEmailStatus(email.is_done, email.deadline);
  const displayStatus = status;

  const getStatusBadge = () => {
    switch (displayStatus) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
            <CheckCircle2 size={13} className="text-emerald-600" />
            Completed
          </span>
        );

      case "Overdue":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs">
            <AlertTriangle size={13} className="text-rose-600 animate-pulse" />
            Overdue
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs">
            <Clock size={13} className="text-amber-600 animate-pulse" />
            Awaiting Responses
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 pb-4 border-b border-slate-200/80">
      {/* quick action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-500 font-sans">
          <Link
            to={"/tracked"}
            className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-slate-900 transition-colors group cursor-pointer"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-0.5 transition-transform text-slate-400 group-hover:text-slate-700"
            />
            <span>TrackedEmails</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-mono text-slate-400 font-medium">
            Thread #{email.thread_id}
          </span>
        </div>
      </div>

      {/* main workspace header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pt-1">
        <div className="space-y-3 flex-1 min-w-0">
          <h1 className="font-sans text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
            {email.subject}
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 font-sans">
            <div className="hidden lg:block">{getStatusBadge()}</div>

            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
              <User size={13} className="text-slate-400 shrink-0" />
              <span className="text-slate-500">Sender:</span>
              <span className="font-semibold text-slate-800">
                {formatSenderName(email.sender)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
              <Calendar size={13} className="text-slate-400 shrink-0" />
              <span className="text-slate-500">Sent:</span>
              <span className="font-semibold text-slate-800">
                {formatSentDate(email.sent_date || Date.now())}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
              <Hourglass size={13} className="text-slate-400 shrink-0" />
              <span className="text-slate-500">Deadline:</span>
              <span className="font-semibold text-slate-800">
                {formatDeadline(email.deadline)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
          {onSync && (
            <button
              onClick={onSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 px-3.5 py-2 rounded-xl shadow-2xs transition-all cursor-pointer disabled:opacity-50"
              title="Sync Gmail Thread"
            >
              <RefreshCw
                size={12}
                className={`text-slate-500 ${isSyncing ? "animate-spin text-[#3525cd]" : ""}`}
              />
              <span>{isSyncing ? "Syncing..." : "Sync Thread"}</span>
            </button>
          )}

          {status !== "Completed" ? (
            <button
              onClick={() => setIsMarkCompleteModalOpen(true)}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-sans text-xs font-semibold shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
            >
              <Check
                size={14}
                className="text-emerald-100 group-hover:scale-105 transition-transform"
              />
              <span>Mark as Complete</span>
            </button>
          ) : (
            <button
              onClick={() => onSetStatus()}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 px-3.5 py-2 rounded-xl font-sans text-xs font-semibold transition-all cursor-pointer"
            >
              <RotateCcw size={13} className="text-slate-500" />
              <span>Re-open Thread</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation modal */}
      <MarkCompleteModal
        isOpen={isMarkCompleteModalOpen}
        onClose={() => setIsMarkCompleteModalOpen(false)}
        onConfirm={() => onSetStatus()}
        email={email}
      />
    </div>
  );
};

export default EmailHeader;

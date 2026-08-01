import type { TrackedEmail } from "@/data/mockTrackedEmails";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Hourglass,
  RefreshCw,
  Send,
  User,
} from "lucide-react";
import React from "react";
import { Link } from "react-router";

interface EmailHeaderProps {
  email: TrackedEmail;
  pendingCount: number;
  onSendBulkReminder: () => void;
  onSetStatus: (status: TrackedEmail["status"]) => void;
  isSyncing?: boolean;
  onSync?: () => void;
}

const EmailHeader = ({
  email,
  pendingCount,
  onSendBulkReminder,
  onSetStatus,
  isSyncing,
  onSync,
}: EmailHeaderProps) => {
  const displayStatus = email.status === "Pending" ? "Waiting" : email.status;
  const senderName = email.sender || "You (Product Lead)";

  const getStatusBadge = () => {
    switch (displayStatus) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-2xs">
            <CheckCircle2 size={13} className="stroke-[2.5]" />
            Completed
          </span>
        );

      case "Overdue":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-600 text-white shadow-2xs">
            <AlertTriangle size={13} className="stroke-[2.5]" />
            Overdue
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#3525cd] text-white shadow-2xs">
            <Clock size={13} className="stroke-[2.5]" />
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
            Thread #{email.id}
          </span>
        </div>

        {onSync && (
          <button
            onClick={onSync}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80 hover:border-slate-300 px-3 py-1.5 rounded-lg  shadow-2xs transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw
              size={12}
              className={`text-slate-500 ${isSyncing ? "animate-spin" : ""}`}
            />
            <span>Sync Thread</span>
          </button>
        )}
      </div>

      {/* main workspace header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pt-1">
        <div className="space-y-3 flex-1 min-w-0">
          <h1 className="font-sans text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
            {email.subject}
          </h1>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-600 font-sans">
            {getStatusBadge()}

            <span className="text-slate-300 hidden sm:inline">•</span>

            <div className="flex items-center gap-1.5">
              <User size={13} className="text-slate-400" />
              <span className="text-slate-500">Sender:</span>
              <span className="font-semibold text-slate-800">{senderName}</span>
            </div>

            <span className="text-slate-300">•</span>

            <div className="flex items-center gap-1.5">
              <Calendar size={13} className="text-slate-400" />
              <span className="text-slate-500">Sent:</span>
              <span className="font-medium text-slate-800">
                {email.sentDate}
              </span>
            </div>

            <span className="text-slate-300">•</span>

            <div className="flex items-center gap-1.5">
              <Hourglass size={13} className="text-slate-400" />
              <span className="text-slate-500">Deadline:</span>
              <span className="font-medium text-slate-800">
                {email.deadline}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
          <button
            onClick={onSendBulkReminder}
            disabled={pendingCount === 0}
            className="bg-[#3525cd] hover:bg-[#281ca8] text-white disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed border border-transparent py-2 px-3.5 rounded-lg font-sans text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <Send size={13} className="stroke-2" />
            <span>Send Reminder ({pendingCount})</span>
          </button>

          {email.status !== "Completed" ? (
            <button
              onClick={() => onSetStatus("Completed")}
              className="bg-white hover:bg-slate-50 text-slate-700   border border-slate-200 hover:border-slate-300 py-2 px-3.5 rounded-lg font-sans text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <Check size={14} className="text-emerald-600 stroke-[2.5]" />
              <span>Mark Complete</span>
            </button>
          ) : (
            <button
              onClick={() => onSetStatus("Pending")}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 py-2 px-3.5 rounded-lg font-sans text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <RefreshCw size={12} className="text-slate-500 stroke-[2.5]" />
              <span>Mark Incomplete</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailHeader;

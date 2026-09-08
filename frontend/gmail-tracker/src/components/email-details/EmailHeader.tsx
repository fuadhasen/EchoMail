import type { EmailReply } from "@/services/emailReply";
import type { TrackedEmailB } from "@/services/trackedEmail";
import {
  formatDeadline,
  formatSenderName,
  formatSentDate,
} from "@/utils/dateFormatter";
import { getTrackedEmailStatus } from "@/utils/statusFilter";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock3,
  Hourglass,
  MessageSquare,
  Radio,
  RotateCcw,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import MarkCompleteModal from "./MarkCompleteModal";
import { useToast } from "@/context/ToastContext";

export type WorkspaceViewMode = "recipients" | "conversation" | "timeline";

interface EmailHeaderProps {
  email: TrackedEmailB;
  activeView: WorkspaceViewMode;
  onViewChange: (view: WorkspaceViewMode) => void;
  isSyncing?: boolean;
  onSync?: () => void;
  onSetStatus: () => void;
  replyMessages?: EmailReply[];
}

const EmailHeader = ({
  email,
  activeView,
  onViewChange,
  onSetStatus,
  replyMessages = [],
}: EmailHeaderProps) => {
  const { triggerToast } = useToast();
  const [isMarkCompleteModalOpen, setIsMarkCompleteModalOpen] = useState(false);
  const status = getTrackedEmailStatus(email.is_done, email.deadline);
  const displayStatus = status;

  const totalRecipients = email.recipients?.length || 0;
  const respondedRecipients =
    email.recipients?.filter((r) => r.has_responded).length || 0;

  const reopenThread = () => {
    triggerToast("Email status updated to incomplete", "success");
  };
  const getStatusBadge = () => {
    switch (displayStatus) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shrink-0 shadow-2xs">
            <CheckCircle2 size={13} className="text-emerald-600 stroke-[2.5]" />
            <span>Completed</span>
          </span>
        );
      case "Overdue":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 shrink-0 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span>Overdue</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-[#3525cd] border border-indigo-200/70 shrink-0 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3525cd] animate-pulse" />
            <span>Active Tracking</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl shadow-xs font-sans text-left overflow-hidden transition-all">
      {/* subtle navigation bar */}
      <div className="px-5 sm:px-6 pt-4 pb-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5 text-xs flex-wrap">
          <Link
            to={"/app/tracked"}
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 font-semibold transition-colors cursor-pointer group"
          >
            <ArrowLeft
              size={14}
              className="text-slate-400 group-hover:text-slate-700 group-hover:-translate-x-0.5 transition-transform"
            />
            <span>TrackedEmails</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-600 bg-slate-50 hover:bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/80 transition-colors">
            Thread #{email.thread_id}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-200/70 px-2.5 py-1 rounded-full">
            <Radio size={11} className="text-[#3525cd]" />
            <span>Autonomous Sentinel Active</span>
          </div>

          {getStatusBadge()}
        </div>
      </div>

      {/* main workspace header */}
      <div className="p-5 sm:p-6 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          {/* email subject and metadata chips */}
          <div className="space-y-3 min-w-0 max-w-4xl">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-snug">
              {email.subject || "(No subject)"}
            </h1>

            {/* Email context metadata chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-sans">
              {email.sender && (
                <div className="inline-flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/70 text-slate-700">
                  <User size={12} className="text-slate-400 shrink-0" />
                  <span className="text-slate-500">From:</span>
                  <span className="font-semibold text-slate-800">
                    {formatSenderName(email.sender)}
                  </span>
                </div>
              )}

              {email.sent_date && (
                <div className="inline-flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/70 text-slate-700">
                  <Calendar size={12} className="text-slate-400 shrink-0" />
                  <span className="text-slate-500">Sent:</span>
                  <span className="font-semibold text-slate-800">
                    {formatSentDate(email.sent_date)}
                  </span>
                </div>
              )}

              {email.deadline && (
                <div className="inline-flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/70 text-slate-700">
                  <Hourglass size={12} className="text-slate-400 shrink-0" />
                  <span className="text-slate-500">Deadline:</span>
                  <span className="font-semibold text-slate-800">
                    {formatDeadline(email.deadline)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* quick primary action */}
          <div className="flex items-center gap-2.5 shrink-0 self-start pt-1">
            {status !== "Completed" ? (
              <button
                onClick={() => setIsMarkCompleteModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 active:scale-[0.98] transition-all cursor-pointer shadow-sm hover:shadow"
              >
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>Mark Complete</span>
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>

      {/* Lens tabs bar */}
      <div className="px-5 sm:px-6 py-2.5 bg-slate-50/80 border-t border-slate-200/80 flex items-center justify-between gap-4">
        <nav className="flex items-center gap-1.5 select-none overflow-x-auto w-full sm:w-auto">
          {/* Lens1: Recipients */}
          <button
            type="button"
            aria-selected={activeView === "recipients"}
            onClick={() => onViewChange("recipients")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap ${
              activeView === "recipients"
                ? "bg-white text-slate-900 shadow-2xs border border-slate-200/90"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/40 border border-transparent"
            }`}
          >
            <Users
              size={14}
              className={
                activeView === "recipients"
                  ? "text-[#3525cd] stroke-[2.4]"
                  : "text-slate-400"
              }
            />
            <span>Recipients</span>
            <span
              className={`font-mono text-[11px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                activeView === "recipients"
                  ? "bg-indigo-50 text-[#3525cd] border border-indigo-100"
                  : "bg-slate-200/70 text-slate-600"
              }`}
            >
              {respondedRecipients}/{totalRecipients}
            </span>
          </button>

          {/* Lens2: Conversation */}
          <button
            type="button"
            role="tab"
            aria-selected={activeView === "conversation"}
            id="nav-view-conversation"
            onClick={() => onViewChange("conversation")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap ${
              activeView === "conversation"
                ? "bg-white text-slate-900 shadow-2xs border border-slate-200/90"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/40 border border-transparent"
            }`}
          >
            <MessageSquare
              size={14}
              className={
                activeView === "conversation"
                  ? "text-[#3525cd] stroke-[2.4]"
                  : "text-slate-400"
              }
            />
            <span>Conversation</span>
            {replyMessages && replyMessages.length > 0 && (
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-semibold transition-colors ${
                  activeView === "conversation"
                    ? "bg-indigo-50 text-[#3525cd] border border-indigo-100"
                    : "bg-slate-200/70 text-slate-600"
                }`}
              >
                {replyMessages.length}
              </span>
            )}
          </button>

          {/* Lens3: Response Timeline */}
          <button
            type="button"
            role="tab"
            aria-selected={activeView === "timeline"}
            id="nav-view-timeline"
            onClick={() => onViewChange("timeline")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap ${
              activeView === "timeline"
                ? "bg-white text-slate-900 shadow-2xs border border-slate-200/90"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/40 border border-transparent"
            }`}
          >
            <Clock3
              size={14}
              className={
                activeView === "timeline"
                  ? "text-[#3525cd] stroke-[2.4]"
                  : "text-slate-400"
              }
            />
            <span>Response Timeline</span>
            <span
              className={`inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                activeView === "timeline"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/70"
                  : "bg-slate-200/70 text-slate-600"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </button>
        </nav>
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

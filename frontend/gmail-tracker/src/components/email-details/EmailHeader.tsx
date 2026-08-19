import type { EmailReply } from "@/services/emailReply";
import type { TrackedEmailB } from "@/services/trackedEmail";
import { getTrackedEmailStatus } from "@/utils/statusFilter";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  MessageSquare,
  Radio,
  RotateCcw,
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shrink-0">
            <CheckCircle2 size={12} className="text-emerald-600 stroke-[2.5]" />
            <span>Completed</span>
          </span>
        );
      case "Overdue":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span>Overdue</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50/90 text-[#3525cd] border border-indigo-100 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3525cd] animate-pulse" />
            <span>Active Tracking</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] font-sans text-left overflow-hidden transition-all">
      {/* subtl navigation bar */}
      <div className="px-5 sm:px-6 pt-4 sm:pt-5 pb-3 flex flex-wrap items-center justify-between  gap-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5 text-xs">
          <Link
            to={"/tracked"}
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 font-medium transition-colors cursor-pointer group"
          >
            <ArrowLeft
              size={14}
              className="text-slate-400 group-hover:text-slate-700 group-hover:-translate-x-0.5 transition-transform"
            />
            <span>TrackedEmails</span>
          </Link>
          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/80 transition-colors cursor-pointer">
            Thread #{email.thread_id}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-200/70 px-2.5 py-0.5 rounded-full">
            <Radio size={11} className="text-[#3525cd]" />
            <span>Autonomous Sentinel Active</span>
          </div>

          {getStatusBadge()}
        </div>
      </div>

      {/* main workspace header */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          {/* email subject */}
          <div className="space-y-2 min-w-0 max-w-3xl">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 leading-snug">
              {email.subject}
            </h1>

            {/* <div>metal line</div> */}
          </div>

          {/* quick primary action */}
          <div className="flex items-center gap-2.5 shrink-0 self-start lg:self-start pt-1">
            {status !== "Completed" ? (
              <button
                onClick={() => setIsMarkCompleteModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 active:scale-[0.98] transition-all cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
              >
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>Mark Complete</span>
              </button>
            ) : (
              <button
                onClick={() => reopenThread()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer shadow-2xs"
              >
                <RotateCcw size={13} className="text-slate-500" />
                <span>Re-open Thread</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-6 py-2.5 bg-slate-50/80 border-t border-slate-200/80 flex items-center justify-between gap-4">
        <nav className="flex items-center gap-1 select-none overflow-x-auto w-full sm:w-auto">
          {/* Lens1: Recipients */}
          <button
            type="button"
            aria-selected={activeView === "recipients"}
            onClick={() => onViewChange("recipients")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer whitespace-nowrap ${
              activeView === "recipients"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200/90"
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
              className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold transition-colors ${
                activeView === "recipients"
                  ? "bg-indigo-50 text-[#3525cd] border border-indigo-100"
                  : "bg-slate-200/70 text-slate-600"
              }`}
            >
              {respondedRecipients}/{totalRecipients}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeView === "conversation"}
            id="nav-view-conversation"
            onClick={() => onViewChange("conversation")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer whitespace-nowrap ${
              activeView === "conversation"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200/90"
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
            <span
              className={`text-[11px] font-mono px-1.5 py-0.5 rounded-md font-semibold transition-colors ${
                activeView === "conversation"
                  ? "bg-indigo-50 text-[#3525cd]"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {replyMessages &&
                (replyMessages.length > 0
                  ? replyMessages.length + " replies"
                  : replyMessages.length + " reply")}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeView === "timeline"}
            id="nav-view-timeline"
            onClick={() => onViewChange("timeline")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer whitespace-nowrap ${
              activeView === "timeline"
                ? "bg-white text-slate-900 shadow-xs border border-slate-200/90"
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
              className={`inline-flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold transition-colors ${
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

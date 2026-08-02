import type { TrackedEmailB } from "@/services/trackedEmail";
import { getTrackedEmailStatus } from "@/utils/statusFilter";
import { CheckCircle, CheckCircle2, Mail, User, X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface MarkCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  email: TrackedEmailB;
}

const MarkCompleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  email,
}: MarkCompleteModalProps) => {
  const status = getTrackedEmailStatus(email.isDone, email.deadline);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const totalRecipients = email.recipients?.length || 0;
  const respondedRecipients =
    email.recipients?.filter((r) => r.has_responded).length || 0;

  const dispalyStatus = status;

  const handleConfirm = () => {
    setIsSubmitting(true);
    // Simulate short delay for mock action confirmation
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirm();
      onClose();
    }, 500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
      aria-modal="true"
      role="dialog"
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl  border border-slate-200/90 shadow-xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* header */}
        <div className="p-5 pb-0 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/70 flex items-center justify-center shrink-0">
              <CheckCircle2 size={20} className="stroke-[2.2]" />
            </div>

            <h3 className="font-sans text-lg font-bold text-slate-900 leading-snug">
              Mark email as complete ?
            </h3>
            <p className="font-sans text-xs text-slate-500 mt-0.5">
              Stop active tracking for this thread
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-start gap-2">
            <Mail size={14} className="text-slate-400 shrink-0 mt-0.5" />
            <span className="font-sans text-xs font-bold text-slate-800 line-clamp-2 leading-snug">
              {email.subject}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-xs font-sans">
            <div className="flex items-center gap-1.5 text-slate-500">
              <User size={13} className="text-slate-400" />
              <span>
                <strong className="text-slate-700">{totalRecipients}</strong>{" "}
                recipient
                {totalRecipients !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
              <CheckCircle2 size={13} className="text-emerald-500" />
              <span>
                <strong className="text-emerald-700">
                  {respondedRecipients}
                </strong>
                of {totalRecipients} responded
              </span>
            </div>
          </div>
        </div>

        <div>modal action footer</div>
      </div>
    </div>
  );
};

export default MarkCompleteModal;

import type { TrackedEmailB } from "@/services/trackedEmail";
import { getTrackedEmailStatus } from "@/utils/statusFilter";
import {
  CheckCircle,
  CheckCircle2,
  Loader2,
  Mail,
  User,
  X,
} from "lucide-react";
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="mark-complete-modal-title"
    >
      <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-6 space-y-4 text-left font-sans animate-in zoom-in-95 duration-150">
        <div className="space-y-1.5">
          <h3
            id="mark-complete-modal-title"
            className="text-base font-semibold text-slate-900 tracking-tight"
          >
            Mark this email as complete?
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Active tracking and automated reminders will be stopped for this
            thread.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-slate-950 hover:bg-slate-800 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 shadow-2xs"
            id="btn-confirm-mark-complete"
          >
            {isSubmitting ? "Marking Complete..." : "Mark Complete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkCompleteModal;

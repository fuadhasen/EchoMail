import type { TrackedEmailB } from "@/services/trackedEmail";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";

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

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirm();
      onClose();
    }, 500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="mark-complete-modal-title"
    >
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-6 space-y-4 text-left font-sans animate-in zoom-in-95 duration-150 relative">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} className="stroke-[2.5]" />
          </div>

          <div className="space-y-1 pr-4">
            <h3
              id="mark-complete-modal-title"
              className="text-base font-bold text-slate-900 tracking-tight"
            >
              Mark email as complete?
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Active tracking and automated reminders will be stopped for this thread. You can re-open it at any time.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 shadow-sm"
            id="btn-confirm-mark-complete"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={12} className="animate-spin text-white" />
                <span>Marking Complete...</span>
              </>
            ) : (
              <span>Mark Complete</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkCompleteModal;
